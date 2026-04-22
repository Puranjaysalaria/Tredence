// ============================================================================
// WorkflowTemplates — 3 preset workflow templates
// Demonstrates domain knowledge (onboarding, leave approval, doc verification)
// ============================================================================

import { useWorkflowStore } from '@/store/workflowStore'
import { FileText, UserCheck, FolderSearch } from 'lucide-react'
import type { Node, Edge } from 'reactflow'
import type { WorkflowNodeData } from '@/types/workflow'

interface Template {
  id?: string
  name: string
  icon: React.ReactNode
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
}

export const TEMPLATES: Template[] = [
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    icon: <UserCheck size={14} />,
    nodes: [
      {
        id: 'tpl-start-1',
        type: 'start',
        position: { x: 50, y: 200 },
        data: {
          nodeType: 'start',
          label: 'Start',
          startTitle: 'New Hire Onboarding',
          metadata: [
            { id: '1', key: 'department', value: 'Engineering' },
            { id: '2', key: 'priority', value: 'High' },
          ],
        },
      },
      {
        id: 'tpl-task-1',
        type: 'task',
        position: { x: 320, y: 100 },
        data: {
          nodeType: 'task',
          label: 'Collect Docs',
          title: 'Collect Documents',
          description: 'Gather ID proof, address proof, and educational certificates',
          assignee: 'HR Coordinator',
          dueDate: '',
          customFields: [
            { id: '1', key: 'documents', value: 'ID, Address, Education' },
          ],
        },
      },
      {
        id: 'tpl-approval-1',
        type: 'approval',
        position: { x: 580, y: 200 },
        data: {
          nodeType: 'approval',
          label: 'Manager Approval',
          title: 'Manager Approval',
          approverRole: 'Manager',
          autoApproveThreshold: 0,
        },
      },
      {
        id: 'tpl-auto-1',
        type: 'automated',
        position: { x: 840, y: 100 },
        data: {
          nodeType: 'automated',
          label: 'Welcome Email',
          title: 'Send Welcome Email',
          actionId: 'send_email',
          actionParams: {
            to: 'new_hire@company.com',
            subject: 'Welcome to the team!',
            body: 'We are excited to have you on board.',
          },
        },
      },
      {
        id: 'tpl-end-1',
        type: 'end',
        position: { x: 1100, y: 200 },
        data: {
          nodeType: 'end',
          label: 'Complete',
          endMessage: 'Onboarding complete!',
          showSummary: true,
        },
      },
    ],
    edges: [
      { id: 'e-s1-t1', source: 'tpl-start-1', target: 'tpl-task-1', type: 'smoothstep' },
      { id: 'e-t1-a1', source: 'tpl-task-1', target: 'tpl-approval-1', type: 'smoothstep' },
      { id: 'e-a1-au1', source: 'tpl-approval-1', target: 'tpl-auto-1', type: 'smoothstep' },
      { id: 'e-au1-e1', source: 'tpl-auto-1', target: 'tpl-end-1', type: 'smoothstep' },
    ],
  },
  {
    id: 'leave',
    name: 'Leave Approval',
    icon: <FileText size={14} />,
    nodes: [
      {
        id: 'tpl-start-2',
        type: 'start',
        position: { x: 50, y: 200 },
        data: {
          nodeType: 'start',
          label: 'Start',
          startTitle: 'Leave Request Initiated',
          metadata: [],
        },
      },
      {
        id: 'tpl-task-2',
        type: 'task',
        position: { x: 320, y: 200 },
        data: {
          nodeType: 'task',
          label: 'Fill Form',
          title: 'Fill Leave Application',
          description: 'Employee fills leave type, dates, and reason',
          assignee: 'Employee',
          dueDate: '',
          customFields: [],
        },
      },
      {
        id: 'tpl-approval-2',
        type: 'approval',
        position: { x: 580, y: 200 },
        data: {
          nodeType: 'approval',
          label: 'Manager Approval',
          title: 'Manager Review',
          approverRole: 'Manager',
          autoApproveThreshold: 2,
        },
      },
      {
        id: 'tpl-auto-2',
        type: 'automated',
        position: { x: 840, y: 200 },
        data: {
          nodeType: 'automated',
          label: 'Update HRIS',
          title: 'Update Leave Balance',
          actionId: 'update_hris',
          actionParams: {
            employee_id: '{{employee.id}}',
            field: 'leave_balance',
            value: '{{approved_days}}',
          },
        },
      },
      {
        id: 'tpl-end-2',
        type: 'end',
        position: { x: 1100, y: 200 },
        data: {
          nodeType: 'end',
          label: 'Done',
          endMessage: 'Leave request processed',
          showSummary: false,
        },
      },
    ],
    edges: [
      { id: 'e-s2-t2', source: 'tpl-start-2', target: 'tpl-task-2', type: 'smoothstep' },
      { id: 'e-t2-a2', source: 'tpl-task-2', target: 'tpl-approval-2', type: 'smoothstep' },
      { id: 'e-a2-au2', source: 'tpl-approval-2', target: 'tpl-auto-2', type: 'smoothstep' },
      { id: 'e-au2-e2', source: 'tpl-auto-2', target: 'tpl-end-2', type: 'smoothstep' },
    ],
  },
  {
    id: 'document',
    name: 'Document Verification',
    icon: <FolderSearch size={14} />,
    nodes: [
      {
        id: 'tpl-start-3',
        type: 'start',
        position: { x: 50, y: 200 },
        data: {
          nodeType: 'start',
          label: 'Start',
          startTitle: 'Document Submission',
          metadata: [],
        },
      },
      {
        id: 'tpl-task-3',
        type: 'task',
        position: { x: 320, y: 200 },
        data: {
          nodeType: 'task',
          label: 'Upload Docs',
          title: 'Upload Documents',
          description: 'Employee uploads required documents for verification',
          assignee: 'Employee',
          dueDate: '',
          customFields: [],
        },
      },
      {
        id: 'tpl-auto-3',
        type: 'automated',
        position: { x: 580, y: 200 },
        data: {
          nodeType: 'automated',
          label: 'Auto Scan',
          title: 'Document Scan',
          actionId: 'generate_doc',
          actionParams: {
            template: 'verification_report',
            recipient: 'hr@company.com',
          },
        },
      },
      {
        id: 'tpl-approval-3',
        type: 'approval',
        position: { x: 840, y: 200 },
        data: {
          nodeType: 'approval',
          label: 'HR Review',
          title: 'HR Verification',
          approverRole: 'HRBP',
          autoApproveThreshold: 0,
        },
      },
      {
        id: 'tpl-end-3',
        type: 'end',
        position: { x: 1100, y: 200 },
        data: {
          nodeType: 'end',
          label: 'Verified',
          endMessage: 'Documents verified successfully',
          showSummary: true,
        },
      },
    ],
    edges: [
      { id: 'e-s3-t3', source: 'tpl-start-3', target: 'tpl-task-3', type: 'smoothstep' },
      { id: 'e-t3-au3', source: 'tpl-task-3', target: 'tpl-auto-3', type: 'smoothstep' },
      { id: 'e-au3-a3', source: 'tpl-auto-3', target: 'tpl-approval-3', type: 'smoothstep' },
      { id: 'e-a3-e3', source: 'tpl-approval-3', target: 'tpl-end-3', type: 'smoothstep' },
    ],
  },
]

export const WorkflowTemplates = () => {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow)

  return (
    <div className="mt-auto p-3 border-t border-gray-700">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
        <span>Templates</span>
        <button 
          onClick={() => window.dispatchEvent(new Event('open_template_library'))}
          className="text-blue-400 hover:text-blue-300 capitalize text-[9px]"
        >
          View Library
        </button>
      </p>
      <div className="space-y-1">
        {TEMPLATES.map((template, idx) => (
          <button
            key={idx}
            onClick={() => loadWorkflow(template.nodes, template.edges)}
            className="w-full text-left text-xs text-gray-400 hover:text-white py-2 px-2.5
                       hover:bg-gray-700/50 rounded-md transition-all duration-150
                       flex items-center gap-2 group"
          >
            <span className="text-gray-500 group-hover:text-purple-400 transition-colors">
              {template.icon}
            </span>
            {template.name}
          </button>
        ))}
      </div>
    </div>
  )
}

