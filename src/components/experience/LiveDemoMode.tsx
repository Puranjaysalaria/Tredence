import { useEffect, useState } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import type { Node, Edge } from 'reactflow'

const DEMO_STEPS = [
  // Step 1: Initializing - Mouse enters from bottom
  { 
    nodes: [], edges: [], label: "Initializing...", 
    cursor: { x: window.innerWidth / 2, y: window.innerHeight } 
  },
  // Step 2: Grab Start node from palette (approx left sidebar)
  { 
    nodes: [], edges: [], label: "Selecting Start Node...", 
    cursor: { x: 50, y: 100 } 
  },
  // Step 3: Add Start on Canvas
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 200 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } }
    ],
    edges: [],
    label: "Dropping Start Node",
    cursor: { x: 400, y: 250 } 
  },
  // Step 4: Grab Task node from palette
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 200 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } }
    ],
    edges: [],
    label: "Selecting Task Node...",
    cursor: { x: 50, y: 180 } 
  },
  // Step 5: Drop Task
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 200 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 350, y: 200 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } }
    ],
    edges: [],
    label: "Dropping Task Node",
    cursor: { x: 700, y: 250 } 
  },
  // Step 6: Move to Start Handle
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 200 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 350, y: 200 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } }
    ],
    edges: [],
    label: "Starting connection...",
    cursor: { x: 620, y: 310 } // Approx Right Handle of Start (x:50 + canvas offset)
  },
  // Step 7: Draw Edge
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 200 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 350, y: 200 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } }
    ],
    edges: [
      { id: 'e-s-t', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' }
    ],
    label: "Drawing Edge",
    cursor: { x: 920, y: 310 } // Move to Task Left Handle
  },
  // Step 8: Add Approval Node
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 200 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 350, y: 200 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } },
      { id: 'demo-approval', type: 'approval', position: { x: 650, y: 200 }, data: { nodeType: 'approval', label: 'Manager Review', title: 'Budget Approval' } }
    ],
    edges: [
      { id: 'e-s-t', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' },
      { id: 'e-t-a', source: 'demo-task', target: 'demo-approval', animated: true, type: 'smoothstep' }
    ],
    label: "Completing workflow...",
    cursor: { x: 1220, y: 310 }
  },
  // Step 9: Click Simulation
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 200 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 350, y: 200 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } },
      { id: 'demo-approval', type: 'approval', position: { x: 650, y: 200 }, data: { nodeType: 'approval', label: 'Manager Review', title: 'Budget Approval' } },
    ],
    edges: [
      { id: 'e-s-t', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' },
      { id: 'e-t-a', source: 'demo-task', target: 'demo-approval', animated: true, type: 'smoothstep' },
    ],
    label: "Simulation Ready!",
    cursor: { x: window.innerWidth / 2, y: window.innerHeight - 50 } // Down to Sim button
  }
]

export const LiveDemoMode = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLabel, setCurrentLabel] = useState('')
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const loadWorkflow = useWorkflowStore(s => s.loadWorkflow)

  useEffect(() => {
    const handleStart = async () => {
      if (isPlaying) return
      setIsPlaying(true)
      
      for (const step of DEMO_STEPS) {
        setCurrentLabel(step.label)
        setCursorPos(step.cursor)
        loadWorkflow(step.nodes as Node[], step.edges as Edge[])
        await new Promise(r => setTimeout(r, 1100))
      }
      
      // Finally, trigger the Sandbox panel to run the simulation
      setTimeout(() => {
        setIsPlaying(false)
        setCursorPos({ x: -100, y: -100 }) // hide it
        window.dispatchEvent(new Event('run_simulation'))
      }, 500)
    }

    window.addEventListener('start_live_demo', handleStart)
    return () => window.removeEventListener('start_live_demo', handleStart)
  }, [isPlaying, loadWorkflow])

  if (!isPlaying) return null

  return (
    <>
      {/* Fake Cursor Overlay */}
      <div 
        className="fixed z-[100] pointer-events-none transition-all"
        style={{ 
          left: cursorPos.x, 
          top: cursorPos.y, 
          transitionDuration: '1100ms',
          transitionTimingFunction: 'ease-in-out'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#000" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <path d="M3 3l7.07 16.972.5-4a2.952 2.952 0 0 1 2.37-2.37l4-.5z"/>
        </svg>
      </div>

      {/* Floating Status Pill */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-teal-500/10 border border-teal-500/30 px-6 py-2 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.2)] animate-fadeInUp flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
        <span className="text-teal-300 font-semibold tracking-wider uppercase text-xs">
          {currentLabel}
        </span>
      </div>
    </>
  )
}
