# 📋 TaskFlow — Task Management Web Application

<div align="center">

<h3>A Modern Task & Project Management Dashboard Built with Vanilla JavaScript</h3>

<p>
Clean • Responsive • Interactive • Dynamic • Zero Dependencies
</p>

<p>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-7C3AED?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Yes-22C55E?style=for-the-badge)

</p>

</div>

---

## 📖 About The Project

**TaskFlow** is a modern task and project management web application developed using **HTML5, CSS3 and Vanilla JavaScript**.

The application provides an interactive dashboard for managing tasks, monitoring productivity, organizing projects and visualizing progress through multiple views.

The project was designed to demonstrate practical frontend development skills including:

- Modern UI/UX design
- JavaScript application architecture
- DOM manipulation
- State management
- LocalStorage persistence
- Data validation and recovery
- Dynamic statistics
- Responsive web design
- Accessibility
- Interactive interfaces

The project uses **zero external libraries or frameworks**, relying entirely on native web technologies.

---

## ✨ Features

### 📊 Dashboard

- Dynamic task statistics
- Total tasks
- Completed tasks
- Tasks in progress
- Overdue tasks
- Completion rate
- Productivity overview
- Task status distribution
- Priority breakdown
- Project progress
- Upcoming deadlines
- Recent activity

### ✅ Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Task descriptions
- Task status
- Task priority
- Project assignment
- Due dates
- Task persistence
- Task validation

### 📋 Kanban Board

Interactive Kanban workflow with:

- Backlog
- Todo
- In Progress
- Review
- Done

Tasks can be moved between columns using the native **HTML5 Drag & Drop API**.

### 📅 Calendar

- Monthly calendar interface
- Dynamic dates
- Task due dates
- Active date selection
- Daily task timeline
- Task creation based on selected dates

### 📈 Statistics

Task statistics are calculated dynamically from the application data.

The application provides:

- Completion rate
- Status distribution
- Priority distribution
- Overdue task detection
- Project progress
- Upcoming deadlines
- Productivity information

### 🔎 Search & Filtering

- Global task search
- Status filtering
- Priority filtering
- Project filtering
- Multi-column sorting
- Task selection

### ⌨️ Command Palette

Quick navigation using:
---

# 📊 Application Overview

TaskFlow is organized around several interconnected views that allow users to manage their work efficiently.

## 🏠 Dashboard

The dashboard provides a centralized overview of the workspace.

It displays:

- Total number of tasks
- Completed tasks
- Tasks currently in progress
- Overdue tasks
- Completion rate
- Productivity overview
- Task status distribution
- Priority distribution
- Project progress
- Upcoming deadlines
- Recent activity

All statistics are calculated dynamically from the current application state.

---

## 📋 My Tasks

The **My Tasks** section provides a complete task management interface.

### Available operations

- Create a task
- Edit a task
- Delete a task
- Search tasks
- Filter tasks
- Sort tasks
- Select multiple tasks
- Change task status
- Change task priority
- Assign projects
- Set due dates
- Add task descriptions

### Sorting

Tasks can be sorted by:

- Title
- Status
- Priority
- Due Date

### Filtering

Available filters include:

- Status
- Priority
- Project

---

# 🗂️ Kanban Board

TaskFlow includes an interactive Kanban board for visual workflow management.

Tasks are organized into five workflow stages:

```text
Backlog
   ↓
Todo
   ↓
In Progress
   ↓
Review
   ↓
Done

```text
---

# 🧩 Application Architecture

TaskFlow follows a lightweight client-side architecture designed around a centralized application state and reusable rendering logic.

```text
                    ┌─────────────────────┐
                    │      User Input     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Event Handlers    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Application State │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │ Data Validation │         │   Statistics    │
        │ & Normalization │         │     Engine      │
        └────────┬────────┘         └────────┬────────┘
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    LocalStorage     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Render Engine    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         Dashboard          Kanban           Calendar
              │
              ▼
          My Tasks
---

