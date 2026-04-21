import { Zap } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { NodeProps } from 'reactflow'
import type { AutomatedNodeData } from '@/types/workflow'

export const AutomatedNode = ({ data, id, selected }: NodeProps<AutomatedNodeData>) => (
  <BaseNode
    data={data}
    id={id}
    selected={selected}
    accentColor="#7F77DD"
    icon={<Zap size={14} />}
    titleText={data.title || 'Automated Step'}
    subtitleText={data.actionId || 'No action selected'}
  />
)
