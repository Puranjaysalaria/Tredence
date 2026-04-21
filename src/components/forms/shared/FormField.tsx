// ============================================================================
// FormField — Reusable label + input wrapper + error message
// Used by all 5 node form components for consistent styling.
// ============================================================================

import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export const FormField = ({
  label,
  error,
  required,
  children,
}: FormFieldProps) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 animate-fadeInUp">{error}</p>
    )}
  </div>
)
