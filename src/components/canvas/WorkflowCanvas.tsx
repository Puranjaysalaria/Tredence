// ============================================================================
// WorkflowCanvas — React Flow canvas with drag-drop, validation, and controls
// ============================================================================

import { useEffect, useCallback } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useWorkflowStore } from '@/store/workflowStore'
import { nodeTypes } from '@/components/nodes'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { useNodeValidation } from '@/hooks/useNodeValidation'
import { getNodeColor } from '@/utils/nodeHelpers'
import { PipelineView } from '@/components/experience/PipelineView'
import { NodeContextMenu } from './NodeContextMenu'
import { useState } from 'react'

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  interactionWidth: 25,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#a855f7',
    width: 20,
    height: 20,
  },
  style: {
    stroke: '#a855f7',
    strokeWidth: 2,
    filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))',
  },
}

// Inner component that can access the ReactFlow context
const CanvasInner = () => {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange)
  const onConnect = useWorkflowStore((s) => s.onConnect)
  const onEdgeUpdate = useWorkflowStore((s) => s.onEdgeUpdate)
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode)
  const viewMode = useWorkflowStore((s) => s.viewMode)

  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null)

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault()
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
      })
    },
    [setMenu]
  )

  const onPaneClick = useCallback(() => {
    setMenu(null)
    setSelectedNode(null)
  }, [setSelectedNode])

  const { onDragOver, onDrop } = useDragAndDrop()
  useNodeValidation()

  const { fitView } = useReactFlow()

  // Listen for fit_view and sync events
  useEffect(() => {
    const handler = () => {
      setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 60)
    }
    window.addEventListener('fit_view', handler)
    window.addEventListener('force_ui_sync', handler)
    return () => {
      window.removeEventListener('fit_view', handler)
      window.removeEventListener('force_ui_sync', handler)
    }
  }, [fitView])

  // Also refit whenever nodes are bulk-loaded (template applied)
  const sessionId = useWorkflowStore((s) => s.sessionId)

  // FORCE FIT: Whenever nodes change OR a new session starts
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 })
      }, 100)
    }
  }, [nodes, sessionId, fitView])

  if (viewMode === 'pipeline') {
    return <PipelineView />
  }

  return (
    <div className="flex-1 h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        key={`rf-${sessionId}`}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onNodeContextMenu={onNodeContextMenu}
        onNodeClick={(_, node) => { setSelectedNode(node.id); setMenu(null) }}
        onPaneClick={onPaneClick}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode="Delete"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color="rgba(168, 85, 247, 0.15)"
        />
        <Controls
          className="!bg-[#151320]/80 !backdrop-blur-md !border-white/10 !shadow-lg"
          showInteractive={false}
        />
        {menu && <NodeContextMenu {...menu} onClose={() => setMenu(null)} />}
        <MiniMap
          nodeColor={(node) =>
            getNodeColor((node.data as { nodeType?: string })?.nodeType ?? '')
          }
          style={{
            background: 'rgba(18, 16, 28, 0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          maskColor="rgba(11, 12, 16, 0.7)"
        />
      </ReactFlow>
    </div>
  )
}

export const WorkflowCanvas = () => <CanvasInner />
