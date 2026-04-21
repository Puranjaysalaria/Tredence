import { useEffect, useState } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { CheckCircle2, ChevronRight, X } from 'lucide-react'

export const InteractiveTutorial = () => {
  const [isActive, setIsActive] = useState(false)
  const nodes = useWorkflowStore(s => s.nodes)
  const edges = useWorkflowStore(s => s.edges)
  
  useEffect(() => {
    const handleStart = () => setIsActive(true)
    window.addEventListener('open_tutorial', handleStart)
    return () => window.removeEventListener('open_tutorial', handleStart)
  }, [])

  if (!isActive) return null

  // Evaluate current step based on Zustand state
  let currentStep = 1
  let message = "Welcome! Let's build a workflow. Drag a 'Start' node from the left palette onto the canvas."
  let isDone = false

  const hasStart = nodes.some(n => n.type === 'start')
  const hasTask = nodes.some(n => n.type === 'task')
  const hasMultiple = nodes.length >= 2
  const hasConnection = edges.length >= 1

  if (hasStart && !hasTask) {
    currentStep = 2
    message = "Great! Now drag a 'Task' node onto the canvas."
  } else if (hasMultiple && !hasConnection) {
    currentStep = 3
    message = "Hover over the Start node's dot and drag an arrow to connect it to the Task node."
  } else if (hasConnection && nodes.length < 3) {
    currentStep = 4
    message = "Perfect! Click 'Run Simulation' at the bottom to see it execute, or keep building!"
    isDone = true
  }

  return (
    <div className="absolute top-20 right-8 z-40 bg-[#151320] border border-pink-500/30 p-4 rounded-xl shadow-[0_0_30px_rgba(236,72,153,0.15)] w-80 animate-slideInRight">
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
          <ChevronRight size={14} /> Training Mission
        </div>
        <button onClick={() => setIsActive(false)} className="text-gray-500 hover:text-white">
          <X size={14} />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex gap-2 mb-1">
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            className={`flex-1 h-1.5 rounded-full ${
              step < currentStep 
                ? 'bg-green-500' 
                : step === currentStep 
                  ? 'bg-pink-500 animate-pulse' 
                  : 'bg-gray-700'
            }`} 
          />
        ))}
      </div>

      {isDone && (
        <div className="mt-4 flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-2 rounded-lg text-sm font-semibold">
          <CheckCircle2 size={16} /> Tutorial Completed!
        </div>
      )}
    </div>
  )
}
