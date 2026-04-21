// ============================================================================
// CanvasToolbar — Top toolbar with undo/redo, export/import, dagre auto-layout
// ============================================================================

import { useWorkflowStore } from '@/store/workflowStore'
import { useTemporalStore } from '@/hooks/useWorkflowStore'
import { exportWorkflow, importWorkflow } from '@/utils/exportImport'
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  Trash2,
  LayoutDashboard,
  Workflow,
  Save,
  Image as ImageIcon,
  PlayCircle,
  Bot,
  Search,
  BookOpen
} from 'lucide-react'
import dagre from 'dagre'
import { getRectOfNodes, getTransformForBounds } from 'reactflow'
import { toPng } from 'html-to-image'
import type { Node, Edge } from 'reactflow'
import type { WorkflowNodeData } from '@/types/workflow'

export const CanvasToolbar = () => {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow)
  const clearCanvas = useWorkflowStore((s) => s.clearCanvas)

  const canUndo = useTemporalStore((s) => s.pastStates.length > 0)
  const canRedo = useTemporalStore((s) => s.futureStates.length > 0)

  const handleUndo = () => {
    useWorkflowStore.temporal.getState().undo()
  }

  const handleRedo = () => {
    useWorkflowStore.temporal.getState().redo()
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const { nodes: n, edges: ed } = await importWorkflow(file)
        loadWorkflow(n, ed)
      } catch {
        alert('Invalid workflow file')
      }
    }
    input.click()
  }

  const handleAutoLayout = () => {
    if (nodes.length === 0) return

    const g = new dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({
      rankdir: 'LR',
      nodesep: 60,
      ranksep: 120,
      marginx: 50,
      marginy: 50,
    })

    nodes.forEach((node) => {
      g.setNode(node.id, { width: 200, height: 80 })
    })

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target)
    })

    dagre.layout(g)

    const layoutedNodes: Node<WorkflowNodeData>[] = nodes.map((node) => {
      const pos = g.node(node.id)
      return {
        ...node,
        position: {
          x: pos.x - 100,
          y: pos.y - 40,
        },
      }
    })

    loadWorkflow(layoutedNodes, edges)
  }

  const handleExportImage = () => {
    const nodesBounds = getRectOfNodes(nodes)
    const transform = getTransformForBounds(nodesBounds, nodesBounds.width, nodesBounds.height, 0.5, 2)
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!viewport) return
    
    toPng(viewport, {
      backgroundColor: '#0b0c10',
      width: nodesBounds.width * 2,
      height: nodesBounds.height * 2,
      style: {
        width: `${nodesBounds.width}px`,
        height: `${nodesBounds.height}px`,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then((dataUrl) => {
      const a = document.createElement('a')
      a.setAttribute('download', 'workflow-diagram.png')
      a.setAttribute('href', dataUrl)
      a.click()
    })
  }

  const handleLiveDemo = () => {
    // We dispatch a custom event to start the macro
    window.dispatchEvent(new Event('start_live_demo'))
  }

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-[#1e2128] border-b border-gray-700">
      {/* Brand */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Workflow size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm text-white tracking-tight">
          HR Workflow Designer
        </span>
      </div>

      {/* Search (Cmd+K) */}
      <button 
        onClick={() => window.dispatchEvent(new Event('open_cmd_k'))}
        className="flex items-center gap-2 bg-[#12101c] hover:bg-[#1a1825] border border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-text group"
      >
        <Search size={14} className="text-gray-400 group-hover:text-white" />
        <span className="text-xs text-gray-500 mr-8">Search anything...</span>
        <kbd className="hidden sm:inline-block px-1.5 rounded text-[10px] font-medium bg-white/10 text-gray-400">
          ⌘K
        </kbd>
      </button>

      <div className="w-px h-5 bg-gray-600 mx-2" />

      {/* Undo / Redo - Premium Pill Style */}
      <div className="flex bg-[#12101c] border border-white/10 rounded-full p-0.5">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all font-bold"
          title="Undo (Ctrl+Z)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all font-bold"
          title="Redo (Ctrl+Y)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </button>
      </div>

      <div className="w-px h-5 bg-gray-600 mx-2" />

      {/* Action Tools */}
      <div className="flex gap-1">
        <button
          onClick={() => exportWorkflow(nodes, edges)}
          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors"
          title="Export JSON"
        >
          <Download size={18} strokeWidth={2} />
        </button>
        <button onClick={handleImport} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors" title="Import JSON">
          <Upload size={18} strokeWidth={2} />
        </button>
        
        <button
          onClick={handleExportImage}
          className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
          title="Export as PNG Screenshot"
          disabled={nodes.length === 0}
        >
          <ImageIcon size={18} strokeWidth={2} />
        </button>

        <button
          onClick={handleAutoLayout}
          className="p-1.5 rounded-lg text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 transition-colors"
          title="Auto-layout (dagre)"
          disabled={nodes.length === 0}
        >
          <LayoutDashboard size={18} strokeWidth={2} />
        </button>
      </div>
      
      <div className="w-px h-5 bg-gray-600 mx-1" />

      {/* Save Custom Template */}
      <button
        onClick={() => {
          if (nodes.length === 0) return
          const presetName = prompt('Enter a name for this custom template:')
          if (!presetName) return
          const stored = JSON.parse(localStorage.getItem('custom_templates') || '[]')
          stored.push({ name: presetName, nodes, edges })
          localStorage.setItem('custom_templates', JSON.stringify(stored))
          window.dispatchEvent(new Event('custom_templates_updated'))
        }}
        className="toolbar-btn text-[#a855f7] hover:text-[#c084fc] hover:bg-[#a855f7]/10"
        title="Save as Custom Template"
        disabled={nodes.length === 0}
      >
        <Save size={16} />
      </button>

      <div className="w-px h-5 bg-gray-600 mx-2" />

      {/* Interactive & AI Features */}
      <button
        onClick={() => window.dispatchEvent(new Event('open_tutorial'))}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-all font-semibold text-[11px] uppercase tracking-wider"
      >
        <BookOpen size={14} />
        Tutorial
      </button>
      
      <button
        onClick={handleLiveDemo}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-all font-semibold text-[11px] uppercase tracking-wider animate-pulseRing"
      >
        <PlayCircle size={14} />
        Live Demo
      </button>

      <button
        onClick={() => window.dispatchEvent(new Event('toggle_copilot'))}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#a855f7] hover:bg-[#b875f8] text-white shadow-lg shadow-purple-500/30 transition-all font-semibold text-[11px] uppercase tracking-wider"
      >
        <Bot size={14} />
        Copilot
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Node count */}
      <span className="text-[11px] text-gray-500 mr-2">
        {nodes.length} node{nodes.length !== 1 ? 's' : ''} ·{' '}
        {edges.length} edge{edges.length !== 1 ? 's' : ''}
      </span>

      {/* Clear */}
      <button
        onClick={clearCanvas}
        className="toolbar-btn text-red-400 hover:text-red-300"
        title="Clear canvas"
        disabled={nodes.length === 0}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
