import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { WorkflowDetails, TimeframeType } from '@/types/analytics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeframe = (searchParams.get('timeframe') || 'week') as TimeframeType
    const status = searchParams.get('status')

    // Calculate the start date based on timeframe
    const now = new Date()
    let startDate = new Date()
    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    // Build the where clause
    const where = {
      startTime: {
        gte: startDate,
        lte: now,
      },
      ...(status && { status }),
    }

    // Get workflow details
    const workflows = await prisma.workflow.findMany({
      where,
      include: {
        steps: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    // Format the response
    const workflowDetails: WorkflowDetails[] = workflows.map((workflow: {
      id: string;
      name: string;
      status: string;
      startTime: Date;
      endTime: Date | null;
      duration: number | null;
      steps: { status: string }[];
    }) => {
      const totalSteps = workflow.steps.length
      const completedSteps = workflow.steps.filter((step: { status: string }) => step.status === 'completed').length
      const failedSteps = workflow.steps.filter((step: { status: string }) => step.status === 'failed').length

      return {
        id: workflow.id,
        name: workflow.name,
        status: workflow.status as 'active' | 'completed' | 'failed',
        startTime: workflow.startTime.toISOString(),
        endTime: workflow.endTime?.toISOString(),
        duration: workflow.duration,
        steps: {
          total: totalSteps,
          completed: completedSteps,
          failed: failedSteps,
        },
      }
    })

    return NextResponse.json(workflowDetails)
  } catch (error) {
    console.error('Error fetching workflow details:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}