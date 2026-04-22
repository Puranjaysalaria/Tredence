// ============================================================================
// useSimulate — Triggers workflow simulation via POST /simulate
// Streams results step-by-step for a "live execution" animation.
// ============================================================================

import { useState } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { validateWorkflow } from '@/utils/graphValidator'
import type { SimulationStep, ValidationError } from '@/types/workflow'

export const useSimulate = () => {
  const [steps, setSteps] = useState<SimulationStep[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const run = async () => {
    const { nodes, edges } = useWorkflowStore.getState()
    setSteps([])
    setErrors([])

    // Step 1: Validate the graph structure before sending to API
    const validation = validateWorkflow(nodes, edges)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsRunning(true)
    
    // Virtual Simulation Engine (Frontend Mock)
    try {
      const generatedSteps: SimulationStep[] = nodes.map((node, i) => ({
        nodeId: node.id,
        nodeType: (node.data as any).nodeType || 'task',
        label: (node.data as any).title || node.data.label || 'Step',
        status: 'success',
        duration: Math.floor(Math.random() * 400) + 200,
        timestamp: Date.now() + (i * 1000),
        message: `Strategic Step ${i + 1}: ${node.data.label} completed successfully.`,
        metrics: {
          dropOffRate: Math.random() * 0.2,
          efficiencyScore: 85 + (Math.random() * 15),
          impactLevel: Math.random() > 0.5 ? 'high' : 'medium'
        }
      }))

      // Stream steps one at a time for "live execution" feel
      for (const step of generatedSteps) {
        await new Promise<void>((r) => setTimeout(r, 800))
        setSteps((prev) => [...prev, step])
      }
    } catch (e) {
      setErrors([{ message: 'Local simulation failed', type: 'missing_connection' }])
    } finally {
      setIsRunning(false)
    }
  }

  const reset = () => {
    setSteps([])
    setErrors([])
  }

  return { run, steps, errors, isRunning, reset }
}
