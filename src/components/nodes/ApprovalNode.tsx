import { CheckSquare } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { NodeProps } from 'reactflow'
import type { ApprovalNodeData } from '@/types/workflow'

export const ApprovalNode = ({ data, id, selected }: NodeProps<ApprovalNodeData>) => (
  <BaseNode
    data={data}
    id={id}
    selected={selected}
    accentColor="#BA7517"
    icon={<CheckSquare size={14} />}
    titleText={data.title || 'Approval'}
    subtitleText={data.approverRole || 'Role not set'}
  />
)
