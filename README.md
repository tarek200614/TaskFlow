## TASKFLOW

### PREMIUM SAAS TASK & PROJECT MANAGEMENT PLATFORM

A production-oriented task and project management application built from the ground up with **Vanilla HTML5, CSS3, and JavaScript (ES6+)** — with **zero external dependencies**.

<p align="center">
  <a href="#-features">FEATURES</a> •
  <a href="#-technology-stack">TECHNOLOGY</a> •
  <a href="#-architecture">ARCHITECTURE</a> •
  <a href="#-getting-started">GETTING STARTED</a> •
  <a href="#-data-persistence">PERSISTENCE</a> •
  <a href="#-testing--validation">TESTING</a> •
  <a href="#-roadmap">ROADMAP</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript ES6+">
  <img src="https://img.shields.io/badge/Dependencies-0-111827?style=flat-square" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/License-MIT-7C3AED?style=flat-square" alt="MIT License">
</p>

---

## 📌 OVERVIEW

**TaskFlow** is a modern, client-side task and project management application designed around a SaaS-style productivity workflow.

It combines a polished dark interface with practical productivity functionality, including:

- Interactive analytics dashboard
- Kanban workflow management
- Advanced task table
- Global command palette
- Quick task creation
- Local workspace persistence
- JSON backup and recovery
- Data validation and recovery
- Storage schema versioning
- Responsive mobile experience
- Built-in diagnostic testing

TaskFlow is intentionally implemented using the **native web platform**, without React, Vue, Angular, external UI libraries, or npm packages.

The project demonstrates how a feature-rich productivity interface can be engineered using **Vanilla HTML5, CSS3, and JavaScript (ES6+)** while maintaining a lightweight and inspectable architecture.

**Created & Developed by MEGHARI Abderrahmane Tarek**

---

## ✨ FEATURES

### 📊 Dashboard & Analytics

A centralized workspace dashboard providing a visual overview of project activity and productivity.

- Dynamic KPI cards
- Total, completed, in-progress, and overdue task metrics
- SVG productivity overview area chart
- SVG status donut chart
- Project progress tracking
- Priority breakdown
- Upcoming deadlines
- Activity feed
- Seven-column calendar
- Active-day highlighting
- Today's event timeline

### 📋 Task Management

A dedicated task-management interface designed for efficient organization, filtering, and navigation.

- Searchable task table
- Multi-column sorting
- Status filtering
- Priority filtering
- Project filtering
- Bulk task selection
- Task creation and editing
- Optional task descriptions
- Due-date management
- Project assignment

Backlog → Todo → In Progress → Review → Done

---

## 🗃️ KANBAN WORKFLOW

A native drag-and-drop workflow board powered by the HTML5 Drag & Drop API.

Tasks move through five workflow states:
```text
Backlog → Todo → In Progress → Review → Done
⌘ COMMAND PALETTE
```
A global navigation and search interface for quickly moving through the application.
```text
Platform	Shortcut
Windows / Linux	Ctrl + K
macOS	⌘ + K
```
The command palette provides access to tasks, projects, and application views.

---

## ➕ QUICK CREATE

Press C to open the task creation drawer.

Includes:

Input validation
Optional descriptions
Priority selection
Project assignment
Due-date management
💾 PERSISTENT WORKSPACE

TaskFlow persists workspace data locally using the browser's LocalStorage API.

Supported data includes:

Tasks
Projects
Activity
Workspace settings

The application also supports:

JSON workspace export
JSON backup import
Demo-data reset

---

## 🛡️ DATA VALIDATION & RECOVERY

TaskFlow includes a dedicated normalization and recovery layer designed to prevent malformed local data from crashing the application.

It handles:

Corrupted JSON
Missing collections
Invalid task fields
Invalid project fields
Malformed objects
Missing project references
Incomplete workspace data

When recovery is required, the application notifies the user.

---

