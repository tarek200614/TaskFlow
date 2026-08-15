# TaskFlow — Premium Enterprise SaaS Task Management Platform

**TaskFlow** is a high-performance, commercial-grade SaaS task and project management web application built entirely with modern **Vanilla HTML5, CSS3, and JavaScript (ES6+)**.

It features a modern dark SaaS interface inspired by productivity platforms such as Linear, ClickUp, and Notion.

**Created & Developed by MEGHARI Abderrahmane Tarek — Owner & Lead Engineer**

---

## 🌟 Key Features

### 🎨 Premium SaaS Interface

* Dark navy SaaS interface
* Deep navy background (`#07111F`)
* Dark surface cards (`#101F31`)
* Purple/violet gradient accent system (`#7C3AED` → `#8B5CF6`)
* Glassmorphism-inspired UI components
* Custom CSS design system
* Responsive layouts using CSS Grid and Flexbox

### 📊 Interactive Analytics Dashboard

* Personalized greeting header
* Dynamic KPI cards:

  * Total Tasks
  * Completed
  * In Progress
  * Overdue
* Zero-dependency SVG Productivity Overview area chart
* SVG Status Donut Chart
* 7-column calendar
* Active-day highlighting
* Today's event timeline
* Project progress tracking
* Upcoming deadlines
* Priority breakdown
* Activity feed

### 📋 Kanban Board

TaskFlow includes a fully interactive Kanban board powered by the native **HTML5 Drag & Drop API**.

Tasks can be moved between:

* Backlog
* Todo
* In Progress
* Review
* Done

### ✅ My Tasks

A dedicated task-management interface featuring:

* Data-table view
* Multi-column sorting
* Global search
* Status filtering
* Priority filtering
* Project filtering
* Bulk task selection
* Task editing
* Task descriptions
* Due-date management

### ⌘ Global Command Palette

Quickly navigate through the application using:

* `Ctrl + K` on Windows/Linux
* `⌘ + K` on macOS

The command palette provides fast access to tasks, projects, and application views.

### ➕ Quick Task Creation

Press `C` to open the quick-create drawer.

Features include:

* Task creation
* Input validation
* Optional descriptions
* Priority selection
* Project assignment
* Due-date management

### 💾 Persistent Workspace

TaskFlow uses browser `LocalStorage` to persist workspace data.

The application supports:

* Persistent tasks
* Persistent projects
* Persistent activity data
* Workspace settings
* JSON workspace export
* JSON backup import
* Demo-data reset

### 🛡️ Data Validation & Recovery

TaskFlow contains a dedicated data-normalization and recovery layer.

It can:

* Detect corrupted JSON
* Restore missing collections
* Validate task fields
* Validate project fields
* Remove malformed objects
* Repair invalid project references
* Recover from incomplete workspace data
* Notify the user when automatic recovery occurs

### 🔄 Storage Schema Versioning

Persisted workspace data contains a `schemaVersion` field.

A lightweight migration mechanism is included to allow future schema changes without breaking existing user data.

### ♿ Accessibility

TaskFlow includes accessibility-oriented implementation details such as:

* Properly associated form labels
* Keyboard-accessible controls
* `aria-label` attributes where appropriate
* `Escape` key modal closing
* Click-outside modal closing
* Keyboard navigation support

### 📱 Responsive Design

The interface is designed to work across a wide range of screen sizes.

Responsive behavior has been verified from approximately:

**320px → 1920px**

The mobile interface includes:

* Touch-friendly navigation
* Responsive sidebar drawer
* Adaptive cards
* Responsive tables
* Mobile-friendly task interactions
* No intentional horizontal overflow

---

## 🛠️ Technology Stack

| Technology                | Usage                                                           |
| ------------------------- | --------------------------------------------------------------- |
| **HTML5**                 | Application structure and semantic markup                       |
| **CSS3**                  | Design system, responsive layouts, animations, Grid & Flexbox   |
| **JavaScript ES6+**       | Application logic, state management, rendering and interactions |
| **LocalStorage API**      | Client-side workspace persistence                               |
| **FileReader API**        | JSON backup importing                                           |
| **HTML5 Drag & Drop API** | Kanban task movement                                            |
| **SVG**                   | Charts and custom interface graphics                            |

### Dependencies

**0 external libraries or npm packages.**

TaskFlow is built entirely using native browser APIs and modern web standards.

---

## 🗂️ Project Structure

```text
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
```

### Main Files

* `index.html` — Application shell and interface structure
* `style.css` — Complete design system and responsive styling
* `script.js` — Application state, rendering, controllers, storage and validation
* `js/statistics.js` — Centralized statistics calculations and diagnostic tests
* `assets/favicon.svg` — Application favicon

The project intentionally maintains a minimal architecture with:

* **1 active stylesheet**
* **1 main application script**
* **1 statistics module**
* **0 external dependencies**

---

## 🚀 Getting Started

TaskFlow requires **no package manager, build system, or dependency installation**.

### 1. Clone the Repository

```bash
git clone https://github.com/tarek200614/TaskFlow.git
cd TaskFlow
```

### 2. Open the Application

You can simply open:

```text
index.html
```

in a modern web browser.

### 3. Run with Python

For a local development server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### 4. Using VS Code

The project can also be launched using the **Live Server** extension in Visual Studio Code.

---

## 📸 Screenshots

Screenshots will be added as the project documentation is updated.

The planned documentation will include:

* Dashboard
* Kanban Board
* My Tasks
* Analytics
* Calendar
* Responsive Mobile Interface

---

## 💾 How Data Is Stored

All workspace data is stored locally in the browser using `LocalStorage`.

The primary storage key is:

```text
taskflow_data_v1
```

