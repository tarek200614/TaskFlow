# 🚀 TaskFlow

> A modern task management application designed to organize, track, and manage tasks efficiently.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Open_App-2ea44f?style=for-the-badge)](YOUR_EXISTING_LIVE_DEMO_URL)

## 🌐 Live Demo

👉 **[Open TaskFlow Live Demo](https://taskflow-gamma-nine-50.vercel.app/)**

Explore the application directly in your browser without installing or configuring the project locally.

### Demo Features

- Task creation and management
- Task editing and deletion
- Status and priority management
- Search and filtering
- Dashboard statistics
- Responsive interface
- Interactive UI
- Persistent demo state

> **Note:** The live demo is intended for demonstration and evaluation. The complete source code remains available in this repository.

---

## 🌟 Key Features

- **Dark SaaS Interface**: Deep navy background (`#07111F`), dark surface cards (`#101F31`), and purple/violet gradient accent system (`#7C3AED` -> `#8B5CF6`).
- **Interactive Analytics Dashboard**:
  - Greeting header customized for **MEGHARI Abderrahmane Tarek**.
  - Dynamic KPI cards (Total Tasks, Completed, In Progress, Overdue).
  - Custom zero-dependency SVG Area Chart (Productivity Overview) and Status Donut Chart.
  - Dedicated 7-Column Calendar with active day highlight & today's event timeline.
  - Project Progress, Upcoming Deadlines, Priority Breakdown, and Activity Feed.
- **Kanban Board**: Native HTML5 Drag and Drop API (`draggable="true"`) for dragging task cards between workflow columns (`Backlog`, `Todo`, `In Progress`, `Review`, `Done`).
- **My Tasks View**: Data table view with multi-column sorting (Title, Status, Priority, Due Date), status/priority/project filtering, global search, and bulk selection.
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search and route switcher across tasks, projects, and views.
- **Quick Create Drawer (`C`)**: Modal for task creation with validation, including an optional task description field.
- **Task Descriptions**: Every task supports an optional, safely-escaped description field, editable from both the Create and Edit modals.
- **Workspace Data Persistence**: Seamless LocalStorage engine under `taskflow_data_v1` with JSON file export and backup importer.
- **Data Validation & Recovery**: A dedicated normalization layer repairs malformed or incomplete saved data (missing collections, invalid task fields, corrupted JSON) instead of crashing, and tells the user when a repair happened.
- **Storage Schema Versioning**: Persisted data carries a `schemaVersion` field with a lightweight migration hook for future schema changes.
- **Accessible Modals**: Every modal closes on `Escape` or on a click outside the modal card, and all form fields have properly associated `<label>` elements.
- **100% Responsive Layout**: Mobile touch drawer navigation, scaling seamlessly down to 320px screen width with zero horizontal overflow (verified from 320px through 1920px).

---

## 🛠️ Technology Stack

- **Frontend Core**: Vanilla HTML5, CSS3 Custom Properties, Modern JavaScript (ES6+)
- **Storage**: Browser LocalStorage
- **Design System**: Dark Navy Theme, Glassmorphism, CSS Grid & Flexbox, Custom SVG Icons
- **Dependencies**: 0 external libraries or npm packages (100% Native Web Standards)

---

## 🗂️ Project Structure

```
TaskFlow/
├── index.html          # App shell (sidebar, topbar, route container)
├── style.css            # Complete active design system (single stylesheet)
├── script.js             # App state, render engine, controller, storage & validation
├── js/
│   └── statistics.js     # Single source of truth for all statistics calculations
├── assets/
│   └── favicon.svg
├── LICENSE
└── README.md
```

Only the files above are loaded by `index.html` / referenced by the app. There is exactly one JavaScript statistics implementation (`js/statistics.js`) and one active stylesheet (`style.css`).

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser or serve locally using any static web server:

```bash
# Python simple HTTP server
python -m http.server 8000
```

Then visit `http://localhost:8000` in your web browser.

---

## 💾 How Data Is Stored

All workspace data (tasks, projects, activity, settings) lives in the browser's `localStorage` under the key `taskflow_data_v1`. On every load, the raw value is:

1. Parsed as JSON (a corrupted/unparseable value falls back to a fresh demo dataset).
2. Migrated if it was written by an older schema version.
3. Validated and repaired field-by-field — missing arrays are filled with safe defaults, malformed task/project objects are dropped, and any task pointing at a missing project is reattached to a valid one.

If a repair was necessary, a toast notification lets you know. If a `localStorage.setItem()` write ever fails (e.g. quota exceeded, private browsing restrictions), the app shows a toast instead of silently losing your changes.

Use **Settings → Workspace Data Backup** to export the full workspace to a JSON file, import a previous backup, or reset back to the demo dataset.

---

## ♿ Accessibility

- All Create/Edit task form fields have `<label for="...">` elements pointing at a matching input `id`.
- The profile avatar in the top bar is a real `<button>` with an `aria-label`, reachable and activatable via keyboard (`Tab` + `Enter`/`Space`).
- Modals can always be closed with `Escape` or by clicking outside the modal card.

---

## 🧪 Testing

There is no external test framework dependency — this stays a zero-dependency Vanilla JS project. Instead:

- `js/statistics.js` exposes `TaskFlowStats.runStatisticsTests()`, a self-contained assertion suite covering totals, completion rate, overdue detection (including the "completed but overdue date" edge case), project progress, status breakdowns, and upcoming deadlines.
- `script.js` exposes `window.runStatisticsTests()` (also wired to the dashboard's "Run Diagnostics" button), which runs the statistics suite plus data-normalization/recovery assertions and reports pass/fail to both the console and a toast.

Run it from the browser console at any time:

```js
runStatisticsTests();
```

---

## 📄 License

MIT License — Created by **MEGHARI Abderrahmane Tarek**.
