import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { CostAnalysis, TimeframeType } from '@/types/analytics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeframe = (searchParams.get('timeframe') || 'week') as TimeframeType
    const service = searchParams.get('service')

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
      timestamp: {
        gte: startDate,
        lte: now,
      },
      ...(service && { model: service }),
    }

    // Get aggregated costs by service
    const [totalCost, serviceMetrics, dailyCosts] = await Promise.all([
      prisma.aiInteraction.aggregate({
        where,
        _sum: {
          cost: true,
        },
      }),
      prisma.aiInteraction.groupBy({
        by: ['model'],
        where,
        _sum: {
          cost: true,
          totalTokens: true,
        },
      }),
      prisma.aiInteraction.groupBy({
        by: ['timestamp'],
        where,
        _sum: {
          cost: true,
        },
      }),
    ])

    // Format the response
    const costAnalysis: CostAnalysis = {
      timeframe,
      totalCost: totalCost._sum.cost || 0,
      services: serviceMetrics.map((metric: {
        model: string;
        _sum: {
          cost: number | null;
          totalTokens: number | null;
        };
      }) => ({
        name: metric.model,
        cost: metric._sum.cost || 0,
        usage: metric._sum.totalTokens || 0,
        unit: 'tokens',
      })),
      dailyBreakdown: dailyCosts.map((day: {
        timestamp: Date;
        _sum: {
          cost: number | null;
        };
      }) => ({
        date: day.timestamp.toISOString().split('T')[0],
        cost: day._sum.cost || 0,
      })),
    }

    return NextResponse.json(costAnalysis)
  } catch (error) {
    console.error('Error fetching cost analysis:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}