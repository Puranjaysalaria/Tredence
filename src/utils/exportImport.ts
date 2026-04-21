// ============================================================================
// Export / Import — Workflow serialization for JSON file I/O
// ============================================================================

import type { Node, Edge } from 'reactflow'
import type { WorkflowNodeData } from '@/types/workflow'

/**
 * Serializes the current workflow (nodes + edges) to a JSON file
 * and triggers a browser download.
 */
export const exportWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): void => {
  const payload = JSON.stringify(
    {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
    },
    null,
    2
  )

  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `workflow-${Date.now()}.json`
  anchor.click()

  URL.revokeObjectURL(url)
}

/**
 * Reads a JSON file and parses it into nodes + edges.
 * Validates that the required fields are present.
 */
export const importWorkflow = (
  file: File
): Promise<{ nodes: Node<WorkflowNodeData>[]; edges: Edge[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string
        const parsed = JSON.parse(raw)

        if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
          throw new Error('Invalid workflow file: missing nodes or edges array')
        }

        resolve({ nodes: parsed.nodes, edges: parsed.edges })
      } catch (err) {
        reject(
          err instanceof Error ? err : new Error('Invalid workflow file')
        )
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
