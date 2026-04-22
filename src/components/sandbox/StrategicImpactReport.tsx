import { TrendingDown, Timer, Target, AlertTriangle } from 'lucide-react'
import type { SimulationStep } from '@/types/workflow'

interface StrategicImpactReportProps {
  steps: SimulationStep[]
}

export const StrategicImpactReport = ({ steps }: StrategicImpactReportProps) => {
  const avgEfficiency = Math.round(steps.reduce((acc, s) => acc + (s.metrics?.efficiencyScore || 0), 0) / steps.length)
  const totalDropOff = Math.round((1 - steps.reduce((acc, s) => acc * (1 - (s.metrics?.dropOffRate || 0)), 1)) * 100)
  const bottlenecks = steps.filter(s => s.metrics?.impactLevel === 'high')

  return (
    <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl animate-fadeInUp">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-purple-500/20 rounded-lg">
          <Target size={16} className="text-purple-400" />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-tight">Strategic Impact Analysis</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Timer size={12} />
            <span className="text-[10px] font-bold uppercase">Efficiency</span>
          </div>
          <div className="text-lg font-black text-emerald-400">{avgEfficiency}%</div>
        </div>

        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <TrendingDown size={12} />
            <span className="text-[10px] font-bold uppercase">Drop-off</span>
          </div>
          <div className="text-lg font-black text-rose-400">{totalDropOff}%</div>
        </div>

        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <AlertTriangle size={12} />
            <span className="text-[10px] font-bold uppercase">Bottlenecks</span>
          </div>
          <div className="text-lg font-black text-amber-400">{bottlenecks.length}</div>
        </div>
      </div>

      {bottlenecks.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Critical Bottlenecks Detected</div>
          {bottlenecks.map(b => (
            <div key={b.nodeId} className="flex items-center justify-between p-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
              <span className="text-xs font-semibold text-amber-200">{b.label}</span>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">High Impact</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
