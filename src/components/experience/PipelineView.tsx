import { useWorkflowStore } from '@/store/workflowStore'
import { Users, Clock, ArrowRight, Kanban, Layers } from 'lucide-react'
import { topologicalSort } from '@/utils/graphValidator'

export const PipelineView = () => {
  const { nodes, edges } = useWorkflowStore()
  
  let sortedNodes = []
  try {
    sortedNodes = topologicalSort(nodes, edges)
  } catch (e) {
    sortedNodes = nodes // Fallback if there are cycles
  }

  return (
    <div className="relative w-full h-full bg-[#0d0c12] overflow-x-auto overflow-y-hidden custom-scrollbar animate-fadeIn">
      <div className="h-full inline-flex items-start gap-8 p-10 min-w-full">
        {sortedNodes.map((node, i) => {
          const isLast = i === sortedNodes.length - 1
          const mockCount = Math.floor(Math.random() * 50) + 10
          
          return (
            <div key={node.id} className="flex items-center gap-6 h-full">
              {/* Stage Card */}
              <div className="w-72 flex flex-col gap-4">
                <div className="enterprise-card p-5 rounded-2xl group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-purple-500'} animate-pulse`} />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Stage {i + 1}
                      </span>
                    </div>
                    <div className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-gray-400 uppercase">
                      {node.data.nodeType}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {node.data.label || 'Untitled Step'}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <Users size={10} />
                        <span className="text-[9px] font-bold uppercase">Active</span>
                      </div>
                      <div className="text-sm font-black text-gray-200">{mockCount}</div>
                    </div>
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <Clock size={10} />
                        <span className="text-[9px] font-bold uppercase">Avg. Time</span>
                      </div>
                      <div className="text-sm font-black text-gray-200">2.4d</div>
                    </div>
                  </div>
                </div>

                {/* Candidate List Mockup (High-End Polish) */}
                <div className="flex flex-col gap-2 opacity-40">
                  {[1, 2].map(n => (
                    <div key={n} className="h-12 bg-white/[0.02] border border-white/5 rounded-xl flex items-center px-4 gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                        <div className="h-1 w-1/2 bg-white/5 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex flex-col items-center gap-2 mt-20">
                  <div className="h-px w-12 bg-gradient-to-r from-purple-500/50 to-transparent" />
                  <ArrowRight size={14} className="text-purple-500/50" />
                </div>
              )}
            </div>
          )
        })}

        {/* Empty State / Add Stage */}
        <div 
          onClick={() => {
            window.dispatchEvent(new Event('open_jd_intelligence'))
          }}
          className="w-72 h-48 shrink-0 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-600 hover:border-purple-500/20 hover:text-purple-500/50 transition-all cursor-pointer group"
        >
          <Layers size={24} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Expand Pipeline</span>
          <span className="text-[9px] font-medium text-gray-700">Add Strategic Stage</span>
        </div>
      </div>
    </div>
  )
}
