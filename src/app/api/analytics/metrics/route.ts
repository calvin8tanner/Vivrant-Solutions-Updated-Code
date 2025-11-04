import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { AnalyticsData, TimeframeType } from '@/types/analytics'

type WorkflowMetrics = {
  status: string
  _count: {
    id: number
  }
}[]

type CostMetrics = {
  model: string
  _sum: {
    cost: number | null
  }
}[]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeframe = (searchParams.get('timeframe') || 'week') as TimeframeType

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

    // Get AI usage metrics
    const aiMetrics = await prisma.aiInteraction.aggregate({
      where: {
        timestamp: {
          gte: startDate,
          lte: now,
        },
      },
      _count: {
        id: true,
      },
      _avg: {
        duration: true,
      },
    })

    // Get successful interactions count
    const successfulInteractions = await prisma.aiInteraction.count({
      where: {
        timestamp: {
          gte: startDate,
          lte: now,
        },
        status: 'success',
      },
    })

    // Calculate success rate
    const totalInteractions = aiMetrics._count.id
    const successRate = totalInteractions > 0 
      ? (successfulInteractions / totalInteractions) * 100 
      : 100

    // Get workflow metrics
    const workflowMetrics = await prisma.workflow.groupBy({
      by: ['status'],
      where: {
        startTime: {
          gte: startDate,
          lte: now,
        },
      },
      _count: {
        id: true,
      },
    })

    // Get cost metrics
    const costMetrics = await prisma.aiInteraction.groupBy({
      by: ['model'],
      where: {
        timestamp: {
          gte: startDate,
          lte: now,
        },
      },
      _sum: {
        cost: true,
      },
    })

    // Format the response
    const analyticsData: AnalyticsData = {
      aiUsage: {
        totalCalls: totalInteractions,
        avgResponseTime: aiMetrics._avg.duration || 0,
        successRate,
      },
      workflowMetrics: {
        active: workflowMetrics.find((m: { status: string }) => m.status === 'active')?._count.id || 0,
        completed: workflowMetrics.find((m: { status: string }) => m.status === 'completed')?._count.id || 0,
        failed: workflowMetrics.find((m: { status: string }) => m.status === 'failed')?._count.id || 0,
      },
      costMetrics: {
        total: costMetrics.reduce((sum: number, curr: { _sum: { cost: number | null } }) => sum + (curr._sum.cost || 0), 0),
        byService: costMetrics.map((service: { model: string; _sum: { cost: number | null } }) => ({
          name: service.model,
          cost: service._sum.cost || 0,
        })),
      },
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics metrics:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}