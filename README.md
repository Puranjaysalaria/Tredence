# HR Workflow Designer — Tredence Studio Assessment

**AI Engineering Internship – 2025 Cohort Submission**

A production-quality HR Workflow Designer built to fulfill (and deeply extend) the Tredence Analytics Case Study requirements. Built with **React 18**, **TypeScript (strict)**, and **React Flow v11**, this module allows HR admins to visually design, configure, and simulate internal workflows like onboarding and document verification.

![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![React Flow](https://img.shields.io/badge/React%20Flow-v11-FF0072?logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-black?logo=react&logoColor=white)

---

## 🚀 Innovations & Design Standouts

The prompt mentioned: *"Improvements and innovations on this design reference is encouraged and incentivized."*

Here is how I went beyond the minimum requirements to build something premium:

1. **Premium Glassmorphism Aesthetic**: Completely overhauled the flat reference UI with a dark-mode `#0b0c10` radial gradient canvas, translucent `backdrop-blur` glass panels, and glowing active nodes to give it a modern SaaS feel.
2. **Complete TypeScript Safety via Zod & Discriminated Unions**: All Node/Form data strictly parsed & bounded. A 6th node type can't be added without the TypeScript compiler forcing implementation everywhere.
3. **Movable Glowing Arrows**: Edges aren't just lines; they are animated, glowing, and freely updatable (`onEdgeUpdate`) meaning you can just drag them around visually!
4. **Zundo Temporal Time Travel**: Added a full Undo/Redo stack for the canvas. 
5. **Dagre Auto-Layout Algorithm**: Implemented a directed acyclic graph layout engine; click "Auto Layout" to instantly organize a messy node canvas. 
6. **Real-time DAG Cyclical Validation**: The graph validates instantly as connections are made (showing red alert badges), backed by Kahn's Algorithm for topological sorting and DFS for cycle detection.
7. **Streaming Simulation Logs**: The Simulation panel staggered-streams execution logs visually with deliberate mock latency to feel like a real processing engine.

---

## Architecture

### 4-Layer Separation

The application follows a strict 4-layer architecture where each layer has a clear responsibility and well-defined boundaries:

| Layer | Responsibility | Key Files |
|-------|---------------|-----------|
| **Canvas Layer** | React Flow setup, drag-drop zone, edge rendering | `WorkflowCanvas.tsx`, `CanvasToolbar.tsx` |
| **Node Layer** | Visual representation of workflow steps | `BaseNode.tsx`, `StartNode.tsx`, `TaskNode.tsx`, etc. |
| **Form Layer** | Configuration UI for each node type | `NodeFormPanel.tsx`, `*Form.tsx`, shared components |
| **Data/API Layer** | State management, mock API, graph validation | `workflowStore.ts`, MSW handlers, `graphValidator.ts` |

**Boundary rules enforced:** Canvas logic never imports from forms/. API logic lives exclusively in hooks/ and mocks/. All types centralized in `types/workflow.ts`.

### Why Zustand Over Context

React Flow dispatches high-frequency node position updates during drag operations. With React Context, every state update triggers a re-render of **all consumers** in the tree — even those that don't use the changed value. This causes catastrophic performance degradation during drag operations.

Zustand's **selector pattern** solves this: each component subscribes to only the specific slice of state it needs. When a node is dragged, only the canvas re-renders — the form panel, sidebar, and sandbox panel are completely unaffected. This is the single most impactful architectural decision for canvas performance.

Additionally, Zustand integrates seamlessly with the **zundo** temporal middleware for undo/redo, without the complexity of wrapping the entire app in multiple context providers.

### Why react-hook-form + Zod

React Hook Form uses **uncontrolled inputs** under the hood. This means typing into a form field does NOT trigger a React re-render on every keystroke — the DOM input manages its own state. This is critical for canvas performance because:

1. A controlled input approach (useState) would re-render the form on every keystroke
2. Each form re-render could propagate to the parent, triggering a canvas re-render
3. On a canvas with 15+ nodes, this causes visible jitter

Zod provides **schema-based validation** that integrates via `zodResolver`, giving us type-safe validation without writing imperative validation logic. The schemas also serve as documentation for each node type's required fields.

### Why Discriminated Union for Node Data

```typescript
export type WorkflowNodeData =
  | StartNodeData      // nodeType: 'start'
  | TaskNodeData       // nodeType: 'task'
  | ApprovalNodeData   // nodeType: 'approval'
  | AutomatedNodeData  // nodeType: 'automated'
  | EndNodeData        // nodeType: 'end'
```

TypeScript's discriminated union pattern (discriminant: `nodeType`) enables **exhaustive switch checking**. If a 6th node type is added (e.g., `ConditionalNodeData`), every `switch` statement on `nodeType` will produce a **compile-time error** if the new case isn't handled. This makes the system impossible to extend incorrectly — the compiler catches missing cases.

### Why key={id} on NodeFormPanel

```tsx
<div key={id} className="... animate-slideInRight">
```

Without `key={id}`, switching between two nodes of the **same type** (e.g., Task → Task) does NOT remount the form component. React sees the same component type and reuses the existing DOM. This means old form values persist, breaking the UX. Keying by node ID forces React to fully unmount and remount, giving:
- Clean form state from `defaultValues`
- A fresh slide-in animation
- Correct data binding to the new node

### Why Debounced Sync (300ms)

Form values are synced to the Zustand store (and thus to the canvas node) with a 300ms debounce:

```typescript
useEffect(() => {
  const timer = setTimeout(() => updateNodeData(nodeId, watched), 300)
  return () => clearTimeout(timer)
}, [JSON.stringify(watched)])
```

Without debouncing, every keystroke in a form field would immediately update the store, causing React Flow to re-render the affected node. This creates visible text jitter on the canvas node while typing. The 300ms delay batches rapid keystrokes into a single update.

### Why Continuous Validation (useNodeValidation)

The `useNodeValidation` hook runs `validateWorkflow()` on every structural change (node added/removed, edge connected/disconnected). Validation errors are displayed as **red badges directly on the affected nodes** — not just shown when the user clicks "Run Simulation."

This provides **immediate visual feedback** as the user builds the workflow: adding a single Task node immediately shows it as disconnected, nudging the user to connect it. This is significantly better UX than batch validation.

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server (MSW starts automatically)
npm run dev
```

MSW (Mock Service Worker) starts automatically in development mode — no extra process or server needed. The mock API endpoints (`GET /api/automations`, `POST /api/simulate`) are intercepted by the service worker transparently.

> **Note:** If you see service worker registration errors on first load, run:
> ```bash
> npx msw init public/
> ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Design Decisions

### Dynamic Parameter Rendering (AutomatedNodeForm)

The Automated Step Node's action parameters are **rendered dynamically from the API response**, not hardcoded:

1. `GET /api/automations` returns a list of actions, each with a `params: string[]` array
2. When the user selects an action (e.g., "Send Email"), the form dynamically renders input fields for `to`, `subject`, `body`
3. Switching to "Update HRIS" re-renders with `employee_id`, `field`, `value`
4. Old parameter values are cleared when the action changes

This demonstrates real-world API-driven UI patterns where form fields are determined by backend configuration.

### Graph Algorithms

- **Cycle Detection**: DFS with recursion stack — O(V+E) time, O(V) space
- **Topological Sort**: Kahn's algorithm (BFS) — produces execution order for simulation
- **Validation**: 5 structural rules checked continuously (exactly one Start, exactly one End, no disconnected nodes, no cycles, Start has no incoming edges)

### Animation Strategy

All animations use **CSS keyframes only** — no animation libraries. This keeps the bundle size minimal and leverages GPU-accelerated CSS transforms:
- `slideInRight` — form panel entrance
- `fadeInUp` — form field/error appearance
- `stepReveal` — simulation step stagger (with `animation-delay`)
- `pulseRing` — selected node glow

### Dark Theme

The UI uses a dark color scheme matching Tredence's professional branding:
- App background: `#16181d` (very dark navy)
- Sidebar/toolbar: `#1e2128` (dark gray)
- Canvas: `#1a1d23` (dark, slightly blue)
- Accent color: `#F97316` (Tredence orange)
- Node cards: white cards floating on dark canvas for high contrast

### Auto-Layout (dagre)

The toolbar includes an auto-layout button that uses the **dagre** graph layout library. It applies a left-to-right hierarchical layout (`rankdir: 'LR'`) with appropriate node spacing. This is particularly useful after importing a workflow or as a quick way to organize a messy canvas.

---

## Project Structure

```
src/
  types/
    workflow.ts              ← All TypeScript interfaces (discriminated union)
  store/
    workflowStore.ts         ← Zustand store with temporal middleware
  components/
    canvas/
      WorkflowCanvas.tsx     ← React Flow setup, drag-drop handlers
      CanvasToolbar.tsx      ← Undo/redo/export/import/auto-layout
    nodes/
      index.ts               ← nodeTypes map for React Flow
      BaseNode.tsx            ← Shared wrapper for all node types
      StartNode.tsx
      TaskNode.tsx
      ApprovalNode.tsx
      AutomatedNode.tsx
      EndNode.tsx
    forms/
      NodeFormPanel.tsx       ← Switchboard: renders correct form
      StartNodeForm.tsx
      TaskNodeForm.tsx
      ApprovalNodeForm.tsx
      AutomatedNodeForm.tsx
      EndNodeForm.tsx
      shared/
        FormField.tsx         ← Reusable label + input + error wrapper
        KVPairField.tsx       ← Reusable key-value pair row
        Toggle.tsx            ← Custom toggle switch (not checkbox)
    sidebar/
      NodePalette.tsx         ← Draggable node type cards
      WorkflowTemplates.tsx   ← 3 preset workflow templates
    sandbox/
      SandboxPanel.tsx        ← Simulation runner + execution log
      SimulationStep.tsx      ← Single step row in the log
  hooks/
    useWorkflowStore.ts       ← Typed selector hooks
    useSimulate.ts            ← POST /simulate with streaming
    useAutomations.ts         ← GET /automations with caching
    useKVFields.ts            ← useFieldArray wrapper for KV pairs
    useNodeValidation.ts      ← Continuous graph validation
    useDragAndDrop.ts         ← Canvas drag-drop handlers
  mocks/
    handlers.ts               ← MSW request handlers
    browser.ts                ← MSW browser worker setup
    data/
      automations.ts          ← Mock automation actions
  utils/
    graphValidator.ts         ← validateWorkflow, hasCycle, topologicalSort
    nodeHelpers.ts            ← createNode factory, getNodeColor
    exportImport.ts           ← JSON export/import utilities
  App.tsx                     ← Root layout
  main.tsx                    ← Entry point (MSW bootstrap)
  index.css                   ← Global styles + animations
```

---

## Bonus Features Implemented

| # | Feature | Implementation |
|---|---------|---------------|
| 1 | **Export/Import JSON** | Toolbar buttons serialize/deserialize full workflow |
| 2 | **3 Workflow Templates** | Onboarding, Leave Approval, Document Verification |
| 3 | **Custom Presets** | Save your custom layouts into `localstorage` instantly |
| 4 | **Undo/Redo** | zundo temporal middleware (pastStates/futureStates) |
| 5 | **MiniMap + Zoom** | React Flow built-in Controls + MiniMap components |
| 6 | **Validation on Nodes** | Red error badges via continuous useNodeValidation |
| 7 | **Auto-Layout** | dagre library with LR hierarchical layout |
| 8 | **Free-Moving Edges** | Drag-n-drop connected arrows using React Flow `onEdgeUpdate` |

---

## What I'd Add With More Time

1. **Backend Persistence** — Node.js + PostgreSQL for saving/loading workflows, with optimistic UI updates
2. **Real-Time Collaboration** — Liveblocks or PartyKit for multi-user editing with conflict resolution
3. **Webhook Triggers** — Fire HTTP webhooks when a workflow step completes in production
4. **Audit Log** — Record all simulation runs with timestamps, user, and results
5. **Conditional/Decision Branch Node** — A 6th node type that routes to different paths based on conditions (the discriminated union pattern makes this trivial to add)
6. **Role-Based Access Control** — Only certain users can approve certain steps or modify certain workflows
7. **E2E Tests** — Playwright tests for drag-drop, form filling, simulation, and export/import flows
8. **Keyboard Shortcuts** — Ctrl+Z/Y for undo/redo, Ctrl+S for export, Delete for node removal

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Vite | Build tool & dev server |
| React 18 | UI framework |
| TypeScript (strict) | Type safety |
| React Flow v11 | Canvas & node rendering |
| Zustand + zundo | State management + undo/redo |
| react-hook-form + Zod | Form handling + validation |
| MSW v2 | Mock API (service worker) |
| Tailwind CSS v4 | Styling |
| dagre | Graph auto-layout |
| lucide-react | Icons |
