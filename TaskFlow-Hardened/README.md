<div align="center">
TaskFlow
Premium SaaS Task & Project Management Platform

A production-oriented task management experience built from the ground up with Vanilla HTML5, CSS3, and JavaScript (ES6+) — with zero external dependencies.

<p> <a href="#-features">Features</a> • <a href="#-technology-stack">Technology</a> • <a href="#-architecture">Architecture</a> • <a href="#-getting-started">Getting Started</a> • <a href="#-testing--validation">Testing</a> • <a href="#-roadmap">Roadmap</a> </p> <p> <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"> <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript ES6+"> <img src="https://img.shields.io/badge/Dependencies-0-111827?style=flat-square" alt="Zero Dependencies"> <img src="https://img.shields.io/badge/License-MIT-7C3AED?style=flat-square" alt="MIT License"> </p> </div>
📌 Overview

TaskFlow is a high-performance, client-side task and project management application designed around a modern SaaS workflow.

The project combines a polished dark interface with practical productivity functionality:

Interactive analytics dashboard
Kanban workflow management
Advanced task table
Global command palette
Local workspace persistence
JSON backup and recovery
Data validation and schema versioning
Responsive mobile experience
Built-in diagnostic testing

The application is intentionally implemented with native web technologies only, demonstrating how a sophisticated interface can be built without React, Vue, Angular, external UI libraries, or npm packages.

Created & Developed by MEGHARI Abderrahmane Tarek

✨ Features
📊 Dashboard & Analytics

A centralized workspace dashboard providing an overview of project activity and productivity.

Dynamic KPI cards
Total, completed, in-progress, and overdue task metrics
SVG productivity area chart
SVG status donut chart
Project progress tracking
Priority breakdown
Upcoming deadlines
Activity feed
Seven-column calendar
Today's event timeline
📋 Task Management

A dedicated task-management interface designed for fast organization and navigation.

Searchable task table
Multi-column sorting
Status filtering
Priority filtering
Project filtering
Bulk selection
Task creation and editing
Optional task descriptions
Due-date management
Project assignment
🗃️ Kanban Workflow

A native drag-and-drop workflow board powered by the HTML5 Drag & Drop API.

Tasks move through five workflow states:

Backlog → Todo → In Progress → Review → Done

⌘ Command Palette

A global navigation and search interface for quickly moving through the application.

Platform	Shortcut
Windows / Linux	Ctrl + K
macOS	⌘ + K

The command palette provides access to tasks, projects, and application views.

➕ Quick Create

Press C to open the task creation drawer.

Includes:

Input validation
Optional descriptions
Priority selection
Project assignment
Due-date management
💾 Persistent Workspace

Workspace data is persisted locally using the browser's LocalStorage API.

Supported data includes:

Tasks
Projects
Activity
Workspace settings

The application also supports:

JSON export
JSON import
Demo-data reset
🛡️ Data Validation & Recovery

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

🔄 Schema Versioning

Persisted workspace data contains a schemaVersion value.

A lightweight migration mechanism allows the application to evolve its storage format while maintaining compatibility with previously stored workspace data.

📱 Responsive Experience

The interface is designed for a wide range of screen sizes, with responsive behavior verified from approximately 320px to 1920px.

The mobile experience includes:

Touch-friendly navigation
Responsive sidebar drawer
Adaptive cards
Responsive tables
Mobile-friendly task interactions
No intentional horizontal overflow
♿ Accessibility

Implemented accessibility practices include:

Properly associated form labels
Keyboard-accessible controls
aria-label attributes where appropriate
Keyboard-accessible profile button
Escape-to-close modals
Click-outside modal closing
🛠️ Technology Stack
Technology	Purpose
HTML5	Semantic application structure
CSS3	Design system, responsive layouts, Grid, Flexbox, animations
JavaScript ES6+	Application logic, state, rendering, routing and interactions
LocalStorage API	Client-side workspace persistence
FileReader API	Local JSON backup importing
HTML5 Drag & Drop API	Kanban interactions
SVG	Zero-dependency charts and interface graphics
Zero Dependencies

TaskFlow uses:

0 external libraries · 0 npm packages · 0 frameworks

Everything is implemented using native browser APIs and modern web standards.

🏗️ Architecture

