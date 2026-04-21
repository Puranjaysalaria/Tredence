// ============================================================================
// Node Types Map — Registered with React Flow
// Adding a new node type only requires: 1) component, 2) entry here
// ============================================================================

import { StartNode } from './StartNode'
import { TaskNode } from './TaskNode'
import { ApprovalNode } from './ApprovalNode'
import { AutomatedNode } from './AutomatedNode'
import { EndNode } from './EndNode'

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
}
