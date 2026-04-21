// ============================================================================
// TaskNodeForm — Title, description, assignee, due date, custom fields
// Most complex form with multiple field types + KV pair array.
// ============================================================================

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { FormField } from './shared/FormField'
import { KVPairField } from './shared/KVPairField'
import { Plus } from 'lucide-react'
import type { TaskNodeData } from '@/types/workflow'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  assignee: z.string().optional().default(''),
  dueDate: z.string().optional().default(''),
  customFields: z.array(
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
  data: TaskNodeData
}

export const TaskNodeForm = ({ nodeId, data }: Props) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      description: data.description,
      assignee: data.assignee,
      dueDate: data.dueDate,
      customFields: data.customFields ?? [],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customFields',
  })

  // Debounced sync to canvas
  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData<TaskNodeData>(nodeId, {
        ...watched,
        label: watched.title || 'Task',
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
          placeholder="e.g. Collect employee documents"
        />
      </FormField>

      <FormField label="Description">
        <textarea
          {...register('description')}
          className="input-base resize-none"
          rows={3}
          placeholder="Describe the task..."
        />
      </FormField>

      <FormField label="Assignee">
        <input
          {...register('assignee')}
          className="input-base"
          placeholder="e.g. John Doe"
        />
      </FormField>

      <FormField label="Due date">
        <input
          {...register('dueDate')}
          type="date"
          className="input-base"
        />
      </FormField>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-400">
            Custom fields (optional)
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
            No custom fields yet
          </p>
        )}

        {fields.map((field, i) => (
          <KVPairField<FormValues>
            key={field.id}
            index={i}
            fieldId={field.id}
            baseName="customFields"
            register={register}
            onRemove={() => remove(i)}
          />
        ))}
      </div>
    </div>
  )
}
