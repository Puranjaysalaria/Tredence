# 🌌 HR Workflow Designer — Enterprise AI Canvas

[![Live Demo](https://img.shields.io/badge/Live-Demo-blueviolet?style=for-the-badge&logo=render)](https://tredence-sjue.onrender.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **The Future of Recruitment Operations.** A high-performance, AI-driven workflow architect designed for modern HR teams to build, optimize, and simulate hiring pipelines with mathematical precision and professional design.

---

## 🚀 The Vision

Modern recruiting is complex. Traditional tools are static, slow, and disconnected from data. **HR Workflow Designer** changes that. It provides a dynamic, AI-assisted canvas where HR leaders can "code" their hiring processes without writing a single line of software. 

It bridges the gap between **Strategic Design** and **Operational Excellence.**

---

## ✨ Core Features

### 🧠 JD Intelligence (AI-Driven)
*   **Instant Parsing:** Paste any Job Description and watch the AI deconstruct it.
*   **Intent Awareness:** Automatically identifies required interviews, background checks, and offer stages.
*   **Smart Mapping:** Maps textual requirements to specific node types (Task, Approval, Automated).

### ⚡ Strategic Simulation Engine
*   **Virtual Execution:** Run a high-speed "Live Trace" of your workflow before deploying it.
*   **Real-time Analytics:** Generates **Efficiency Scores**, **Drop-off Rates**, and **Impact Levels** per stage.
*   **Bottleneck Detection:** Identifies where your hiring process might stall or fail.

### 📐 One-Click Layout Optimizer
*   **Mathematical Alignment:** Uses a deterministic coordinate mapping algorithm.
*   **Enterprise Discipline:** Instantly snaps messy, overlapping nodes into a perfectly straight horizontal line.
*   **Visual Balance:** Ensures your process documentation is boardroom-ready.

### 🔮 Premium Glassmorphism UI
*   **Aesthetic Excellence:** Built with a dark-mode "Glass" theme featuring translucent layers and blurs.
*   **Micro-Animations:** Smooth transitions, rotating icons, and reactive hover states for a premium feel.
*   **Responsive Canvas:** Fluid zoom, pan, and mini-map support for large-scale operations.

---

## 🏗️ Technical Architecture

### **1. Atomic Session Engine**
Traditional graph apps suffer from "ghosting"—stale UI states that cause bugs. This project implements an **Atomic Session Pattern**:
- Every major change increments a global `sessionId`.
- The `ReactFlow` engine is keyed by this ID.
- **Result:** 100% data integrity with perfect, zero-latency re-renders.

### **2. Discriminated Union State Management**
The entire data structure is built on strict TypeScript Discriminated Unions. 
- **Start Nodes** handle metadata.
- **Task Nodes** handle assignees.
- **Approval Nodes** handle thresholds.
This architecture prevents invalid data states and ensures that contextual sidebars always show the correct logic.

### **3. Local Analytics Logic**
The simulation engine doesn't just play an animation; it uses **Graph Traversal Algorithms** (DFS) to walk through the logic, calculating synthetic but strategically accurate performance metrics.

---

## 📂 Directory Structure

```bash
src/
├── components/
│   ├── canvas/          # React Flow core: Canvas, Toolbar, Node Types
│   ├── sidebar/         # Template Library & Navigation
│   ├── forms/           # Contextual forms for each node type (Discriminated Unions)
│   ├── copilot/         # AI Assistant panel & context awareness
│   └── experience/      # Shared UX: Modals, Toasts, Status Bars
├── store/
│   └── workflowStore.ts # Centralized Zustand state with Atomic Session logic
├── hooks/
│   ├── useSimulate.ts   # Virtual Simulation Engine (Strategy & Metrics)
│   ├── useHistory.ts    # Undo/Redo logic for canvas actions
├── types/
│   └── workflow.ts      # Strict TypeScript interfaces
└── utils/
    ├── graphValidator.ts# Cycle detection & logical path validation
    └── layoutEngine.ts  # Fixed-coordinate alignment logic
```

---

## 🛠️ Tech Stack
- **Frontend:** React 18 (Vite)
- **Canvas:** React Flow
- **State:** Zustand (Immutable Store)
- **Styling:** Tailwind CSS (Modern Glassmorphism)
- **Icons:** Lucide React
- **Validation:** Custom Graph Algorithms

---

## 🚀 Getting Started

1. **Clone the repository**
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Start Development**
   ```bash
   npm run dev
   ```
4. **Production Build**
   ```bash
   npm run build
   ```

---

## 🗺️ Future Roadmap
- [ ] **Collaborative Editing:** Real-time multi-user canvas presence.
- [ ] **Live API Integration:** Connect nodes to real Workday or Lever instances.
- [ ] **Export to PDF/JSON:** Boardroom-ready process documentation exports.
- [ ] **Advanced A/B Testing:** Simulate two different workflows to compare efficiency.

---

## 🌐 Live Deployment
Explore the live enterprise demo:  
👉 **[tredence-sjue.onrender.com](https://tredence-sjue.onrender.com)**

---

*Developed by the Antigravity Team for the next generation of Talent Acquisition.*
