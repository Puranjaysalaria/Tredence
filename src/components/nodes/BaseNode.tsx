// ============================================================================
// BaseNode — Shared wrapper used by all 5 node components.
// Handles: selected glow, validation error badge, color accent bar,
// title + subtitle layout, node type badge, React Flow handles.
// ============================================================================

import { Handle, Position } from 'reactflow'
import type { WorkflowNodeData } from '@/types/workflow'
import { PremiumIcon } from '../ui/PremiumIcon'
import clsx from 'clsx'

interface BaseNodeProps {
  data: WorkflowNodeData
  id: string
  selected: boolean
  accentColor: string
  icon: React.ReactNode
  titleText: string
  subtitleText?: string
  showSourceHandle?: boolean
  showTargetHandle?: boolean
}

export const BaseNode = ({
  data,
  id,
  selected,
  accentColor,
  icon,
  titleText,
  subtitleText,
  showSourceHandle = true,
  showTargetHandle = true,
}: BaseNodeProps) => {
  const hasErrors =
    data.validationErrors && data.validationErrors.length > 0

  return (
    <div
      className={clsx(
        'rounded-xl border-2 min-w-[180px] max-w-[220px] shadow-sm transition-all duration-200 relative backdrop-blur-md',
        selected
          ? 'bg-[#1a1525]/90 border-[#a855f7] shadow-[#a855f7]/30 shadow-lg scale-[1.02]'
          : 'bg-[#151320]/80 border-white/5 hover:border-white/20',
        hasErrors && !selected && 'border-red-500/50'
      )}
      data-node-id={id}
    >
      {/* Error badge */}
      {hasErrors && (
        <div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold z-10 cursor-help shadow-lg"
          title={data.validationErrors?.join(', ')}
        >
          !
        </div>
      )}

      {/* Color accent bar */}
      <div
        className="h-1.5 rounded-t-[10px]"
        style={{ background: accentColor, opacity: selected ? 1 : 0.7 }}
      />

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center gap-3 mb-2">
          <PremiumIcon color={accentColor}>
            {icon}
          </PremiumIcon>
          <span className="text-sm font-semibold text-gray-100 truncate">
            {titleText}
          </span>
        </div>
        {subtitleText && (
          <p className="text-xs text-gray-400 truncate pl-10">
            {subtitleText}
          </p>
        )}
      </div>

      {/* Stats badges row */}
      <div className="px-3 pb-2 flex gap-2">
        <span
          className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded"
          style={{
            color: accentColor,
            background: `${accentColor}25`, // slightly higher opacity for dark mode
          }}
        >
          {data.nodeType}
        </span>
        {data.isValid === false && (
          <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded font-medium border border-red-500/20">
            invalid
          </span>
        )}
      </div>

      {/* React Flow handles */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3.5 !h-3.5 !bg-[#151320] !border-2 !border-gray-500 transition-colors"
        />
      )}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3.5 !h-3.5 !bg-[#151320] !border-2 transition-colors"
          style={{ borderColor: accentColor }}
        />
      )}
    </div>
  )
}
