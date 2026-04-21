// ============================================================================
// useWorkflowStore — Typed selector hooks for consuming the Zustand store
// Provides ergonomic, tree-shakable access to store slices.
// ============================================================================

import { useStore } from 'zustand'
import { useWorkflowStore } from '@/store/workflowStore'

/**
 * Reactive hook into the temporal (undo/redo) store.
 * Unlike `useWorkflowStore.temporal.getState()` which is a snapshot,
 * this hook triggers re-renders when the temporal state changes.
 */
export const useTemporalStore = <T,>(
  selector: (state: {
    pastStates: unknown[]
    futureStates: unknown[]
    undo: () => void
    redo: () => void
    clear: () => void
  }) => T
): T => useStore(useWorkflowStore.temporal as never, selector as never) as T