When TaskFlow starts, the application performs a validation and recovery pipeline.

### Data Loading Process

1. Read the stored LocalStorage value.
2. Parse the value as JSON.
3. Recover from corrupted JSON when necessary.
4. Check the persisted `schemaVersion`.
5. Run migration logic when required.
6. Validate workspace collections.
7. Validate individual task and project objects.
8. Repair invalid project references.
9. Load the normalized workspace into the application.

If corrupted or incomplete data is detected, TaskFlow attempts to repair it instead of crashing.

A notification is displayed when an automatic repair is performed.

### Storage Errors

If a `localStorage.setItem()` operation fails because of browser restrictions, storage quotas, or private-browsing limitations, TaskFlow reports the problem to the user instead of silently ignoring it.

### Workspace Backup

Navigate to:

**Settings → Workspace Data Backup**

From there you can:

* Export the complete workspace as a JSON file
* Import an existing JSON backup
* Reset the workspace to the demo dataset

---

## 🧠 Learning Objectives

Developing TaskFlow provided practical experience with several important frontend software-engineering concepts.

### Frontend Architecture

* Single-page application architecture
* Application state management
* Separation of state and rendering
* Component-like UI patterns without frameworks
* Custom CSS design systems

### Modern JavaScript

* ES6+ syntax
* Event delegation
* Array transformation pipelines
* State management
* Modular JavaScript architecture
* Dynamic rendering
* Client-side routing

### DOM & UI Rendering

* Dynamic DOM generation
* View switching
* State-driven rendering
* Event handling
* Modal management
* Drawer interfaces
* Interactive UI components

### Native Browser APIs

TaskFlow demonstrates practical use of:

* `LocalStorage`
* `FileReader`
* HTML5 Drag & Drop
* SVG
* Keyboard events
* Browser storage APIs

### Data Validation & Resiliency

The project also focuses on reliable client-side data handling:

* Data normalization
* Schema versioning
* Corrupted-data recovery
* Defensive validation
* Fallback mechanisms
* Invalid-reference recovery

### Zero-Dependency Development

Complex application features were implemented without external frameworks or libraries, including:

* Kanban boards
* Command palettes
* Calendar interfaces
* Data tables
* Interactive charts
* Modal systems
* Responsive navigation
* Client-side persistence

---

## 🧪 Testing & Validation

TaskFlow intentionally avoids external testing frameworks in order to preserve its **zero-dependency architecture**.

Instead, the application contains a built-in assertion-based diagnostic suite.

### Statistics Tests

`js/statistics.js` exposes:

```js
TaskFlowStats.runStatisticsTests();
```

The test suite covers:

* Task totals
* Completion percentages
* Overdue calculations
* Project progress
* Status breakdowns
* Upcoming deadlines
* Completed tasks with past due dates
* Other statistics edge cases

### Application Diagnostics

`script.js` exposes:

```js
window.runStatisticsTests();
```

This runs:

* Statistics assertions
* Data-normalization assertions
* Data-recovery checks

Results are reported through the browser console and application interface.

### Run the Diagnostic Suite

Open the browser developer console and execute:

```js
runStatisticsTests();
```

No additional packages or testing frameworks are required.

---

## ♿ Accessibility

TaskFlow incorporates several accessibility-focused practices:

* Form inputs use properly associated `<label>` elements.
* Interactive controls are keyboard accessible where applicable.
* The profile avatar is implemented as a real `<button>`.
* Appropriate `aria-label` attributes are provided for icon-only controls.
* Modals can be closed with `Escape`.
* Modals can be closed by clicking outside the modal card.
* Responsive layouts are designed to remain usable on small screens.

---

## 🔮 Future Improvements

The following features are planned for future versions of TaskFlow.

### ☁️ Cloud Synchronization

Optional cloud synchronization across devices using a REST API backend.

### 📱 Progressive Web App

Potential PWA capabilities including:

* Service worker integration
* Offline functionality
* Installable desktop/mobile application
* Enhanced offline persistence

### ⏱️ Advanced Time Tracking

* Time estimates
* Active timers
* Logged work sessions
* Historical productivity tracking
* Productivity reports

### 🎨 Customizable Workspaces

* User-defined Kanban columns
* Custom tag colors
* Workspace-specific themes
* Additional customization options

### 🧪 Automated Testing

Potential integration of:

* Vitest
* Playwright
* Unit tests
* Integration tests
* End-to-end tests
* Automated CI testing

### 🔐 Backend & Multi-User Architecture

A future version could introduce:

* REST API backend
* User authentication
* Multi-user workspaces
* Cloud database
* Role-based permissions
* Real-time synchronization

---

## 👨‍💻 Author

**MEGHARI Abderrahmane Tarek**

**Junior Full Stack Developer & Computer Science Student**

* **GitHub:** [tarek200614](https://github.com/tarek200614)
* **LinkedIn:** [Abderrahmane Tarek MEGHARI](https://www.linkedin.com/in/tarek-meghari/)
* **Email:** [megharitarek06@gmail.com](mailto:megharitarek06@gmail.com)

---

## ⭐ Acknowledgments

* **MDN Web Docs** — Technical documentation and references for modern JavaScript, LocalStorage, HTML5 Drag & Drop, SVG, and native browser APIs.
* **Native Web Platform** — TaskFlow was built using standards including CSS Grid, CSS Flexbox, CSS Custom Properties, HTML5 APIs, and SVG.
* **Open-Source Community** — Inspiration from modern productivity platforms and minimalist SaaS interface design.

---

## 📄 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for the complete license text.

---

<div align="center">

### TaskFlow

**Built from the ground up with the native web platform.**

⭐ If you find this project interesting, consider giving it a star!

</div>

