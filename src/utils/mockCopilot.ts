import { Node, Edge } from 'reactflow'
import { WorkflowNodeData } from '@/types/workflow'

export const generateMockAIWorkflow = (prompt: string): { nodes: Node<WorkflowNodeData>[], edges: Edge[] } => {
  const p = prompt.toLowerCase()
  
  if (p.includes('leave') || p.includes('vacation') || p.includes('off')) {
    return {
      nodes: [
        { id: 'ai-start-1', type: 'start', position: { x: 0, y: 0 }, data: { nodeType: 'start', label: 'Start', startTitle: 'Leave Request Initiated', metadata: [] } },
        { id: 'ai-task-1', type: 'task', position: { x: 0, y: 0 }, data: { nodeType: 'task', label: 'Submit Proof', title: 'Submit Medical/Travel Docs', description: '', assignee: 'Employee', dueDate: '', customFields: [] } },
        { id: 'ai-approval-1', type: 'approval', position: { x: 0, y: 0 }, data: { nodeType: 'approval', label: 'HR & Manager Approval', title: 'Double Approval', approverRole: 'Manager & HR', autoApproveThreshold: 0 } },
        { id: 'ai-auto-1', type: 'automated', position: { x: 0, y: 0 }, data: { nodeType: 'automated', label: 'Update PayRoll', title: 'Deduct Leave', actionId: 'update_hris', actionParams: {} } },
        { id: 'ai-end-1', type: 'end', position: { x: 0, y: 0 }, data: { nodeType: 'end', label: 'Done', endMessage: 'Leave Processed', showSummary: true } }
      ],
      edges: [
        { id: 'ea1', source: 'ai-start-1', target: 'ai-task-1', type: 'smoothstep', animated: true },
        { id: 'ea2', source: 'ai-task-1', target: 'ai-approval-1', type: 'smoothstep', animated: true },
        { id: 'ea3', source: 'ai-approval-1', target: 'ai-auto-1', type: 'smoothstep', animated: true },
        { id: 'ea4', source: 'ai-auto-1', target: 'ai-end-1', type: 'smoothstep', animated: true }
      ]
    }
  }

  // Default Onboarding fallback
  return {
    nodes: [
      { id: 'ai-start-1', type: 'start', position: { x: 0, y: 0 }, data: { nodeType: 'start', label: 'Start', startTitle: 'New Hire Initiated', metadata: [] } },
      { id: 'ai-task-1', type: 'task', position: { x: 0, y: 0 }, data: { nodeType: 'task', label: 'IT Setup', title: 'Ship Laptop & Setup Accounts', description: 'Procure Macbook M3', assignee: 'IT Dept', dueDate: '', customFields: [] } },
      { id: 'ai-auto-1', type: 'automated', position: { x: 0, y: 0 }, data: { nodeType: 'automated', label: 'Notify Slack', title: 'Welcome to General', actionId: 'notify_slack', actionParams: {} } },
      { id: 'ai-approval-1', type: 'approval', position: { x: 0, y: 0 }, data: { nodeType: 'approval', label: 'Security Review', title: 'Review Access', approverRole: 'Security Team', autoApproveThreshold: 0 } },
      { id: 'ai-end-1', type: 'end', position: { x: 0, y: 0 }, data: { nodeType: 'end', label: 'Ready', endMessage: 'Onboarding Completed', showSummary: true } }
    ],
    edges: [
      { id: 'ea1', source: 'ai-start-1', target: 'ai-task-1', type: 'smoothstep', animated: true },
      { id: 'ea2', source: 'ai-task-1', target: 'ai-auto-1', type: 'smoothstep', animated: true },
      { id: 'ea3', source: 'ai-auto-1', target: 'ai-approval-1', type: 'smoothstep', animated: true },
      { id: 'ea4', source: 'ai-approval-1', target: 'ai-end-1', type: 'smoothstep', animated: true }
    ]
  }
}
