import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { showToast } from './ToastManager'

export const SaveTemplateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const nodes = useWorkflowStore(s => s.nodes)
  const edges = useWorkflowStore(s => s.edges)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open_save_modal', handleOpen)
    return () => window.removeEventListener('open_save_modal', handleOpen)
  }, [])

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateName.trim() || nodes.length === 0) return

    const stored = JSON.parse(localStorage.getItem('custom_templates') || '[]')
    stored.push({ name: templateName.trim(), nodes, edges })
    localStorage.setItem('custom_templates', JSON.stringify(stored))
    
    // Notify UI components that a new template is available
    window.dispatchEvent(new Event('custom_templates_updated'))
    showToast(`Template "${templateName.trim()}" saved!`, 'success')
    
    setTemplateName('')
    setIsOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151320] border border-[#a855f7]/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] w-[400px] animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-white">
            <div className="p-2 bg-[#a855f7]/20 rounded-lg">
              <Save size={18} className="text-[#a855f7]" />
            </div>
            <h2 className="text-lg font-bold">Save Custom Template</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Template Name
            </label>
            <input
              autoFocus
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Senior Engineering Hiring Flow"
              className="w-full bg-[#0b0c10] border border-gray-700 focus:border-[#a855f7] rounded-xl px-4 py-3 text-white outline-none transition-all focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] placeholder-gray-600"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!templateName.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
