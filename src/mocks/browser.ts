// ============================================================================
// MSW Browser Worker — Starts the service worker for dev-mode API mocking
// ============================================================================

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
