import { Flag } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { NodeProps } from 'reactflow'
import type { EndNodeData } from '@/types/workflow'

export const EndNode = ({ data, id, selected }: NodeProps<EndNodeData>) => (
  <BaseNode
    data={data}
    id={id}
    selected={selected}
    accentColor="#D85A30"
    icon={<Flag size={14} />}
    titleText={data.endMessage || 'End'}
    subtitleText={data.showSummary ? 'Summary enabled' : 'No summary'}
    showSourceHandle={false}
  />
)
