# 📝 TaskFlow

TaskFlow is a modern, responsive, client-side task and workspace management web application built entirely with native web technologies. Designed for seamless productivity, TaskFlow offers an intuitive interface featuring a real-time analytics dashboard, interactive Kanban board with native drag-and-drop, dynamic calendar daily timeline, global multi-criteria search, and a keyboard-driven command palette.

The application operates entirely within the browser—utilizing browser APIs and `LocalStorage` for full data persistence without requiring any backend servers, databases, external frameworks, or npm dependencies.

---

## 📌 Overview

TaskFlow is a lightweight, high-performance task management solution built to demonstrate advanced client-side architecture and zero-dependency web development. Designed for professionals and individuals seeking a clean, fast workspace manager, TaskFlow allows users to organize tasks across customizable projects, track progress visually, and monitor productivity metrics in real time.

Key architectural highlights of TaskFlow:
- **100% Client-Side:** No backend server, no database installation, and zero external npm packages or framework overhead.
- **Local Data Persistence:** Workspace data, custom tasks, project assignments, and user preferences are saved locally via the `LocalStorage API`.
- **Robust Data Management:** Built-in JSON data export/import, data schema versioning, input normalization, and corrupted-data recovery mechanisms.
- **Zero External Dependencies:** Built strictly using modern vanilla HTML5, CSS3, and ES6+ JavaScript to maximize loading speed, accessibility, and cross-browser reliability.

---

## ✨ Features

### 📊 Dashboard & Productivity Analytics
- **Task Statistics:** Live metrics for total, completed, in-progress, and overdue tasks.
- **Completion Rate & Productivity Overview:** Calculated metrics displaying workflow efficiency.
- **Status & Priority Breakdowns:** Visual distributions showing task density across workflow stages and urgency levels.
- **Project Progress Tracker:** Dynamic calculation of completion percentages grouped by individual projects.
- **Upcoming Deadlines & Recent Activity:** Real-time chronological tracking of approaching due dates and workspace updates.

### 📝 Task & Workspace Management
- **Full Task Lifecycle (CRUD):** Create, view, edit, and delete tasks with instant UI updates.
- **Comprehensive Task Attributes:** Title, detailed descriptions, status, priority, project tags, and due dates.
- **Validation & Safety:** Client-side form validation and modal confirmation prompts to prevent accidental deletions.

### 📋 Interactive Kanban Board
- **5 Workflow Columns:** Backlog, Todo, In Progress, Review, and Done.
- **Native HTML5 Drag & Drop:** Move tasks between workflow columns effortlessly with smooth drag visual cues.
- **Column Task Counters:** Instant visual feedback on current work-in-progress (WIP) distribution.

### 📅 Dynamic Calendar & Daily Timeline
- **Interactive Calendar Navigation:** Dynamic month/year view with current date highlighted.
- **Active Date Selection:** Click any date to view assigned tasks and deadlines for that specific day.
- **Daily Task Timeline:** Chronological view of daily tasks for precise schedule management.
- **Direct Scheduling:** Create new tasks pre-assigned to the selected date directly from the calendar interface.

### 🔍 Global Search & Multi-Column Filtering
- **Real-Time Global Search:** Instant text-based searching across task titles and descriptions.
- **Multi-Criteria Filters:** Filter simultaneously by status, priority level, and project assignment.
- **Multi-Column Sorting:** Sort tasks dynamically by due date, priority, or creation date.
- **Selection & Bulk Views:** Multi-task highlighting and focused filtering modes.

### ⌨️ Command Palette
- **Keyboard-Driven Navigation:** Press `Ctrl + K` (or `Cmd + K`) to open a fast command interface.
- **Quick Actions:** Search tasks, create new items, switch views, or export workspace data using keyboard shortcuts.

### 💾 LocalStorage & Data Resilience
- **Automated Persistence:** Every task modification is committed to browser storage immediately.
- **Workspace Import & Export:** Backup workspace state to a JSON file or restore from a previous export.
- **Data Recovery & Schema Versioning:** Automatic structure validation, fallback normalization for corrupted data, and clean error handling.

### 📱 Responsive Design & Accessibility
- **Cross-Device Layout:** Fully responsive layout engineered with CSS Grid and Flexbox for mobile, tablet, and desktop viewports.
- **Keyboard Accessibility:** Full tab navigation, `Escape` key modal closure handling, backdrop click dismissals, and high-contrast UI elements.

---

## 🛠️ Technologies Used

### Frontend
- **HTML5:** Semantic document structure, form controls, and native drag-and-drop attributes.
- **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, responsive media queries, and smooth animations.
- **JavaScript (ES6+):** Modular event handling, dynamic DOM manipulation, array transformations, and async file operations.

### Browser APIs
- **DOM API:** Dynamic rendering and event delegation across modals, boards, and inputs.
- **LocalStorage API:** Client-side state persistence for workspace tasks, filters, and user settings.
- **HTML5 Drag & Drop API:** Native inter-column task moving on the Kanban board.
- **File API:** Client-side reading and writing of workspace backup files (`.json`).
- **SVG:** Vector icons used for UI controls and system status indicators.

### Development Tools
- **Visual Studio Code:** Primary IDE.
- **Git & GitHub:** Version control and source repository hosting.
- **Python HTTP Server / VS Code Live Server:** Local development servers.

> 💡 **Architecture Note:** TaskFlow has **no backend server**, **no database server**, **no external JS/CSS frameworks**, and **no npm dependencies**. All application state and analytics are processed client-side.

---

## 📂 Project Structure

```text
TaskFlow/
├── assets/
│   └── favicon.svg       # Application vector favicon
├── js/
│   └── statistics.js     # Dashboard metrics calculations and productivity algorithms
├── index.html            # Main single-page application document
├── style.css             # Application design system, layout grid, and responsive styles
├── script.js             # Core TaskFlow logic, state management, UI handlers, and LocalStorage engine
├── LICENSE               # Project license (MIT)
└── README.md             # Project documentation

## 🚀 Installation

### 1. Clone the repository
Clone the TaskFlow repository to your local machine:
```bash
git clone [https://github.com/YOUR_USERNAME/TaskFlow.git](https://github.com/YOUR_USERNAME/TaskFlow.git)
