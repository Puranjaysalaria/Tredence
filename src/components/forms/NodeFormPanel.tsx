// ============================================================================
// NodeFormPanel — Switchboard that renders the correct form for the
// selected node type. Uses key={id} to force remount on node switch.
//
// WHY key={id}: Without it, switching between two nodes of the same type
// (e.g., Task → Task) does NOT remount the form component, so old
// values persist. Keying by node ID forces React to unmount and
// remount, giving a clean form state and a slide-in animation.
// ============================================================================

import { useWorkflowStore } from '@/store/workflowStore'
import { StartNodeForm } from '@/components/forms/StartNodeForm'
import { TaskNodeForm } from '@/components/forms/TaskNodeForm'
import { ApprovalNodeForm } from '@/components/forms/ApprovalNodeForm'
import { AutomatedNodeForm } from '@/components/forms/AutomatedNodeForm'
import { EndNodeForm } from '@/components/forms/EndNodeForm'
import { Trash2 } from 'lucide-react'
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '@/types/workflow'
import { getNodeColor } from '@/utils/nodeHelpers'

export const NodeFormPanel = () => {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId)
  const nodes = useWorkflowStore((s) => s.nodes)
  const deleteNode = useWorkflowStore((s) => s.deleteNode)
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode)

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) {
    return (
      <div className="w-80 glass-panel border-l flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-400">
            Select a node on the canvas
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Click any node to edit its configuration
          </p>
        </div>
      </div>
    )
  }

  const { id, data } = selectedNode
  const accentColor = getNodeColor(data.nodeType)

  const renderForm = () => {
    switch (data.nodeType) {
      case 'start':
        return <StartNodeForm nodeId={id} data={data as StartNodeData} />
      case 'task':
        return <TaskNodeForm nodeId={id} data={data as TaskNodeData} />
      case 'approval':
        return <ApprovalNodeForm nodeId={id} data={data as ApprovalNodeData} />
      case 'automated':
        return <AutomatedNodeForm nodeId={id} data={data as AutomatedNodeData} />
      case 'end':
        return <EndNodeForm nodeId={id} data={data as EndNodeData} />
    }
  }

  return (
    <div
      key={id}
      className="w-80 glass-panel border-l overflow-y-auto animate-slideInRight"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: accentColor }}
            />
            <h3 className="font-medium text-sm text-gray-200 capitalize">
              {data.nodeType} Node
            </h3>
          </div>
          <button
            onClick={() => {
              deleteNode(id)
              setSelectedNode(null)
            }}
            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
            title="Delete node"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <p className="text-[11px] text-gray-500 mt-1 font-mono">{id}</p>
      </div>

      {/* Form */}
      <div className="p-4">{renderForm()}</div>
    </div>
  )
}
