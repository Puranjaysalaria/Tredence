// ============================================================================
// KVPairField — Reusable key-value pair row with remove button
// Used by StartNodeForm (metadata) and TaskNodeForm (customFields).
// ============================================================================

import type { UseFormRegister, FieldValues, Path } from 'react-hook-form'
import { X } from 'lucide-react'

interface KVPairFieldProps<T extends FieldValues> {
  index: number
  fieldId: string
  baseName: string
  register: UseFormRegister<T>
  onRemove: () => void
}

export const KVPairField = <T extends FieldValues>({
  index,
  fieldId,
  baseName,
  register,
  onRemove,
}: KVPairFieldProps<T>) => (
  <div
    key={fieldId}
    className="flex gap-2 mb-2 animate-fadeInUp items-center"
  >
    <input
      {...register(`${baseName}.${index}.key` as Path<T>)}
      placeholder="key"
      className="input-base flex-1 text-xs"
    />
    <input
      {...register(`${baseName}.${index}.value` as Path<T>)}
      placeholder="value"
      className="input-base flex-1 text-xs"
    />
    <button
      type="button"
      onClick={onRemove}
      className="text-gray-400 hover:text-red-400 transition-colors p-0.5 rounded hover:bg-red-50"
    >
      <X size={14} />
    </button>
  </div>
)
