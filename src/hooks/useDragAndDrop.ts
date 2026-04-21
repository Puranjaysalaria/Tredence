// ============================================================================
// useDragAndDrop — Canvas drag-over + drop handlers
// Reads the node type from HTML5 dataTransfer and converts screen
// coordinates to React Flow canvas coordinates.
// ============================================================================

import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { useWorkflowStore } from '@/store/workflowStore'
import type { NodeType } from '@/types/workflow'

export const useDragAndDrop = () => {
  const { screenToFlowPosition } = useReactFlow()
  const addNode = useWorkflowStore((s) => s.addNode)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()

      const type = e.dataTransfer.getData('application/reactflow') as NodeType
      if (!type) return

      // Convert the screen drop position to a React Flow canvas position
      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      })

      addNode(type, position)
    },
    [screenToFlowPosition, addNode]
  )

  return { onDragOver, onDrop }
}
