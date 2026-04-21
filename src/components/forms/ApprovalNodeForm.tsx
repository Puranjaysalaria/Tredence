// ============================================================================
// ApprovalNodeForm — Title, approver role (SELECT), auto-approve threshold
// CRITICAL: approverRole MUST be a <select> dropdown as per spec.
// ============================================================================

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { FormField } from './shared/FormField'
import type { ApprovalNodeData } from '@/types/workflow'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  approverRole: z.string().min(1, 'Role is required'),
  autoApproveThreshold: z.coerce.number().min(0, 'Must be ≥ 0'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  nodeId: string
  data: ApprovalNodeData
}

export const ApprovalNodeForm = ({ nodeId, data }: Props) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      approverRole: data.approverRole || 'Manager',
      autoApproveThreshold: data.autoApproveThreshold,
    },
    mode: 'onChange',
  })

  // Debounced sync to canvas
  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData<ApprovalNodeData>(nodeId, {
        ...watched,
        label: watched.title || 'Approval',
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [JSON.stringify(watched)])

  return (
    <div className="space-y-4">
      <FormField label="Title" error={errors.title?.message} required>
        <input
          {...register('title')}
          className="input-base"
          placeholder="e.g. Manager Approval Required"
        />
      </FormField>

      {/* MUST be a <select> dropdown — spec requirement */}
      <FormField
        label="Approver role"
        error={errors.approverRole?.message}
        required
      >
        <select {...register('approverRole')} className="input-base">
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </FormField>

      <FormField
        label="Auto-approve threshold"
        error={errors.autoApproveThreshold?.message}
      >
        <input
          {...register('autoApproveThreshold')}
          type="number"
          min={0}
          className="input-base"
          placeholder="0"
        />
      </FormField>
    </div>
  )
}
