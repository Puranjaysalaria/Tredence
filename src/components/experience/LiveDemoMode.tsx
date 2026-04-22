import { useEffect, useState } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import type { Node, Edge } from 'reactflow'

const OFF_X = 250
const OFF_Y = 150

const DEMO_STEPS = [
  // 1: Coming up
  { nodes: [], edges: [], label: "Initializing...", cursor: { x: window.innerWidth / 2, y: window.innerHeight } },
  
  // 2: Move to Palette - Start Node
  { nodes: [], edges: [], label: "Selecting Start Node...", cursor: { x: 120, y: 180 } },
  
  // 3: Drop Start
  {
    nodes: [{ id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } }],
    edges: [],
    label: "Dropping Start Node",
    cursor: { x: 50 + OFF_X + 100, y: 150 + OFF_Y } 
  },

  // 4: Move to Palette - Task Node
  {
    nodes: [{ id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } }],
    edges: [],
    label: "Selecting Task Node...",
    cursor: { x: 120, y: 280 } 
  },

  // 5: Drop Task
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } }
    ],
    edges: [],
    label: "Dropping Task Node",
    cursor: { x: 280 + OFF_X + 100, y: 150 + OFF_Y } 
  },

  // 6: Grab Start Handle
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } }
    ],
    edges: [],
    label: "Connecting Nodes...",
    cursor: { x: 50 + OFF_X + 220, y: 150 + OFF_Y + 40 } // Start Right Handle
  },

  // 7: Draw Edge 1
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } }
    ],
    edges: [{ id: 'e-1', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' }],
    label: "Edge Created",
    cursor: { x: 280 + OFF_X - 10, y: 150 + OFF_Y + 40 } // Task Left Handle
  },

  // 8: Move to Palette - Approval Node
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } }
    ],
    edges: [{ id: 'e-1', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' }],
    label: "Selecting Approval Node...",
    cursor: { x: 120, y: 380 } // Approval is further down sidebar
  },

  // 9: Drop Approval
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } },
      { id: 'demo-approval', type: 'approval', position: { x: 510, y: 150 }, data: { nodeType: 'approval', label: 'Manager Review', title: 'Budget Approval' } }
    ],
    edges: [{ id: 'e-1', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' }],
    label: "Dropping Approval Node",
    cursor: { x: 510 + OFF_X + 100, y: 150 + OFF_Y }
  },

  // 10: Grab Task Handle
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } },
      { id: 'demo-approval', type: 'approval', position: { x: 510, y: 150 }, data: { nodeType: 'approval', label: 'Manager Review', title: 'Budget Approval' } }
    ],
    edges: [{ id: 'e-1', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' }],
    label: "Connecting to Review...",
    cursor: { x: 280 + OFF_X + 220, y: 150 + OFF_Y + 40 } // Task Right Handle
  },

  // 11: Draw Edge 2
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } },
      { id: 'demo-approval', type: 'approval', position: { x: 510, y: 150 }, data: { nodeType: 'approval', label: 'Manager Review', title: 'Budget Approval' } }
    ],
    edges: [
      { id: 'e-1', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' },
      { id: 'e-2', source: 'demo-task', target: 'demo-approval', animated: true, type: 'smoothstep' }
    ],
    label: "Edge Created",
    cursor: { x: 510 + OFF_X - 10, y: 150 + OFF_Y + 40 } // Approval Left Handle
  },

  // 12: Go to Play button
  {
    nodes: [
      { id: 'demo-start', type: 'start', position: { x: 50, y: 150 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Ticket' } },
      { id: 'demo-task', type: 'task', position: { x: 280, y: 150 }, data: { nodeType: 'task', label: 'Assign Laptop', title: 'IT Setup', description: 'Procure Macbook' } },
      { id: 'demo-approval', type: 'approval', position: { x: 510, y: 150 }, data: { nodeType: 'approval', label: 'Manager Review', title: 'Budget Approval' } }
    ],
    edges: [
      { id: 'e-1', source: 'demo-start', target: 'demo-task', animated: true, type: 'smoothstep' },
      { id: 'e-2', source: 'demo-task', target: 'demo-approval', animated: true, type: 'smoothstep' }
    ],
    label: "Simulation Ready!",
    cursor: { x: window.innerWidth / 2, y: window.innerHeight - 30 }
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
        await new Promise(r => setTimeout(r, 900)) // Snappier transitions
      }
      
      setTimeout(() => {
        setIsPlaying(false)
        setCursorPos({ x: -100, y: -100 }) 
        window.dispatchEvent(new Event('run_simulation'))
      }, 500)
    }

    window.addEventListener('start_live_demo', handleStart)
    return () => window.removeEventListener('start_live_demo', handleStart)
  }, [isPlaying, loadWorkflow])

  if (!isPlaying) return null

  return (
    <>
      <div 
        className="fixed z-[100] pointer-events-none transition-all"
        style={{ 
          left: cursorPos.x, 
          top: cursorPos.y, 
          transitionDuration: '900ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' // Smoother, more natural easing
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#000" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <path d="M3 3l7.07 16.972.5-4a2.952 2.952 0 0 1 2.37-2.37l4-.5z"/>
        </svg>
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-teal-500/10 border border-teal-500/30 px-6 py-2 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.2)] animate-fadeInUp flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
        <span className="text-teal-300 font-semibold tracking-wider uppercase text-xs">
          {currentLabel}
        </span>
      </div>
    </>
  )
}
