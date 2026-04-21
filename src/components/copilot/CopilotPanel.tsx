import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Loader2, Bot, Lightbulb } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { generateMockAIWorkflow } from '@/utils/mockCopilot'
import clsx from 'clsx'
import dagre from 'dagre'

export const CopilotPanel = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    
    // Fake AI Generation Delay
    setTimeout(() => {
      const { nodes, edges } = generateMockAIWorkflow(prompt)
      
      // Auto-layout the generated graph
      const g = new dagre.graphlib.Graph()
      g.setDefaultEdgeLabel(() => ({}))
      g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 120, marginx: 50, marginy: 50 })
      
      nodes.forEach((node) => g.setNode(node.id, { width: 200, height: 80 }))
      edges.forEach((edge) => g.setEdge(edge.source, edge.target))
      dagre.layout(g)

      const layoutedNodes = nodes.map((node) => {
        const pos = g.node(node.id)
        return { ...node, position: { x: pos.x - 100, y: pos.y - 40 } }
      })

      loadWorkflow(layoutedNodes, edges)
      setIsGenerating(false)
      setIsGenerating(false)
      setPrompt('')
      setIsOpen(false)
    }, 2000)
  }

  useEffect(() => {
    const handleToggle = () => setIsOpen(true)
    window.addEventListener('toggle_copilot', handleToggle)
    return () => window.removeEventListener('toggle_copilot', handleToggle)
  }, [])

  if (!isOpen) return null

  const examples = [
    "Design an IT Hardware Onboarding pipeline",
    "Build a 2-step Vacation Leave request",
    "Create a complex Security Audit process"
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151320] border border-[#a855f7]/30 p-6 rounded-2xl w-[600px] shadow-2xl flex flex-col drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-lg">
            <Bot size={22} /> Tredence Copilot Agent
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white text-sm bg-white/5 px-3 py-1 rounded-md">
            Esc
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="relative mb-4">
          <input
            type="text"
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the workflow you want to generate conceptually..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-4 pr-12
                       text-white text-md outline-none focus:border-purple-500 focus:bg-[#1a1825] transition-all
                       placeholder:text-gray-600"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={clsx(
              "absolute right-2 top-2 bottom-2 px-3 rounded-lg transition-all flex items-center justify-center",
              prompt.trim() && !isGenerating ? "bg-purple-600 hover:bg-purple-500 text-white" : "text-gray-500 bg-transparent cursor-not-allowed hidden"
            )}
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          </button>
        </form>

        {!isGenerating && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1 uppercase tracking-wider font-semibold">
              <Lightbulb size={12} /> Try these examples
            </span>
            <div className="flex gap-2 flex-wrap">
              {examples.map(ex => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-md text-[11px] text-gray-300 text-left transition-colors font-medium hover:text-purple-300"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-purple-500 w-1/2 animate-[pulseRing_1s_infinite]" />
            </div>
            <p className="text-sm text-purple-400 animate-pulse">
              Agent is reasoning and building graph layout...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
