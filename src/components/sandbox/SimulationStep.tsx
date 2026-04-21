// ============================================================================
// SimulationStep — Single step row in the simulation execution log
// ============================================================================

import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { getNodeColor } from '@/utils/nodeHelpers'
import type { SimulationStep as StepType } from '@/types/workflow'

interface Props {
  step: StepType
  index: number
}

export const SimulationStep = ({ step, index }: Props) => {
  const color = getNodeColor(step.nodeType)

  const statusIcon = {
    success: <CheckCircle2 size={14} className="text-green-400" />,
    pending: <Loader2 size={14} className="text-amber-400 animate-spin" />,
    error: <AlertCircle size={14} className="text-red-400" />,
  }

  return (
    <div
      className="flex items-start gap-3 py-2 px-3 rounded-md bg-[#282c34] animate-stepReveal"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Step number */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
        style={{ background: color }}
      >
        {index + 1}
      </div>

      {/* Step content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-200 truncate">
            {step.label}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase"
            style={{
              color,
              background: `${color}20`,
            }}
          >
            {step.nodeType}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">{step.message}</p>
      </div>

      {/* Status + duration */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[10px] text-gray-500">{step.duration}ms</span>
        {statusIcon[step.status]}
      </div>
    </div>
  )
}
