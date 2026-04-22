// ============================================================================
// CanvasToolbar — Top toolbar with undo/redo, export/import, dagre auto-layout
// ============================================================================

import { useWorkflowStore } from '@/store/workflowStore'
import { useTemporalStore } from '@/hooks/useWorkflowStore'
import { exportWorkflow, importWorkflow } from '@/utils/exportImport'
import { showToast } from '@/components/experience/ToastManager'
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
  BookOpen,
  Video,
  Library,
  BrainCircuit,
  Layout,
  Kanban,
  Wand2
} from 'lucide-react'
import dagre from 'dagre'
import { getRectOfNodes, getTransformForBounds } from 'reactflow'
import { toPng } from 'html-to-image'
import type { Node, Edge } from 'reactflow'
import type { WorkflowNodeData } from '@/types/workflow'

export const CanvasToolbar = () => {
  const viewMode = useWorkflowStore(s => s.viewMode)
  const setViewMode = useWorkflowStore(s => s.setViewMode)
  
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
        showToast('Workflow imported successfully', 'success')
      } catch {
        showToast('Invalid workflow file — could not import', 'error')
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
    showToast('Auto-layout applied', 'info')
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

  const handleRecordGif = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'workflow-recording.webm'
        a.click()
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorder.start()
    } catch {
      alert("Screen recording was cancelled or not supported by your browser.")
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#12101c]/95 border-b border-white/5 backdrop-blur-md z-[100]">
      {/* LEFT: Branding & Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Workflow size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs text-white tracking-tighter leading-none">
              TREDENCE
            </span>
            <span className="text-[9px] font-bold text-purple-400/80 tracking-widest uppercase">
              Designer
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 mx-2" />

        <button 
          onClick={() => window.dispatchEvent(new Event('open_cmd_k'))}
          className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 px-3 py-1.5 rounded-xl transition-all group min-w-[180px]"
        >
          <Search size={14} className="text-gray-500 group-hover:text-purple-400" />
          <span className="text-[11px] text-gray-500 group-hover:text-gray-300 mr-8">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-white/5 text-gray-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* CENTER: View Switcher & Core Controls */}
      <div className="flex items-center gap-6">
        {/* View Toggle */}
        <div className="flex bg-black/40 border border-white/5 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'canvas' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <Layout size={12} />
            Canvas
          </button>
          <button
            onClick={() => setViewMode('pipeline')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'pipeline' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <Kanban size={12} />
            Board
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/5">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>
        
        {/* Export/Import Group */}
        <div className="flex items-center gap-1">
          <button onClick={handleImport} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Import JSON">
            <Upload size={16} />
          </button>
          <button onClick={() => exportWorkflow(nodes, edges)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Export JSON">
            <Download size={16} />
          </button>
          <button onClick={handleExportImage} className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-all" title="Snapshot PNG">
            <ImageIcon size={16} />
          </button>
        </div>
      </div>

      {/* RIGHT: Advanced Tools & AI */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new Event('open_jd_intelligence'))}
          className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all group shrink-0"
          title="JD Intelligence"
        >
          <BrainCircuit size={16} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">JD INTEL</span>
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event('open_template_library'))}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          title="Library"
        >
          <Library size={16} />
        </button>

        <button
          onClick={() => useWorkflowStore.getState().optimizeLayout()}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-amber-400 hover:bg-amber-500/10 transition-all"
          title="Optimize Layout"
        >
          <Wand2 size={16} />
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event('open_tutorial'))}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-purple-400 hover:bg-purple-500/10 transition-all"
          title="Tutorial"
        >
          <BookOpen size={16} />
        </button>
 
        <button
          onClick={() => window.dispatchEvent(new Event('start_live_demo'))}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-emerald-400 hover:bg-emerald-500/10 transition-all"
          title="Live Demo"
        >
          <PlayCircle size={16} />
        </button>
 
        <button
          onClick={() => window.dispatchEvent(new Event('open_export_panel'))}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-rose-400 hover:bg-rose-500/10 transition-all"
          title="Record Video"
        >
          <Video size={16} />
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event('toggle_copilot'))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <Bot size={14} />
          Copilot
        </button>

        <div className="h-6 w-px bg-white/10 mx-1" />

        <button
          onClick={() => { clearCanvas(); showToast('Canvas cleared', 'info') }}
          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all"
          title="Clear"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
