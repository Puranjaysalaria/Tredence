// ============================================================================
// InteractiveTutorial — Full-screen overlay with its own isolated ReactFlow canvas
// Steps: Start → Task → End → Connect → Run Simulation
// ============================================================================

import { useState, useEffect, useCallback } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  X, CheckCircle2, ChevronRight, Trophy, Play,
  RotateCcw, Sparkles
} from 'lucide-react'
import { nodeTypes } from '@/components/nodes'
import { createNode } from '@/utils/nodeHelpers'
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from 'reactflow'
import type { WorkflowNodeData, NodeType } from '@/types/workflow'

// ── Tutorial Steps ───────────────────────────────────────────────────────────
const STEPS = [
  {
    step: 1,
    title: 'Add a Start Node',
    instruction: "Drag the 'Start' node from the left panel onto the canvas to begin your workflow.",
    check: (nodes: Node[], _edges: Edge[]) => nodes.some(n => n.type === 'start'),
  },
  {
    step: 2,
    title: 'Add a Task Node',
    instruction: "Great! Now drag a 'Task' node onto the canvas — this represents a human action.",
    check: (nodes: Node[], _edges: Edge[]) => nodes.some(n => n.type === 'task'),
  },
  {
    step: 3,
    title: 'Add an End Node',
    instruction: "Almost there! Drag an 'End' node to complete the workflow path.",
    check: (nodes: Node[], _edges: Edge[]) => nodes.some(n => n.type === 'end'),
  },
  {
    step: 4,
    title: 'Connect the Nodes',
    instruction: "Hover over a node's edge handle (the small dot) and drag an arrow to connect Start → Task → End.",
    check: (_nodes: Node[], edges: Edge[]) => edges.length >= 2,
  },
  {
    step: 5,
    title: 'Run the Simulation',
    instruction: "You did it! Click the 'Run Simulation' button below to execute the workflow.",
    check: (_nodes: Node[], _edges: Edge[]) => false, // triggered manually
  },
]

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#a855f7',
    width: 18,
    height: 18,
  },
  style: { stroke: '#a855f7', strokeWidth: 2 },
}

// ── Mini Node Palette ─────────────────────────────────────────────────────────
const PALETTE: { type: NodeType; label: string; color: string }[] = [
  { type: 'start',    label: 'Start',    color: '#1D9E75' },
  { type: 'task',     label: 'Task',     color: '#378ADD' },
  { type: 'approval', label: 'Approval', color: '#BA7517' },
  { type: 'automated',label: 'Automated',color: '#7F77DD' },
  { type: 'end',      label: 'End',      color: '#D85A30' },
]

