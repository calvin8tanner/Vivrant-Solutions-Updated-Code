'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'

interface AnalyticsData {
  aiUsage: {
    totalCalls: number
    avgResponseTime: number
    successRate: number
  }
  workflowMetrics: {
    active: number
    completed: number
    failed: number
  }
  costMetrics: {
    total: number
    byService: {
      name: string
      cost: number
    }[]
  }
}

const sampleData: AnalyticsData = {
  aiUsage: {
    totalCalls: 1234,
    avgResponseTime: 0.8,
    successRate: 98.5
  },
  workflowMetrics: {
    active: 5,
    completed: 150,
    failed: 3
  },
  costMetrics: {
    total: 523.45,
    byService: [
      { name: 'GPT-4', cost: 320.50 },
      { name: 'Document Processing', cost: 145.75 },
      { name: 'Workflow Automation', cost: 57.20 }
    ]
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(sampleData)
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week')

  // In a real application, you would fetch this data from your backend
  useEffect(() => {
    // Simulated data fetch based on timeframe
    console.log('Fetching data for timeframe:', timeframe)
  }, [timeframe])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-7 text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Monitor your AI and automation performance metrics
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'day' | 'week' | 'month')}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* AI Usage Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">AI Usage</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{data.aiUsage.totalCalls.toLocaleString()} calls</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Avg Response Time</div>
                  <div className="font-medium text-gray-900">{data.aiUsage.avgResponseTime}s</div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Success Rate</div>
                  <div className="font-medium text-gray-900">{data.aiUsage.successRate}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Metrics Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Workflows</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{data.workflowMetrics.active} workflows</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Completed</div>
                  <div className="font-medium text-gray-900">{data.workflowMetrics.completed.toLocaleString()}</div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Failed</div>
                  <div className="font-medium text-gray-900">{data.workflowMetrics.failed}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Metrics Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Cost</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">${data.costMetrics.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {data.costMetrics.byService.map((service) => (
                  <div key={service.name} className="flex justify-between text-sm">
                    <div className="text-gray-500">{service.name}</div>
                    <div className="font-medium text-gray-900">${service.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional metrics and charts would go here */}
      </div>
    </DashboardLayout>
  )
}