## 🔄 STORAGE SCHEMA VERSIONING

Persisted workspace data contains a schemaVersion value.

A lightweight migration mechanism allows the application to evolve its storage format while maintaining compatibility with previously stored workspace data.

---

## 📱 RESPONSIVE EXPERIENCE

The interface is designed for a wide range of screen sizes, with responsive behavior verified from approximately 320px to 1920px.

The mobile experience includes:

Touch-friendly navigation
Responsive sidebar drawer
Adaptive cards
Responsive tables
Mobile-friendly task interactions
No intentional horizontal overflow

---

## ♿ ACCESSIBILITY

Implemented accessibility practices include:

Properly associated form labels
Keyboard-accessible controls
aria-label attributes where appropriate
Keyboard-accessible profile button
Escape-to-close modals
Click-outside modal closing

---

## 🛠️ TECHNOLOGY STACK
Technology	Purpose
HTML5	Semantic application structure
CSS3	Design system, responsive layouts, Grid, Flexbox, animations
JavaScript ES6+	Application logic, state, rendering, routing and interactions
LocalStorage API	Client-side workspace persistence
FileReader API	Local JSON backup importing
HTML5 Drag & Drop API	Kanban interactions
SVG	Zero-dependency charts and interface graphics
ZERO DEPENDENCIES

TaskFlow uses:

0 external libraries · 0 npm packages · 0 frameworks

Everything is implemented using native browser APIs and modern web standards.

---

## 🏗️ ARCHITECTURE
```text
TaskFlow/
├── assets/
│   └── favicon.svg      # Application vector favicon
├── js/
│   └── statistics.js    # Task and productivity statistics calculations & test suite
├── index.html           # Main single-page application interface and modals
├── style.css            # Complete design system, layouts, and responsive styles
├── script.js            # Core state engine, DOM controller, persistence, and event listeners
├── LICENSE              # MIT License
└── README.md            # Application documentation
TaskFlow follows a deliberately lightweight client-side architecture.

CORE FILES
File	Responsibility
index.html	## Application shell and interface structure
style.css	## Complete visual system and responsive styling
script.js	## Application state, rendering, controllers, storage and validation
js/statistics.js	## Centralized statistics calculations and diagnostic tests
assets/favicon.svg	## Application favicon
ARCHITECTURE PRINCIPLES

The project intentionally maintains:

1 active stylesheet
1 main application script
1 statistics module
0 external dependencies

This keeps the project easy to inspect, run, and understand while still supporting complex interactive functionality.
```
---

## 📸 SCREENSHOTS

Screenshots will be added as the project documentation is updated.
Planned views include:

Dashboard

Kanban Board

My Tasks

Analytics

Calendar

Responsive Mobile Interface

---

## 🚀 GETTING STARTED

TaskFlow requires no package manager, build system, or dependency installation.

1. CLONE THE REPOSITORY
git clone https://github.com/tarek200614/TaskFlow.git
cd TaskFlow
2. OPEN THE APPLICATION

Open the following file in a modern browser:

index.html
3. RUN WITH PYTHON

From the project directory:

python -m http.server 8000

Then visit:

http://localhost:8000
4. USE VS CODE

The project can also be launched with the Live Server extension for Visual Studio Code.

---

## 💾 DATA PERSISTENCE

TaskFlow stores its workspace locally under:

taskflow_data_v1
DATA LOADING PIPELINE

When the application loads, stored data goes through the following process:
```text
LocalStorage
     │
     ▼
JSON Parsing
     │
     ▼
Schema Check
     │
     ▼
Migration
     │
     ▼
Validation
     │
     ▼
Normalization
     │
     ▼
Recovered Workspace
```
The application:

Reads the stored LocalStorage value.
Parses it as JSON.
Recovers from corrupted data when necessary.
Checks schemaVersion.
Runs migration logic when required.
Validates workspace collections.
Validates task and project objects.
Repairs invalid project references.
Loads the normalized state.

