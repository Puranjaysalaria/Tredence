// ============================================================================
// useAutomations — Fetches available automation actions from GET /automations
// Uses module-level cache to avoid redundant API calls.
// ============================================================================

import { useState, useEffect } from 'react'
import type { AutomationAction } from '@/types/workflow'

/** Module-level cache — shared across all component instances. */
let cache: AutomationAction[] | null = null

export const useAutomations = () => {
  const [automations, setAutomations] = useState<AutomationAction[]>(
    cache ?? []
  )
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cache) return

    let cancelled = false

    fetch('/api/automations')
      .then((r) => r.json())
      .then((data: AutomationAction[]) => {
        if (cancelled) return
        cache = data
        setAutomations(data)
        setLoading(false)
      })
      .catch((e: Error) => {
        if (cancelled) return
        setError(e.message)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { automations, loading, error }
}
