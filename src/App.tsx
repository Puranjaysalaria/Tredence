// ============================================================================
// App — Root layout with 3-panel design
// Left: Node Palette + Templates
// Center: Canvas + Sandbox
// Right: Node Form Panel
// ============================================================================

import { ReactFlowProvider } from 'reactflow'
import { useWorkflowStore } from '@/store/workflowStore'
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas'
import { CanvasToolbar } from '@/components/canvas/CanvasToolbar'
import { NodePalette } from '@/components/sidebar/NodePalette'
import { NodeFormPanel } from '@/components/forms/NodeFormPanel'
import { SandboxPanel } from '@/components/sandbox/SandboxPanel'
import { CopilotPanel } from '@/components/copilot/CopilotPanel'
import { CommandPalette } from '@/components/experience/CommandPalette'
import { LiveDemoMode } from '@/components/experience/LiveDemoMode'
import { InteractiveTutorial } from '@/components/experience/InteractiveTutorial'
import { SaveTemplateModal } from '@/components/experience/SaveTemplateModal'
import { TemplateLibraryModal } from '@/components/experience/TemplateLibraryModal'
import { ExportPanel } from '@/components/experience/ExportPanel'
import { ToastManager } from '@/components/experience/ToastManager'
import { AppStatusBar } from '@/components/experience/AppStatusBar'
import { JDIntelligenceModal } from '@/components/experience/JDIntelligenceModal'

export default function App() {
  const viewMode = useWorkflowStore(s => s.viewMode)

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-[#0b0c10] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0b0c10] to-[#0b0c10] text-white overflow-hidden font-sans">
        <CommandPalette />
        <LiveDemoMode />
        <InteractiveTutorial />
        <SaveTemplateModal />
        <TemplateLibraryModal />
        <ExportPanel />
        <ToastManager />
        <JDIntelligenceModal />
        <AppStatusBar />
        
        {/* Top toolbar */}
        <CanvasToolbar />

        {/* Main layout area */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left: Node palette (Only in Designer mode) */}
          {viewMode === 'canvas' && <NodePalette />}

          {/* Centre: React Flow Canvas or Pipeline Board */}
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <WorkflowCanvas />
            {viewMode === 'canvas' && <SandboxPanel />}
            <CopilotPanel />
          </div>

          {/* Right: Node form panel (Only in Designer mode) */}
          {viewMode === 'canvas' && <NodeFormPanel />}
        </div>
      </div>
    </ReactFlowProvider>
  )
}
