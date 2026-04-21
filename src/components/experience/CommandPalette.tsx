import { useState, useEffect, useRef } from 'react'
import { Search, FileText, Command, LayoutDashboard, Trash2, Bot, Plus } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { TEMPLATES } from '../sidebar/WorkflowTemplates'

type PaletteCommand = {
  id: string
  title: string
  category: 'templates' | 'actions' | 'ai'
  icon: React.ReactNode
  onSelect: () => void
}

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  const loadWorkflow = useWorkflowStore(s => s.loadWorkflow)
  const clearCanvas = useWorkflowStore(s => s.clearCanvas)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    
    const handleEvent = () => setIsOpen(true)
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open_cmd_k', handleEvent)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open_cmd_k', handleEvent)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // Get Custom Templates
  const customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '[]')
  
  // Hardcoded default templates (we can extract this later, but recreating simple ones to load for the mock)
  const commands: PaletteCommand[] = [
    {
      id: 'ai-copilot',
      title: 'Design with AI Copilot',
      category: 'ai',
      icon: <Bot size={16} className="text-purple-400" />,
      onSelect: () => window.dispatchEvent(new Event('toggle_copilot'))
    },
    {
      id: 'action-clear',
      title: 'Clear Canvas',
      category: 'actions',
      icon: <Trash2 size={16} className="text-red-400" />,
      onSelect: () => clearCanvas()
    },
    {
      id: 'tpl-onboarding',
      title: 'Load Template: Employee Onboarding',
      category: 'templates',
      icon: <FileText size={16} className="text-blue-400" />,
      onSelect: () => {
        // Find it in TEMPLATES
        const tpl = TEMPLATES?.find((t: any) => t.id === 'onboarding')
        if (tpl) loadWorkflow(tpl.nodes, tpl.edges)
      }
    },
    ...customTemplates.map((ct: any) => ({
      id: `custom-${ct.name}`,
      title: `Load Custom: ${ct.name}`,
      category: 'templates',
      icon: <FileText size={16} className="text-orange-400" />,
      onSelect: () => loadWorkflow(ct.nodes, ct.edges)
    }))
  ]

  const filtered = query 
    ? commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    : commands

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151320] border border-white/20 rounded-xl w-[550px] shadow-2xl overflow-hidden flex flex-col drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <Search size={18} className="text-gray-400 mr-3" />
          <input
            ref={inputRef}
            placeholder="Search templates, actions, AI commands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-gray-500 text-lg"
          />
          <kbd className="px-2 py-1 rounded text-[10px] font-bold bg-white/10 text-gray-400 font-mono tracking-widest">ESC</kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.onSelect()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-left transition-colors group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/5">
                    {cmd.icon}
                  </div>
                  <div className="flex-1 text-sm text-gray-200 group-hover:text-white">
                    {cmd.title}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 group-hover:text-gray-400 px-2">
                    {cmd.category}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-white/5bg-black/20 px-4 py-2 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Command size={10} /> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↵</kbd> Select</span>
          </div>
          <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Tredence AI Hub</div>
        </div>
      </div>
    </div>
  )
}
