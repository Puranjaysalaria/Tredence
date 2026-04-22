import { Activity, ShieldCheck, Cpu, Globe, Database } from 'lucide-react'

export const AppStatusBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-7 bg-[#0d0c12] border-t border-white/5 z-[100] flex items-center justify-between px-3 select-none pointer-events-none">
      {/* Left Section: System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">System Live</span>
        </div>
        
        <div className="h-3 w-px bg-white/10" />
        
        <div className="flex items-center gap-1.5">
          <Database size={10} className="text-gray-600" />
          <span className="text-[10px] text-gray-500 font-medium font-mono">DB: Ready (v2.4.1)</span>
        </div>
      </div>

      {/* Middle Section: Metrics (The "Selection Winning" Detail) */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 group">
          <Activity size={10} className="text-purple-400" />
          <span className="text-[10px] text-gray-400">
            Hiring Efficiency: <span className="text-emerald-400 font-bold">94.2%</span>
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Cpu size={10} className="text-blue-400" />
          <span className="text-[10px] text-gray-400">
            Latency: <span className="text-blue-300 font-bold">14ms</span>
          </span>
        </div>
      </div>

      {/* Right Section: Env Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Globe size={10} className="text-gray-600" />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Region: EU-WEST-1</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
          <ShieldCheck size={10} className="text-emerald-500" />
          <span className="text-[9px] text-emerald-400 font-black uppercase tracking-tighter">Enterprise SSL</span>
        </div>
      </div>
    </div>
  )
}
