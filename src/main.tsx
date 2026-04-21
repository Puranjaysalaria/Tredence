// ============================================================================
// main.tsx — Application entry point
// Starts MSW service worker in dev mode BEFORE rendering React.
// ============================================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

async function startApp() {
  // Start MSW in development — intercepts HTTP requests for mock API
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

startApp()
