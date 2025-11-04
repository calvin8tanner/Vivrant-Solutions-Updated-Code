import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { AIUsageDetails, PaginatedResponse, TimeframeType } from '@/types/analytics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeframe = (searchParams.get('timeframe') || 'week') as TimeframeType
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

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

    // Get paginated AI usage details
    const [total, aiUsage] = await Promise.all([
      prisma.aiInteraction.count({
        where: {
          timestamp: {
            gte: startDate,
            lte: now,
          },
        },
      }),
      prisma.aiInteraction.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: now,
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        skip,
        take: limit,
      }),
    ])

    // Format the response
    const aiUsageDetails: AIUsageDetails[] = aiUsage.map((interaction) => ({
      id: interaction.id,
      timestamp: interaction.timestamp.toISOString(),
      model: interaction.model,
      promptTokens: interaction.promptTokens,
      completionTokens: interaction.completionTokens,
      totalTokens: interaction.totalTokens,
      duration: interaction.duration,
      status: interaction.status as 'success' | 'error',
      errorMessage: interaction.errorMessage || undefined,
    }))

    const response: PaginatedResponse<AIUsageDetails> = {
      data: aiUsageDetails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching AI usage details:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}