import { useState, useEffect } from 'react'
import { FileSearch, Sparkles, X, ChevronRight, CheckCircle2, Loader2, BrainCircuit } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { showToast } from './ToastManager'

const MOCK_SCAN_STEPS = [
  "Extracting technical requirements...",
  "Identifying interview stages...",
  "Mapping compliance checks...",
  "Optimizing for time-to-hire..."
]

export const JDIntelligenceModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [jdText, setJdText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  
  const loadWorkflow = useWorkflowStore(s => s.loadWorkflow)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open_jd_intelligence', handleOpen)
    return () => window.removeEventListener('open_jd_intelligence', handleOpen)
  }, [])

  if (!isOpen) return null

  const handleStartAnalysis = async () => {
    if (!jdText.trim()) return
    
    setIsAnalyzing(true)
    setScanStep(0)
    
    for (let i = 0; i < MOCK_SCAN_STEPS.length; i++) {
      setScanStep(i)
      await new Promise(r => setTimeout(r, 600))
    }
 
    const prompt = jdText.toLowerCase()
    const nodes: any[] = [
      { id: 'start', type: 'start', position: { x: 0, y: 250 }, data: { label: 'Candidate Entry', title: 'Start' } }
    ]
    const edges: any[] = []
 
    let currentX = 300
    let lastId = 'start'
 
    const addNode = (label: string, type: string = 'task') => {
      const id = `node-${Math.random().toString(36).substr(2, 5)}`
      nodes.push({
        id,
        type,
        position: { x: currentX, y: 250 },
        data: { label, title: label, nodeType: type }
      })
      edges.push({
        id: `e-${lastId}-${id}`,
        source: lastId,
        target: id,
        animated: true,
        type: 'smoothstep'
      })
      lastId = id
      currentX += 300
    }

    // AI Intent Logic
    const isTechnical = prompt.includes('dev') || prompt.includes('engineer') || prompt.includes('software') || prompt.includes('code')
    const isSenior = prompt.includes('senior') || prompt.includes('manager') || prompt.includes('lead') || prompt.includes('architect')

    if (isTechnical) {
      addNode('Technical Screening', 'task')
      addNode('Coding Challenge', 'automated')
      if (isSenior) addNode('Architecture Review', 'approval')
    } else {
      addNode('Initial Screening', 'task')
      addNode('Case Study Presentation', 'task')
    }

    if (isSenior) {
      addNode('Executive Interview', 'approval')
    }

    addNode('Culture Fit Check', 'task')
    addNode('Final Decision', 'approval')
    addNode('Offer / Onboarding', 'end')

    loadWorkflow(nodes, edges)
    
    setTimeout(() => {
      setIsAnalyzing(false)
      setIsOpen(false)
      setJdText("")
      showToast("Strategic AI Workflow Generated!", "success")
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#151320] border border-white/10 w-[600px] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.15)] animate-scaleIn">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BrainCircuit className="text-purple-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">JD Intelligence</h2>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Enterprise Analyzer v1.0</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!isAnalyzing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Paste Job Description</label>
                <textarea 
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the requirements here... (e.g. 'We are looking for a Senior React Developer...')"
                  className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-200 outline-none focus:border-purple-500/50 transition-all resize-none custom-scrollbar"
                />
              </div>

              <button
                onClick={handleStartAnalysis}
                disabled={!jdText.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:grayscale transition-all"
              >
                <Sparkles size={18} />
                Generate Strategic Workflow
              </button>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
                <Loader2 size={60} className="text-purple-400 animate-spin relative" />
              </div>
              
              <div className="space-y-4 w-full max-w-xs">
                {MOCK_SCAN_STEPS.map((step, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 transition-all duration-500 ${i > scanStep ? 'opacity-20 translate-x-4' : 'opacity-100 translate-x-0'}`}
                  >
                    {i < scanStep ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : i === scanStep ? (
                      <Loader2 size={16} className="text-purple-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-black/20 px-6 py-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500/50" />
            <span className="text-[10px] text-gray-500 font-medium">Compliance-Verified Logic</span>
          </div>
          <span className="text-[10px] text-gray-600 font-mono italic">AI-Engine: Advanced Heuristics</span>
        </div>
      </div>
    </div>
  )
}

// Minimal icons used in modal
const ShieldCheck = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
)
