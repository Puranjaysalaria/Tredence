// ============================================================================
// App — Root layout with 3-panel design
// Left: Node Palette + Templates
// Center: Canvas + Sandbox
// Right: Node Form Panel
// ============================================================================

import { ReactFlowProvider } from 'reactflow'
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas'
import { CanvasToolbar } from '@/components/canvas/CanvasToolbar'
import { NodePalette } from '@/components/sidebar/NodePalette'
import { NodeFormPanel } from '@/components/forms/NodeFormPanel'
import { SandboxPanel } from '@/components/sandbox/SandboxPanel'
import { CopilotPanel } from '@/components/copilot/CopilotPanel'
import { CommandPalette } from '@/components/experience/CommandPalette'
import { LiveDemoMode } from '@/components/experience/LiveDemoMode'
import { InteractiveTutorial } from '@/components/experience/InteractiveTutorial'

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-[#0b0c10] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0b0c10] to-[#0b0c10] text-white overflow-hidden font-sans">
        <CommandPalette />
        <LiveDemoMode />
        <InteractiveTutorial />
        
        {/* Top toolbar */}
        <CanvasToolbar />

        {/* Main 3-panel layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Node palette + Templates */}
          <NodePalette />

          {/* Centre: React Flow Canvas + Sandbox */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <WorkflowCanvas />
            <SandboxPanel />
            <CopilotPanel />
          </div>

          {/* Right: Node form panel (slides in when node selected) */}
          <NodeFormPanel />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
