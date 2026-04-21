// ============================================================================
// Graph Validation — Structural validation + topological ordering
// Uses DFS for cycle detection and Kahn's algorithm for topological sort.
// ============================================================================

import type { Node, Edge } from 'reactflow'
import type { WorkflowNodeData, ValidationResult, ValidationError } from '@/types/workflow'

/**
 * Validates the entire workflow graph against 5 structural rules:
 * 1. Exactly one Start node
 * 2. Exactly one End node
 * 3. No disconnected (orphan) nodes
 * 4. No cycles (DAG constraint)
 * 5. Start node has no incoming edges
 */
export const validateWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = []

  if (nodes.length === 0) {
    return { isValid: true, errors: [], executionOrder: [] }
  }

  // Rule 1: Must have exactly one Start node
  const startNodes = nodes.filter((n) => n.data.nodeType === 'start')
  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have a Start node', type: 'missing_start' })
  } else if (startNodes.length > 1) {
    errors.push({ message: 'Workflow can only have one Start node', type: 'missing_start' })
  }

  // Rule 2: Must have exactly one End node
  const endNodes = nodes.filter((n) => n.data.nodeType === 'end')
  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have an End node', type: 'missing_end' })
  } else if (endNodes.length > 1) {
    errors.push({ message: 'Workflow can only have one End node', type: 'missing_end' })
  }

  // Rule 3: No disconnected nodes (every node must appear in at least one edge)
  if (nodes.length > 1) {
    const connectedIds = new Set(edges.flatMap((e) => [e.source, e.target]))
    nodes.forEach((n) => {
      if (!connectedIds.has(n.id)) {
        errors.push({
          nodeId: n.id,
          message: `Node "${n.data.label || n.data.nodeType}" is not connected`,
          type: 'disconnected_node',
        })
      }
    })
  }

  // Rule 4: No cycles (use DFS)
  if (nodes.length > 1 && hasCycle(nodes, edges)) {
    errors.push({
      message: 'Workflow contains a cycle — all paths must flow forward',
      type: 'cycle_detected',
    })
  }

  // Rule 5: Start node must have no incoming edges
  if (startNodes.length === 1) {
    const startId = startNodes[0].id
    const hasIncoming = edges.some((e) => e.target === startId)
    if (hasIncoming) {
      errors.push({
        nodeId: startId,
        message: 'Start node cannot have incoming connections',
        type: 'missing_connection',
      })
    }
  }

  // Compute execution order only when graph is valid
  let executionOrder: string[] = []
  if (errors.length === 0) {
    try {
      executionOrder = topologicalSort(nodes, edges).map((n) => n.id)
    } catch {
      errors.push({
        message: 'Failed to compute execution order',
        type: 'cycle_detected',
      })
    }
  }

  return { isValid: errors.length === 0, errors, executionOrder }
}

/**
 * DFS-based cycle detection.
 * Uses a recursion stack to detect back edges in the directed graph.
 */
export const hasCycle = (nodes: Node[], edges: Edge[]): boolean => {
  const adj: Record<string, string[]> = {}
  nodes.forEach((n) => {
    adj[n.id] = []
  })
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target)
  })

  const visited = new Set<string>()
  const recStack = new Set<string>()

  const dfs = (id: string): boolean => {
    visited.add(id)
    recStack.add(id)
    for (const neighbor of adj[id] ?? []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true
      if (recStack.has(neighbor)) return true
    }
    recStack.delete(id)
    return false
  }

  return nodes.some((n) => !visited.has(n.id) && dfs(n.id))
}

/**
 * Kahn's algorithm — BFS topological sort.
 * Processes nodes in dependency order (in-degree = 0 first).
 * Throws if graph contains a cycle.
 */
export const topologicalSort = <T extends WorkflowNodeData>(
  nodes: Node<T>[],
  edges: Edge[]
): Node<T>[] => {
  const inDegree: Record<string, number> = {}
  const adj: Record<string, string[]> = {}

  nodes.forEach((n) => {
    inDegree[n.id] = 0
    adj[n.id] = []
  })
  edges.forEach((e) => {
    if (adj[e.source]) {
      adj[e.source].push(e.target)
      inDegree[e.target] = (inDegree[e.target] ?? 0) + 1
    }
  })

  const queue = nodes.filter((n) => inDegree[n.id] === 0)
  const result: Node<T>[] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    result.push(node)
    for (const neighborId of adj[node.id]) {
      inDegree[neighborId]--
      if (inDegree[neighborId] === 0) {
        const neighborNode = nodes.find((n) => n.id === neighborId)
        if (neighborNode) queue.push(neighborNode)
      }
    }
  }

  if (result.length !== nodes.length) {
    throw new Error('Graph contains a cycle — topological sort failed')
  }

  return result
}
