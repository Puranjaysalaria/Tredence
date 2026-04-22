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
import { showToast } from '@/components/experience/ToastManager'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------

export interface WorkflowState {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  selectedNodeId: string | null
  viewMode: 'canvas' | 'pipeline'

  // React Flow change handlers
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => void

  // Custom actions
  setSelectedNode: (id: string | null) => void
  setViewMode: (mode: 'canvas' | 'pipeline') => void
  addNode: (type: NodeType, position: XYPosition) => void
  updateNodeData: <T extends WorkflowNodeData>(id: string, data: Partial<T>) => void
  deleteNode: (id: string) => void
  setNodeValidation: (id: string, errors: string[]) => void
  sessionId: number
  loadWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void
  optimizeLayout: () => void
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
      viewMode: 'canvas',

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
      setViewMode: (mode) => set({ viewMode: mode }),

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


      sessionId: 0,

      loadWorkflow: (nodes, edges) => {
        const idMap: Record<string, string> = {}
        const safeId = () => Math.random().toString(36).slice(2, 10)
        
        // 1. Atomic ID mapping
        const freshNodes = nodes.map(n => {
          const newId = `${n.type || 'node'}-${safeId()}`
          idMap[n.id] = newId
          return { ...n, id: newId }
        })
        
        const freshEdges = edges.map(e => ({
          ...e,
          id: `e-${safeId()}`,
          source: idMap[e.source] || e.source,
          target: idMap[e.target] || e.target,
          animated: true,
          type: 'smoothstep'
        }))
        
        // 2. Atomic set with Session Jump to force ReactFlow refresh
        set((state) => ({ 
          nodes: freshNodes, 
          edges: freshEdges, 
          selectedNodeId: null,
          sessionId: state.sessionId + 1
        }))
        
        // 3. Robust fit_view trigger
        setTimeout(() => window.dispatchEvent(new Event('fit_view')), 300)
      },

      optimizeLayout: () => {
        const { nodes } = get()
        if (nodes.length === 0) return
        
        // Perfectly straight horizontal layout: 300px spacing
        const optimizedNodes = nodes.map((node, index) => ({
          ...node,
          position: { x: 100 + (index * 320), y: 250 }
        }))
        
        set({ nodes: optimizedNodes })
        setTimeout(() => window.dispatchEvent(new Event('fit_view')), 100)
        showToast('Layout aligned in straight line!', 'success')
      },


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
