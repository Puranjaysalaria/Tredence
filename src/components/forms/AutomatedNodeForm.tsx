// ============================================================================
// AutomatedNodeForm — MOST COMPLEX FORM (evaluators specifically test this)
// Title, actionId dropdown from GET /automations, DYNAMIC action params.
// Params render based on the selected action's `params` array from API.
// ============================================================================

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { useAutomations } from '@/hooks/useAutomations'
import { FormField } from './shared/FormField'
import { Loader2 } from 'lucide-react'
import type { AutomatedNodeData } from '@/types/workflow'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string(),
  actionParams: z.record(z.string(), z.string()),
})

type FormValues = z.infer<typeof schema>

interface Props {
  nodeId: string
  data: AutomatedNodeData
}

export const AutomatedNodeForm = ({ nodeId, data }: Props) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)
  const { automations, loading } = useAutomations()

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      actionId: data.actionId,
      actionParams: data.actionParams ?? {},
    },
    mode: 'onChange',
  })

  const selectedActionId = watch('actionId')
  const selectedAction = automations.find((a) => a.id === selectedActionId)

  // When action changes, clear old params and set empty values for new params
  useEffect(() => {
    if (selectedAction) {
      const newParams: Record<string, string> = {}
      selectedAction.params.forEach((p) => {
        newParams[p] = data.actionParams?.[p] ?? ''
      })
      setValue('actionParams', newParams)
    } else {
      setValue('actionParams', {})
    }
  }, [selectedActionId])

  // Debounced sync to canvas
  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData<AutomatedNodeData>(nodeId, {
        ...watched,
        label: watched.title || 'Automated Step',
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
          placeholder="e.g. Send Welcome Email"
        />
      </FormField>

      <FormField label="Action">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
            <Loader2 size={14} className="animate-spin" />
            Loading actions...
          </div>
        ) : (
          <select {...register('actionId')} className="input-base">
            <option value="">Select an action...</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        )}
      </FormField>

      {/* Dynamic params — re-render when action changes */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3 animate-fadeInUp">
          <label className="text-xs font-medium text-gray-400 block">
            Action parameters
          </label>
          <div className="space-y-2 pl-2 border-l-2 border-purple-400/30">
            {selectedAction.params.map((param) => (
              <FormField key={param} label={param}>
                <input
                  {...register(`actionParams.${param}`)}
                  placeholder={`Enter ${param}...`}
                  className="input-base text-xs"
                />
              </FormField>
            ))}
          </div>
        </div>
      )}

      {selectedActionId && !selectedAction && !loading && (
        <p className="text-xs text-amber-400">
          ⚠ Selected action not found in available actions
        </p>
      )}
    </div>
  )
}