If a repair is performed, the user receives a notification.

---

## BACKUP & RESTORE

Navigate to:

Settings → Workspace Data Backup

Available operations:

Export workspace as JSON
Import an existing JSON backup
Reset to the demo dataset

Storage failures, including localStorage.setItem() errors caused by browser restrictions or storage limits, are reported through the application UI.

---

## 🧪 TESTING & VALIDATION

TaskFlow does not currently use an external testing framework.

Instead, it includes a built-in assertion-based diagnostic system while maintaining its zero-dependency architecture.

STATISTICS TESTS

js/statistics.js exposes:

TaskFlowStats.runStatisticsTests();

The suite validates:

Task totals
Completion percentages
Overdue calculations
Project progress
Status breakdowns
Upcoming deadlines
Completed tasks with past due dates
Statistics edge cases
APPLICATION DIAGNOSTICS

script.js exposes:

window.runStatisticsTests();

This combines:

Statistics assertions
Data-normalization checks
Data-recovery assertions
RUN DIAGNOSTICS

Open the browser developer console and execute:

runStatisticsTests();

Results are reported through the console and application interface.

---

## 🧠 TECHNICAL LEARNING & ENGINEERING EXPERIENCE

TaskFlow provided hands-on experience across several areas of frontend engineering.

FRONTEND ARCHITECTURE
Single-page application architecture
State-driven rendering
Separation of application state and UI
Client-side routing
Custom design-system implementation
MODERN JAVASCRIPT
ES6+ syntax
Event delegation
Array transformation pipelines
State management
Modular architecture
Dynamic DOM rendering
NATIVE BROWSER APIS

Practical implementation of:

LocalStorage
FileReader
HTML5 Drag & Drop
SVG
Keyboard events
Browser storage APIs
DATA ENGINEERING & RESILIENCE
Data normalization
Schema versioning
Migration logic
Corrupted-data recovery
Defensive validation
Invalid-reference recovery
UI ENGINEERING
Responsive layouts
CSS Grid
Flexbox
Modal systems
Drawers
Command palettes
Data tables
Interactive charts
Mobile navigation
ZERO-DEPENDENCY DEVELOPMENT

The project demonstrates that complex productivity interfaces can be implemented using the native web platform without relying on external frameworks or component libraries.

---

## 🗺️ ROADMAP

The following capabilities are planned for future versions and are not currently implemented.

 Cloud synchronization through a REST API
 Progressive Web App support
 Service-worker-based offline functionality
 Advanced time tracking
 Productivity history and reporting
 Custom Kanban columns
 Custom tag colors
 Workspace themes
 Automated unit testing
 End-to-end testing with Playwright
 Testing with Vitest
 Backend architecture
 Multi-user workspaces
 Authentication and role-based permissions
 Cloud database
 Real-time synchronization

 ---
 
## 👨‍💻 AUTHOR

MEGHARI Abderrahmane Tarek

Junior Full Stack Developer & Computer Science Student

<p> <a href="https://github.com/tarek200614">GitHub</a> • <a href="https://www.linkedin.com/in/abderrahmane-tarek-meghari">LinkedIn</a> • <a href="meghariabderrhmanetarek@gmail.com">Email</a> </p>

---

## 📄 LICENSE

This project is licensed under the MIT License.

See the LICENSE file for the complete license text.

---

## ⭐ ACKNOWLEDGMENTS

MDN Web Docs — Technical documentation and references for JavaScript, LocalStorage, HTML5 Drag & Drop, SVG, and native browser APIs.
Native Web Platform — CSS Grid, Flexbox, CSS Custom Properties, HTML5 APIs, SVG, and other browser standards.
Open-Source Community — Inspiration from modern productivity applications and minimalist SaaS design.
<div align="center">
TASKFLOW

Built from the ground up with the native web platform.

If you find the project interesting, consider giving it a ⭐ on GitHub.

</div>
