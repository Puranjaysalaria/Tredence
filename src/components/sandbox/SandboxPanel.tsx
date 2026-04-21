// ============================================================================
// SandboxPanel — Workflow simulation panel
// Validates graph, calls POST /simulate, streams step-by-step results.
// ============================================================================

import { useSimulate } from '@/hooks/useSimulate'
import { SimulationStep } from './SimulationStep'
import {
  Play,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

export const SandboxPanel = () => {
  const { run, steps, errors, isRunning, reset } = useSimulate()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="border-t glass-panel z-10 font-sans">
      {/* Header — always visible */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
          Workflow Sandbox
          {steps.length > 0 && !isRunning && (
            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium">
              {steps.length} steps
            </span>
          )}
          {isRunning && (
            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full font-medium animate-pulse">
              running...
            </span>
          )}
        </button>

        <div className="flex gap-2">
          {steps.length > 0 && (
            <button
              onClick={reset}
              className="btn-secondary flex items-center gap-1 text-xs"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
          <button
            onClick={run}
            disabled={isRunning}
            className="btn-primary flex items-center gap-1 text-xs"
          >
            <Play size={12} />
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="mb-3 space-y-1 animate-fadeInUp">
              {errors.map((err, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-md"
                >
                  <AlertCircle
                    size={12}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step-by-step execution log */}
          {steps.length > 0 && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {steps.map((step, i) => (
                <SimulationStep key={step.nodeId} step={step} index={i} />
              ))}
              {!isRunning && steps.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-green-400 font-medium mt-3 pt-2 border-t border-green-500/20">
                  <CheckCircle2 size={14} />
                  Workflow completed successfully — all {steps.length}{' '}
                  steps executed
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {steps.length === 0 && errors.length === 0 && !isRunning && (
            <div className="text-center py-6">
              <p className="text-xs text-gray-500">
                Build a workflow on the canvas, then click{' '}
                <span className="text-orange-400 font-medium">
                  Run Simulation
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
