import { useState, useEffect } from 'react'
import { Library, X, Trash2, FileText, Star } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { TEMPLATES } from '../sidebar/WorkflowTemplates'
import { showToast } from './ToastManager'
import type { Node, Edge } from 'reactflow'

interface CustomTemplate {
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export const TemplateLibraryModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const loadWorkflow = useWorkflowStore(s => s.loadWorkflow)

  const fetchCustomTemplates = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('custom_templates') || '[]')
      setCustomTemplates(stored)
    } catch {
      setCustomTemplates([])
    }
  }

  useEffect(() => {
    const handleOpen = () => {
      fetchCustomTemplates()
      setIsOpen(true)
    }
    window.addEventListener('open_template_library', handleOpen)
    window.addEventListener('custom_templates_updated', fetchCustomTemplates)
    return () => {
      window.removeEventListener('open_template_library', handleOpen)
      window.removeEventListener('custom_templates_updated', fetchCustomTemplates)
    }
  }, [])

  if (!isOpen) return null

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const name = customTemplates[index]?.name ?? 'Template'
    const stored = [...customTemplates]
    stored.splice(index, 1)
    localStorage.setItem('custom_templates', JSON.stringify(stored))
    fetchCustomTemplates()
    window.dispatchEvent(new Event('custom_templates_updated'))
    showToast(`"${name}" deleted`, 'info')
  }

  const handleApply = (nodes: Node[], edges: Edge[], name?: string) => {
    loadWorkflow(nodes, edges)
    setIsOpen(false)
    showToast(`"${name ?? 'Template'}" loaded onto canvas`, 'success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151320] border border-blue-500/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] w-[600px] h-[70vh] flex flex-col animate-scaleIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Library size={18} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Template Library</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
          
          {/* Custom Templates Section */}
          <section>
            <h3 className="text-xs font-bold text-[#a855f7] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Star size={14} /> My Saved Templates
            </h3>
            {customTemplates.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-gray-700/50 rounded-xl bg-white/[0.02]">
                <p className="text-sm text-gray-500">You haven't saved any templates yet.</p>
                <p className="text-xs text-gray-600 mt-1">Build something cool and hit "Save" in the top bar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {customTemplates.map((tpl, i) => (
                  <div 
                    key={i}
                    onClick={() => handleApply(tpl.nodes, tpl.edges, tpl.name)}
                    className="group relative bg-[#1c1a29] border border-white/5 hover:border-[#a855f7]/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-[#252236] hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <FileText size={16} className="text-[#a855f7]" />
                        <span className="truncate max-w-[180px]">{tpl.name}</span>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, i)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-colors bg-black/40 p-1.5 rounded-md"
                        title="Delete Template"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      {tpl.nodes.length} nodes · {tpl.edges.length} edges
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Default Industry Templates Section */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Default Industry Examples
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((tpl, i) => (
                <div 
                  key={`default-${i}`}
                  onClick={() => handleApply(tpl.nodes, tpl.edges, tpl.name)}
                  className="group bg-white/[0.03] border border-white/5 hover:border-blue-500/30 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.06] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 text-gray-200 font-medium">
                    <span className="text-blue-400">{tpl.icon}</span>
                    <span className="truncate w-full">{tpl.name}</span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {tpl.nodes.length} nodes · {tpl.edges.length} edges
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
