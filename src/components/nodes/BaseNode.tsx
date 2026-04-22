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
        'rounded-xl border-2 min-w-[200px] max-w-[240px] transition-all duration-300 relative glass-panel overflow-hidden',
        selected
          ? 'bg-[#1a1525]/90 border-[#a855f7] shadow-[0_0_25px_rgba(168,85,247,0.3)] scale-[1.03]'
          : 'bg-[#151320]/80 border-white/5 hover:border-white/10 shadow-xl',
        hasErrors && !selected && 'border-red-500/50'
      )}
      data-node-id={id}
    >
      {/* Dynamic Activity Scan Line (Anti-AI Polish) */}
      {selected && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan" />
      )}

      {/* Error badge */}
      {hasErrors && (
        <div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black z-10 shadow-lg animate-bounce"
        >
          !
        </div>
      )}

      {/* Color accent bar */}
      <div
        className="h-1"
        style={{ background: accentColor, opacity: selected ? 1 : 0.6 }}
      />

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 shadow-inner">
            <PremiumIcon color={accentColor}>
              {icon}
            </PremiumIcon>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight">
              {titleText}
            </h4>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30" style={{ color: accentColor }}>
              {data.nodeType}
            </span>
          </div>
        </div>
        
        {subtitleText && (
          <p className="text-[10px] text-gray-400 line-clamp-1 pl-1 opacity-70">
            {subtitleText}
          </p>
        )}
      </div>

      {/* Enterprise Status Footer */}
      <div className="px-3.5 py-1.5 bg-black/40 flex items-center justify-between border-t border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Live Monitor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-gray-600 font-mono">12ms</span>
          {data.isValid === false && (
            <span className="text-[8px] text-rose-500 font-black uppercase tracking-tighter">Err</span>
          )}
        </div>
      </div>

      {/* React Flow handles */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5 !bg-[#0d0c12] !border-[1.5px] !border-gray-600 hover:!border-purple-500 transition-colors"
        />
      )}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !bg-[#0d0c12] !border-[1.5px] transition-colors hover:!scale-125"
          style={{ borderColor: accentColor }}
        />
      )}
    </div>
  )
}
