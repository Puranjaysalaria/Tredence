import { useWorkflowStore } from '@/store/workflowStore'
import { Copy, Trash2, Link, Edit3, Settings, Play, Info } from 'lucide-react'

interface NodeContextMenuProps {
  id: string
  top: number
  left: number
  onClose: () => void
}

export const NodeContextMenu = ({ id, top, left, onClose }: NodeContextMenuProps) => {
  const deleteNode = useWorkflowStore(s => s.deleteNode)
  const setSelectedNode = useWorkflowStore(s => s.setSelectedNode)

  const handleAction = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <div 
      className="fixed z-[200] w-48 bg-[#151320] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scaleIn"
      style={{ top, left }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-1.5 space-y-0.5">
        <div className="px-2 py-1.5 mb-1">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Node Operations</p>
        </div>

        <button 
          onClick={() => handleAction(() => setSelectedNode(id))}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors group"
        >
          <Settings size={14} className="text-gray-500 group-hover:text-purple-400" />
          Quick Configure
        </button>

        <button 
          onClick={() => handleAction(() => {})}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors group"
        >
          <Copy size={14} className="text-gray-500 group-hover:text-blue-400" />
          Duplicate Step
        </button>

        <button 
          onClick={() => handleAction(() => {})}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors group"
        >
          <Link size={14} className="text-gray-500 group-hover:text-emerald-400" />
          Copy Anchor Link
        </button>

        <div className="h-px bg-white/5 my-1" />

        <button 
          onClick={() => handleAction(() => deleteNode(id))}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors group"
        >
          <Trash2 size={14} className="text-rose-500/50 group-hover:text-rose-500" />
          Delete Lifecycle
        </button>
      </div>

      {/* Analytics Hook - Final Polish */}
      <div className="bg-black/40 px-3 py-2 flex items-center gap-2 border-t border-white/5">
        <Play size={10} className="text-purple-500" />
        <span className="text-[9px] text-gray-500 font-bold uppercase italic">Ready for Simulation</span>
      </div>
    </div>
  )
}
