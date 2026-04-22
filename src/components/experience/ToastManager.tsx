// ============================================================================
// ToastManager — Global in-app toast notifications
// Usage: window.dispatchEvent(new CustomEvent('show_toast', {
//   detail: { message: 'Saved!', type: 'success' | 'error' | 'info' | 'warning' }
// }))
// ============================================================================

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={15} />,
  error:   <XCircle size={15} />,
  info:    <Info size={15} />,
  warning: <AlertTriangle size={15} />,
}

const COLORS: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  error:   'border-red-500/30 bg-red-500/10 text-red-300',
  info:    'border-blue-500/30 bg-blue-500/10 text-blue-300',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
}

let _id = 0

export const ToastManager = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type = 'info' } = (e as CustomEvent).detail as { message: string; type?: ToastType }
      const id = ++_id
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }
    window.addEventListener('show_toast', handler)
    return () => window.removeEventListener('show_toast', handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-2 items-center pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-xl backdrop-blur-md text-sm font-semibold pointer-events-auto animate-slideUp ${COLORS[t.type]}`}
        >
          {ICONS[t.type]}
          <span>{t.message}</span>
          <button
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}

// Convenience helper — call from anywhere
export const showToast = (message: string, type: ToastType = 'info') => {
  window.dispatchEvent(new CustomEvent('show_toast', { detail: { message, type } }))
}
