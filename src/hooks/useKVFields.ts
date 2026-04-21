// ============================================================================
// useKVFields — Wraps useFieldArray for key-value pair logic
// Used by StartNodeForm (metadata) and TaskNodeForm (customFields).
// ============================================================================

import { useFieldArray } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface UseKVFieldsOptions<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
}

export const useKVFields = <T extends FieldValues>({
  control,
  name,
}: UseKVFieldsOptions<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  })

  const addPair = () => {
    append({
      id: crypto.randomUUID(),
      key: '',
      value: '',
    } as never)
  }

  return { fields, addPair, removePair: remove }
}
