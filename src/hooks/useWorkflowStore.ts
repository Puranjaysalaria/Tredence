// ============================================================================
// useWorkflowStore — Typed selector hooks for consuming the Zustand store
// Provides ergonomic, tree-shakable access to store slices.
// ============================================================================

import { useStore } from 'zustand'
import { useWorkflowStore } from '@/store/workflowStore'
import type { TemporalState } from 'zundo'
import type { WorkflowState } from '@/store/workflowStore'

/**
 * Reactive hook into the temporal (undo/redo) store.
 */
export const useTemporalStore = <T,>(
  selector: (state: TemporalState<Partial<WorkflowState>>) => T
): T => useStore(useWorkflowStore.temporal, selector)
