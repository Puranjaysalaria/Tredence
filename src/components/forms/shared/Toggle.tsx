// ============================================================================
// Toggle — Custom toggle switch component (NOT a checkbox)
// The case study EXPLICITLY requires a toggle switch for showSummary.
// ============================================================================

import clsx from 'clsx'

interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
}

export const Toggle = ({ checked, onChange }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={clsx(
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2',
      checked ? 'bg-orange-500' : 'bg-gray-200'
    )}
  >
    <span
      className={clsx(
        'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200',
        checked ? 'translate-x-6' : 'translate-x-1'
      )}
    />
  </button>
)