TaskFlow follows a deliberately lightweight client-side architecture.

TaskFlow/
├── index.html
├── style.css
├── script.js
├── js/
│   └── statistics.js
├── assets/
│   └── favicon.svg
├── LICENSE
└── README.md
Core Files
File	Responsibility
index.html	Application shell and interface structure
style.css	Complete visual system and responsive styling
script.js	Application state, rendering, controllers, storage and validation
js/statistics.js	Centralized statistics calculations and diagnostic tests
assets/favicon.svg	Application favicon
Architecture Principles

The project intentionally maintains:

1 active stylesheet
1 main application script
1 statistics module
0 external dependencies

This keeps the project easy to inspect, run, and understand while still supporting complex interactive functionality.

📸 Screenshots

Screenshots will be added as the project documentation is updated.

Planned views include:

Dashboard
Kanban Board
My Tasks
Analytics
Calendar
Mobile Responsive Interface
🚀 Getting Started

TaskFlow requires no package manager, build system, or dependency installation.

Option 1 — Open Directly

Open the following file in a modern browser:

index.html
Option 2 — Python HTTP Server

From the project directory:

python -m http.server 8000

Then visit:

http://localhost:8000
Option 3 — VS Code

The project can also be launched with the Live Server extension for Visual Studio Code.

💾 Data Persistence & Recovery

TaskFlow stores its workspace locally under:

taskflow_data_v1
Startup Pipeline

When the application loads, stored data goes through the following process:

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

Backup & Restore

Go to:

Settings → Workspace Data Backup

Available operations:

Export workspace as JSON
Import an existing JSON backup
Reset to the demo dataset

Storage failures, including localStorage.setItem() errors caused by browser restrictions or storage limits, are reported through the application UI.

🧪 Testing & Validation

TaskFlow does not currently use an external testing framework.

Instead, it includes a built-in assertion-based diagnostic system while maintaining its zero-dependency architecture.

Statistics Tests

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
Application Diagnostics

script.js exposes:

window.runStatisticsTests();

This combines:

Statistics assertions
Data-normalization checks
Data-recovery assertions
Run Diagnostics

Open the browser developer console and execute:

runStatisticsTests();

Results are reported through the console and application interface.

🧠 Technical Learning & Engineering Experience

TaskFlow provided hands-on experience across several areas of frontend engineering.

Frontend Architecture
Single-page application architecture
State-driven rendering
Separation of application state and UI
Client-side routing
Custom design-system implementation
Modern JavaScript
ES6+ syntax
Event delegation
Array transformation pipelines
State management
Modular architecture
Dynamic DOM rendering
Native Browser APIs

Practical implementation of:

LocalStorage
FileReader
HTML5 Drag & Drop
SVG
Keyboard events
Browser storage APIs
Data Engineering & Resilience
Data normalization
Schema versioning
Migration logic
Corrupted-data recovery
Defensive validation
Invalid-reference recovery
UI Engineering
Responsive layouts
CSS Grid
Flexbox
Modal systems
Drawers
Command palettes
Data tables
Interactive charts
Mobile navigation
Zero-Dependency Development

The project demonstrates that complex productivity interfaces can be implemented using the native web platform without relying on external frameworks or component libraries.

🗺️ Roadmap

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
👨‍💻 Author

MEGHARI Abderrahmane Tarek

Junior Full Stack Developer & Computer Science Student

<p> <a href="https://github.com/tarek200614">GitHub</a> • <a href="https://www.linkedin.com/in/tarek-meghari/">LinkedIn</a> • <a href="mailto:megharitarek06@gmail.com">Email</a> </p>
📄 License

This project is licensed under the MIT License.

See the LICENSE file for the complete license text.

⭐ Acknowledgments
MDN Web Docs — Technical documentation and references for JavaScript, LocalStorage, HTML5 Drag & Drop, SVG, and native browser APIs.
Native Web Platform — CSS Grid, Flexbox, CSS Custom Properties, HTML5 APIs, SVG, and other browser standards.
Open-Source Community — Inspiration from modern productivity applications and minimalist SaaS design.
<div align="center">
TaskFlow

Built from the ground up with the native web platform.

If you find the project interesting, consider giving it a ⭐ on GitHub.

</div>
