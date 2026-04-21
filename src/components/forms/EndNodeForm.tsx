// ============================================================================
// EndNodeForm — End message + showSummary toggle
// CRITICAL: showSummary MUST use the Toggle component, NOT checkbox.
// ============================================================================

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { FormField } from './shared/FormField'
import { Toggle } from './shared/Toggle'
import type { EndNodeData } from '@/types/workflow'

const schema = z.object({
  endMessage: z.string().optional().default(''),
  showSummary: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  nodeId: string
  data: EndNodeData
}

export const EndNodeForm = ({ nodeId, data }: Props) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)

  const { register, control, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      endMessage: data.endMessage,
      showSummary: data.showSummary,
    },
    mode: 'onChange',
  })

  // Debounced sync to canvas
  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData<EndNodeData>(nodeId, {
        ...watched,
        label: watched.endMessage || 'End',
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [JSON.stringify(watched)])

  return (
    <div className="space-y-4">
      <FormField label="End message">
        <input
          {...register('endMessage')}
          className="input-base"
          placeholder="e.g. Onboarding complete!"
        />
      </FormField>

      {/* MUST be Toggle switch — NOT checkbox — per spec */}
      <div className="flex items-center justify-between py-2">
        <div>
          <label className="text-xs font-medium text-gray-400">
            Show summary
          </label>
          <p className="text-[11px] text-gray-500">
            Display a summary report when workflow completes
          </p>
        </div>
        <Controller
          name="showSummary"
          control={control}
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  )
}
