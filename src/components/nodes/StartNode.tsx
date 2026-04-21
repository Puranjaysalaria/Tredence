import { Play } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { NodeProps } from 'reactflow'
import type { StartNodeData } from '@/types/workflow'

export const StartNode = ({ data, id, selected }: NodeProps<StartNodeData>) => (
  <BaseNode
    data={data}
    id={id}
    selected={selected}
    accentColor="#1D9E75"
    icon={<Play size={14} />}
    titleText={data.startTitle || 'Start'}
    subtitleText={`${data.metadata?.length ?? 0} metadata fields`}
    showTargetHandle={false}
  />
)
