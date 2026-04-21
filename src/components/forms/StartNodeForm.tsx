// ============================================================================
// StartNodeForm — Start title + metadata key-value pairs
// ============================================================================

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { FormField } from './shared/FormField'
import { KVPairField } from './shared/KVPairField'
import { Plus } from 'lucide-react'
import type { StartNodeData } from '@/types/workflow'

const schema = z.object({
  startTitle: z.string().min(1, 'Start title is required'),
  metadata: z.array(
    z.object({
      id: z.string(),
      key: z.string(),
      value: z.string(),
    })
  ),
})

type FormValues = z.infer<typeof schema>

interface Props {
  nodeId: string
  data: StartNodeData
}

export const StartNodeForm = ({ nodeId, data }: Props) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      startTitle: data.startTitle,
      metadata: data.metadata ?? [],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metadata',
  })

  // Debounced sync to canvas — prevents React Flow jitter during typing
  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData<StartNodeData>(nodeId, {
        ...watched,
        label: watched.startTitle || 'Start',
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [JSON.stringify(watched)])

  return (
    <div className="space-y-4">
      <FormField
        label="Start title"
        error={errors.startTitle?.message}
        required
      >
        <input
          {...register('startTitle')}
          className="input-base"
          placeholder="e.g. Employee Onboarding Begins"
        />
      </FormField>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-400">
            Metadata (optional)
          </label>
          <button
            type="button"
            onClick={() =>
              append({ id: crypto.randomUUID(), key: '', value: '' })
            }
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            <Plus size={12} /> Add field
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-xs text-gray-500 italic py-2">
            No metadata fields yet
          </p>
        )}

        {fields.map((field, i) => (
          <KVPairField<FormValues>
            key={field.id}
            index={i}
            fieldId={field.id}
            baseName="metadata"
            register={register}
            onRemove={() => remove(i)}
          />
        ))}
      </div>
    </div>
  )
}
