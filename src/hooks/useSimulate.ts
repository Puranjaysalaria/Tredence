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

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      })

      const result = await res.json()

      if (!result.isValid) {
        setErrors(
          result.errors.map((msg: string) => ({
            message: msg,
            type: 'missing_connection' as const,
          }))
        )
        return
      }

      // Stream steps one at a time for "live execution" feel
      for (const step of result.steps) {
        await new Promise<void>((r) => setTimeout(r, 600))
        setSteps((prev) => [...prev, step])
      }
    } catch {
      setErrors([
        {
          message: 'Simulation failed — network error',
          type: 'missing_connection',
        },
      ])
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
