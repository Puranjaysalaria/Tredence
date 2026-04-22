// ============================================================================
// MSW Request Handlers — Mock API layer
// Intercepts HTTP requests and returns realistic mock responses.
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { mockAutomations } from './data/automations'
import { topologicalSort } from '@/utils/graphValidator'
import { getMockMessage } from '@/utils/nodeHelpers'
import type { WorkflowNodeData } from '@/types/workflow'
import type { Node, Edge } from 'reactflow'

export const handlers = [
  // GET /api/automations — returns list of available automated actions
  http.get('/api/automations', async () => {
    await delay(200) // Simulate realistic network latency
    return HttpResponse.json(mockAutomations)
  }),

  // POST /api/simulate — accepts workflow JSON, returns step-by-step execution
  http.post('/api/simulate', async ({ request }) => {
    await delay(300)

    const body = (await request.json()) as {
      nodes: Node<WorkflowNodeData>[]
      edges: Edge[]
    }
    const { nodes, edges } = body

    try {
      const sorted = topologicalSort(nodes, edges)

      const steps = sorted.map((node, index) => {
        const d = node.data
        // Extract readable label from the specific node data shape
        let label = d.label
        if (d.nodeType === 'start') label = d.startTitle || label
        else if (d.nodeType === 'task') label = d.title || label
        else if (d.nodeType === 'approval') label = d.title || label
        else if (d.nodeType === 'automated') label = d.title || label
        else if (d.nodeType === 'end') label = d.endMessage || label

        const dropOffRate = d.nodeType === 'approval' ? Math.random() * 0.2 + 0.1 : Math.random() * 0.05
        const efficiencyScore = d.nodeType === 'automated' ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 30) + 60

        return {
          nodeId: node.id,
          nodeType: d.nodeType,
          label,
          status: 'success' as const,
          duration: Math.floor(Math.random() * 800) + 150,
          message: getMockMessage(d.nodeType),
          timestamp: Date.now() + index * 600,
          metrics: {
            dropOffRate,
            efficiencyScore,
            impactLevel: dropOffRate > 0.15 ? 'high' : dropOffRate > 0.05 ? 'medium' : 'low'
          }
        }
      })

      return HttpResponse.json({ steps, isValid: true, errors: [] })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Simulation failed'
      return HttpResponse.json(
        { steps: [], isValid: false, errors: [message] },
        { status: 400 }
      )
    }
  }),
]
