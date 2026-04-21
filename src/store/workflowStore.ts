// ============================================================================
// Zustand Store — Single source of truth for the workflow graph
// Uses zundo temporal middleware for undo/redo.
//
// WHY Zustand over Context:
//   React Flow dispatches high-frequency node position updates during drag.
//   Context would re-render every consumer on every update. Zustand's selector
//   pattern isolates re-renders to only the slices of state each component
//   actually reads.
// ============================================================================

import { create } from 'zustand'
import { temporal } from 'zundo'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  updateEdge,
} from 'reactflow'
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  XYPosition,
  Connection,
} from 'reactflow'
import type { WorkflowNodeData, NodeType } from '@/types/workflow'
import { createNode } from '@/utils/nodeHelpers'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  selectedNodeId: string | null

  // React Flow change handlers
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => void

  // Custom actions
  setSelectedNode: (id: string | null) => void
  addNode: (type: NodeType, position: XYPosition) => void
  updateNodeData: <T extends WorkflowNodeData>(id: string, data: Partial<T>) => void
  deleteNode: (id: string) => void
  setNodeValidation: (id: string, errors: string[]) => void
  loadWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void
  clearCanvas: () => void

  // Selectors
  getSelectedNode: () => Node<WorkflowNodeData> | undefined
}

// ---------------------------------------------------------------------------
// Store creation
// ---------------------------------------------------------------------------

export const useWorkflowStore = create<WorkflowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,

      // React Flow handlers — delegate to the library's pure helpers
      onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) as Node<WorkflowNodeData>[] }),

      onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),

      onConnect: (connection) =>
        set({
          edges: addEdge(
            { ...connection, animated: true, type: 'smoothstep' },
            get().edges
          ),
        }),

      onEdgeUpdate: (oldEdge, newConnection) =>
        set({
          edges: updateEdge(oldEdge, newConnection, get().edges),
        }),

      setSelectedNode: (id) => set({ selectedNodeId: id }),

      addNode: (type, position) => {
        const newNode = createNode(type, position)
        set({ nodes: [...get().nodes, newNode] })
      },

      updateNodeData: (id, data) =>
        set({
          nodes: get().nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
          ),
        }),

      deleteNode: (id) =>
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter(
            (e) => e.source !== id && e.target !== id
          ),
          selectedNodeId:
            get().selectedNodeId === id ? null : get().selectedNodeId,
        }),

      setNodeValidation: (id, errors) =>
        set({
          nodes: get().nodes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    isValid: errors.length === 0,
                    validationErrors: errors,
                  },
                }
              : n
          ),
        }),

      loadWorkflow: (nodes, edges) =>
        set({ nodes, edges, selectedNodeId: null }),

      clearCanvas: () =>
        set({ nodes: [], edges: [], selectedNodeId: null }),

      getSelectedNode: () => {
        const { nodes, selectedNodeId } = get()
        return nodes.find((n) => n.id === selectedNodeId)
      },
    }),
    {
      // Only track nodes & edges in undo history — ignore functions and selection
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
)
