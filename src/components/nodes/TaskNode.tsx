import { ClipboardList } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { NodeProps } from 'reactflow'
import type { TaskNodeData } from '@/types/workflow'

export const TaskNode = ({ data, id, selected }: NodeProps<TaskNodeData>) => (
  <BaseNode
    data={data}
    id={id}
    selected={selected}
    accentColor="#378ADD"
    icon={<ClipboardList size={14} />}
    titleText={data.title || 'Task'}
    subtitleText={data.assignee ? `Assigned: ${data.assignee}` : 'Unassigned'}
  />
)
