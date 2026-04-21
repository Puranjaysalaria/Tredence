// ============================================================================
// NodePalette — Left sidebar with draggable node type cards
// Sets HTML5 dataTransfer on drag so the canvas can read the node type.
// ============================================================================

import { Play, ClipboardList, CheckSquare, Zap, Flag } from 'lucide-react'
import { WorkflowTemplates } from './WorkflowTemplates'
import { PremiumIcon } from '../ui/PremiumIcon'
import type { NodeType } from '@/types/workflow'

const NODE_TYPES: Array<{
  type: NodeType
  label: string
  description: string
  color: string
  icon: React.ReactNode
}> = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    color: '#1D9E75',
    icon: <Play size={14} />,
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Human task',
    color: '#378ADD',
    icon: <ClipboardList size={14} />,
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Approval step',
    color: '#BA7517',
    icon: <CheckSquare size={14} />,
  },
  {
    type: 'automated',
    label: 'Automated Step',
    description: 'System action',
    color: '#7F77DD',
    icon: <Zap size={14} />,
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow completion',
    color: '#D85A30',
    icon: <Flag size={14} />,
  },
]

export const NodePalette = () => {
  return (
    <div className="w-64 glass-panel border-r flex flex-col z-10 shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Node Types
        </p>
      </div>

      {/* Draggable node cards */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {NODE_TYPES.map(({ type, label, description, color, icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', type)
              e.dataTransfer.effectAllowed = 'move'
            }}
            className="bg-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing 
                       border-l-4 border-t border-b border-r border-t-white/5 border-b-white/5 border-r-white/5 
                       hover:bg-white/10 transition-all duration-200
                       hover:shadow-xl hover:shadow-purple-500/10 hover:translate-x-1
                       group backdrop-blur-md"
            style={{ borderLeftColor: color }}
          >
            <div className="flex items-center gap-3">
              <PremiumIcon color={color}>
                {icon}
              </PremiumIcon>
              <p className="text-sm font-medium text-gray-100">{label}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2 pl-9">
              {description}
            </p>
          </div>
        ))}
      </div>

      {/* Workflow Templates section */}
      <WorkflowTemplates />
    </div>
  )
}
