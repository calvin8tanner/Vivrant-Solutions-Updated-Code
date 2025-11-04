'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'

interface WorkflowStep {
  id: string
  type: 'trigger' | 'action' | 'condition'
  name: string
  config: Record<string, any>
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  isActive: boolean
}

const sampleWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Customer Support AI',
    description: 'Automatically process and respond to customer inquiries using AI',
    steps: [
      {
        id: 'trigger1',
        type: 'trigger',
        name: 'New Email Received',
        config: { email: 'support@vivrantsolutions.com' }
      },
      {
        id: 'action1',
        type: 'action',
        name: 'Analyze with AI',
        config: { model: 'gpt-4' }
      },
      {
        id: 'condition1',
        type: 'condition',
        name: 'Check Sentiment',
        config: { threshold: 0.5 }
      }
    ],
    isActive: true
  },
  {
    id: '2',
    name: 'Document Processing',
    description: 'Extract and analyze data from uploaded documents',
    steps: [
      {
        id: 'trigger2',
        type: 'trigger',
        name: 'New Document Upload',
        config: { folder: '/uploads' }
      },
      {
        id: 'action2',
        type: 'action',
        name: 'Extract Data',
        config: { type: 'text-extraction' }
      }
    ],
    isActive: false
  }
]

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ))
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Workflow Automation</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create and manage automated workflows powered by AI
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {/* TODO: Implement new workflow creation */}}
            >
              Create workflow
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Steps
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {workflows.map((workflow) => (
                      <tr key={workflow.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {workflow.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {workflow.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {workflow.steps.length} steps
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            onClick={() => toggleWorkflow(workflow.id)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              workflow.isActive ? 'bg-primary' : 'bg-gray-200'
                            }`}
                          >
                            <span className="sr-only">Toggle workflow</span>
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                workflow.isActive ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => setSelectedWorkflow(workflow)}
                            className="text-primary hover:text-primary/80"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}