export const InteractiveTutorial = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [simRunning, setSimRunning] = useState(false)
  const [simSteps, setSimSteps] = useState<string[]>([])

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      // Reset tutorial state when opened
      setNodes([])
      setEdges([])
      setCurrentStep(0)
      setCompleted(false)
      setSimRunning(false)
      setSimSteps([])
    }
    window.addEventListener('open_tutorial', handleOpen)
    return () => window.removeEventListener('open_tutorial', handleOpen)
  }, [])

  // Auto-advance steps based on canvas state
  useEffect(() => {
    if (!isOpen || completed) return
    for (let i = STEPS.length - 2; i >= 0; i--) {
      if (STEPS[i].check(nodes, edges)) {
        if (currentStep <= i) setCurrentStep(i + 1)
        break
      }
    }
  }, [nodes, edges, isOpen, completed, currentStep])

  // ReactFlow handlers (isolated — no global store)
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes(nds => applyNodeChanges(changes, nds) as Node<WorkflowNodeData>[]),
    []
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  )
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges(eds => addEdge({ ...connection, animated: true, type: 'smoothstep' }, eds)),
    []
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('application/reactflow') as NodeType
    if (!type) return
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const position = { x: e.clientX - bounds.left - 75, y: e.clientY - bounds.top - 30 }
    setNodes(nds => [...nds, createNode(type, position)])
  }, [])

  // Simulate run
  const handleRunSimulation = () => {
    if (simRunning) return
    setSimRunning(true)
    setSimSteps([])
    const workflowNodes = nodes.filter(n => n.type !== undefined)
    const labels = workflowNodes.map(n => n.data?.label ?? n.type ?? 'Node')

    labels.forEach((label, i) => {
      setTimeout(() => {
        setSimSteps(prev => [...prev, label])
        if (i === labels.length - 1) {
          setTimeout(() => {
            setSimRunning(false)
            setCompleted(true)
          }, 400)
        }
      }, i * 700)
    })
  }

  const handleReset = () => {
    setNodes([])
    setEdges([])
    setCurrentStep(0)
    setCompleted(false)
    setSimRunning(false)
    setSimSteps([])
  }

  if (!isOpen) return null

  const step = STEPS[Math.min(currentStep, STEPS.length - 1)]
  const progress = ((currentStep) / STEPS.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0c10] animate-fadeIn">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#151320] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <Sparkles size={16} className="text-pink-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Interactive Tutorial</h1>
            <p className="text-[11px] text-gray-500">Sandbox — changes here do not affect your main workflow</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Progress Bar ────────────────────────────────────────── */}
      <div className="h-1 bg-gray-800 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Main Layout ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Mini Palette */}
        <div className="w-44 bg-[#151320] border-r border-white/5 flex flex-col p-3 gap-2 shrink-0">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Node Types</p>
          {PALETTE.map(({ type, label, color }) => (
            <div
              key={type}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', type)
                e.dataTransfer.effectAllowed = 'move'
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 cursor-grab hover:bg-white/[0.07] hover:border-white/10 transition-all active:cursor-grabbing"
              style={{ borderLeftColor: color, borderLeftWidth: 3 }}
            >
              <span className="text-xs font-medium text-gray-200">{label}</span>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            defaultEdgeOptions={defaultEdgeOptions}
            deleteKeyCode="Delete"
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="rgba(168,85,247,0.12)" />
            <Controls className="!bg-[#151320]/80 !border-white/10" showInteractive={false} />
          </ReactFlow>

          {/* Empty canvas hint */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-5xl mb-3">👈</div>
                <p className="text-gray-500 text-sm font-medium">Drag a node from the left panel</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Step Guide + Simulation */}
        <div className="w-72 bg-[#151320] border-l border-white/5 flex flex-col shrink-0">
          {/* Step tracker */}
          <div className="p-4 border-b border-white/5">
            <div className="flex gap-1 mb-4">
              {STEPS.map((s, i) => (
                <div
                  key={s.step}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                    i < currentStep
                      ? 'bg-green-500'
                      : i === currentStep
                      ? 'bg-pink-500 animate-pulse'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {!completed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                    Step {currentStep + 1} of {STEPS.length}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{step.instruction}</p>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center">
                    <Trophy size={28} className="text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">Tutorial Completed! 🎉</h3>
                <p className="text-xs text-gray-400">You've mastered the basics. Go build something amazing on the main canvas!</p>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Wake up the main canvas and sync state
                    setTimeout(() => {
                      window.dispatchEvent(new Event('fit_view'))
                      window.dispatchEvent(new Event('force_ui_sync'))
                    }, 50)
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-500/30"
                >
                  Start Building →
                </button>
              </div>
            )}

            {/* Completed steps list */}
            <div className="mt-4 space-y-1.5">
              {STEPS.slice(0, currentStep).map(s => (
                <div key={s.step} className="flex items-center gap-2 text-xs text-green-400">
                  <CheckCircle2 size={13} />
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Panel */}
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Simulation</p>

            {!completed && (
              <button
                onClick={handleRunSimulation}
                disabled={simRunning || currentStep < 4}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 text-orange-300 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play size={13} />
                {simRunning ? 'Running…' : 'Run Simulation'}
              </button>
            )}

            {currentStep < 4 && !completed && (
              <p className="text-[11px] text-gray-600 text-center mt-2">Complete all steps first to run</p>
            )}

            {/* Sim steps log */}
            {simSteps.length > 0 && (
              <div className="mt-3 space-y-1.5 flex-1 overflow-y-auto">
                {simSteps.map((label, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 animate-fadeIn">
                    <ChevronRight size={12} className="text-purple-400" />
                    <span className="text-gray-300">{label}</span>
                    {!simRunning && i === simSteps.length - 1 && (
                      <CheckCircle2 size={11} className="text-green-400 ml-auto" />
                    )}
                  </div>
                ))}
                {!simRunning && simSteps.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-green-400 font-semibold mt-2 pt-2 border-t border-green-500/10">
                    <CheckCircle2 size={13} />
                    All steps executed!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
