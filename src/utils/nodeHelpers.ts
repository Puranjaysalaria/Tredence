// ============================================================================
// Node Helpers — Factory function, color mapping, mock messages
// ============================================================================

import type { Node, XYPosition } from 'reactflow'
import type { NodeType, WorkflowNodeData } from '@/types/workflow'

/**
 * Factory function to create a typed workflow node with sensible defaults.
 * Generates a unique ID using crypto.randomUUID().
 */
export const createNode = (
  type: NodeType,
  position: XYPosition
): Node<WorkflowNodeData> => {
  const id = `${type}-${crypto.randomUUID().slice(0, 8)}`

  const defaultData: Record<NodeType, WorkflowNodeData> = {
    start: {
      nodeType: 'start',
      label: 'Start',
      startTitle: 'Workflow Start',
      metadata: [],
    },
    task: {
      nodeType: 'task',
      label: 'Task',
      title: 'New Task',
      description: '',
      assignee: '',
      dueDate: '',
      customFields: [],
    },
    approval: {
      nodeType: 'approval',
      label: 'Approval',
      title: 'Approval Required',
      approverRole: 'Manager',
      autoApproveThreshold: 0,
    },
    automated: {
      nodeType: 'automated',
      label: 'Automated Step',
      title: 'Automated Action',
      actionId: '',
      actionParams: {},
    },
    end: {
      nodeType: 'end',
      label: 'End',
      endMessage: 'Workflow complete',
      showSummary: false,
    },
  }

  return { id, type, position, data: defaultData[type] }
}

/** Maps node type → accent color for visual distinction. */
export const getNodeColor = (type: string): string => {
  const colors: Record<string, string> = {
    start: '#1D9E75',
    task: '#378ADD',
    approval: '#BA7517',
    automated: '#7F77DD',
    end: '#D85A30',
  }
  return colors[type] ?? '#888780'
}

/** Maps node type → mock simulation message. */
export const getMockMessage = (type: string): string => {
  const messages: Record<string, string> = {
    start: 'Workflow initialized successfully',
    task: 'Task assigned and in progress',
    approval: 'Approval request sent, awaiting response',
    automated: 'Automation triggered and completed',
    end: 'Workflow completed successfully',
  }
  return messages[type] ?? 'Step executed'
}
