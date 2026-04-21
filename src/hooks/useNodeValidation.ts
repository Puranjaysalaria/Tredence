// ============================================================================
// useNodeValidation — Continuous graph validation
// Runs validateWorkflow() on every structural change and marks affected
// nodes with validation errors directly on the canvas.
//
// WHY continuous: errors shown live as the user builds, not just on
// simulate click — much better UX signal.
// ============================================================================

import { useEffect } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { validateWorkflow } from '@/utils/graphValidator'

export const useNodeValidation = () => {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const setNodeValidation = useWorkflowStore((s) => s.setNodeValidation)

  useEffect(() => {
    if (nodes.length === 0) return

    const result = validateWorkflow(nodes, edges)

    // Clear all errors first
    nodes.forEach((n) => setNodeValidation(n.id, []))

    // Set errors on affected nodes
    result.errors.forEach((err) => {
      if (err.nodeId) {
        setNodeValidation(err.nodeId, [err.message])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length]) // Run on structural changes only
}
