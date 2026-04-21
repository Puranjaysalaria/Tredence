// ============================================================================
// WorkflowCanvas — React Flow canvas with drag-drop, validation, and controls
// ============================================================================

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useWorkflowStore } from '@/store/workflowStore'
import { nodeTypes } from '@/components/nodes'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { useNodeValidation } from '@/hooks/useNodeValidation'
import { getNodeColor } from '@/utils/nodeHelpers'

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  interactionWidth: 25, // Much easier to hover/select
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#a855f7', // purple-500
    width: 20,
    height: 20,
  },
  style: {
    stroke: '#a855f7',
    strokeWidth: 2,
    filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))',
  },
}

export const WorkflowCanvas = () => {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange)
  const onConnect = useWorkflowStore((s) => s.onConnect)
  const onEdgeUpdate = useWorkflowStore((s) => s.onEdgeUpdate)
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode)

  const { onDragOver, onDrop } = useDragAndDrop()
  useNodeValidation() // Runs continuously, sets validation errors on nodes

  return (
    <div className="flex-1 h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onPaneClick={() => setSelectedNode(null)}
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
