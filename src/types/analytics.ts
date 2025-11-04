export type TimeframeType = 'day' | 'week' | 'month'

export interface AIUsageMetrics {
  totalCalls: number
  avgResponseTime: number
  successRate: number
}

export interface WorkflowMetrics {
  active: number
  completed: number
  failed: number
}

export interface ServiceCost {
  name: string
  cost: number
}

export interface CostMetrics {
  total: number
  byService: ServiceCost[]
}

export interface AnalyticsData {
  aiUsage: AIUsageMetrics
  workflowMetrics: WorkflowMetrics
  costMetrics: CostMetrics
}

export interface AIUsageDetails {
  id: string
  timestamp: string
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  duration: number
  status: 'success' | 'error'
  errorMessage?: string
}

export interface WorkflowDetails {
  id: string
  name: string
  status: 'active' | 'completed' | 'failed'
  startTime: string
  endTime?: string
  duration?: number
  steps: {
    total: number
    completed: number
    failed: number
  }
}

export interface CostAnalysis {
  timeframe: TimeframeType
  totalCost: number
  services: {
    name: string
    cost: number
    usage: number
    unit: string
  }[]
  dailyBreakdown: {
    date: string
    cost: number
  }[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}