// ============================================================================
// HR Workflow Designer — Type Definitions
// All TypeScript interfaces and types live in this single file.
// Uses discriminated union pattern for exhaustive type checking.
// ============================================================================

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end'

export interface KVPair {
  id: string
  key: string
  value: string
}

// ---------------------------------------------------------------------------
// Node Data — Discriminated Union
// ---------------------------------------------------------------------------

/** Base interface shared by all node data. */
interface BaseNodeData {
  label: string
  nodeType: NodeType
  isValid?: boolean
  validationErrors?: string[]
}

export interface StartNodeData extends BaseNodeData {
  nodeType: 'start'
  startTitle: string
  metadata: KVPair[]
}

export interface TaskNodeData extends BaseNodeData {
  nodeType: 'task'
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KVPair[]
}

export interface ApprovalNodeData extends BaseNodeData {
  nodeType: 'approval'
  title: string
  approverRole: 'Manager' | 'HRBP' | 'Director' | string
  autoApproveThreshold: number
}

export interface AutomatedNodeData extends BaseNodeData {
  nodeType: 'automated'
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData extends BaseNodeData {
  nodeType: 'end'
  endMessage: string
  showSummary: boolean
}

/** Master discriminated union — used everywhere. */
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

// ---------------------------------------------------------------------------
// Automation Actions (from GET /automations)
// ---------------------------------------------------------------------------

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

// ---------------------------------------------------------------------------
// Simulation Types
// ---------------------------------------------------------------------------

export interface SimulationStep {
  nodeId: string
  nodeType: NodeType
  label: string
  status: 'success' | 'pending' | 'error'
  duration: number
  message: string
  timestamp: number
  // Strategic Analytics Data
  metrics?: {
    dropOffRate: number // 0.0 to 1.0
    efficiencyScore: number // 0 to 100
    impactLevel: 'low' | 'medium' | 'high'
  }
}

export interface SimulationResult {
  steps: SimulationStep[]
  isValid: boolean
  errors: string[]
}

// ---------------------------------------------------------------------------
// Graph Validation
// ---------------------------------------------------------------------------

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  executionOrder: string[]
}

export interface ValidationError {
  nodeId?: string
  message: string
  type:
    | 'missing_start'
    | 'missing_end'
    | 'disconnected_node'
    | 'cycle_detected'
    | 'missing_connection'
}
