/**
 * TASKFLOW - Premium Enterprise SaaS Task Engine & Analytics System
 * Designed & Engineered for MEGHARI Abderrahmane Tarek (Owner)
 * 100% Dynamic Single-Source-of-Truth Data & Statistics Engine
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONSTANTS & STORAGE CONFIGURATION
  // ==========================================================================
  const STORAGE_KEY = 'taskflow_data_v1';
  const APP_VERSION = '1.1.0';
  // Schema version for the *shape* of the persisted object (separate from APP_VERSION,
  // which is a human-facing release number). Bump this and add a step in migrateSchema()
  // whenever a future change requires transforming older persisted data.
  const CURRENT_SCHEMA_VERSION = 1;

  const USER_IDENTITY = {
    id: 'u1',
    name: 'MEGHARI Abderrahmane Tarek',
    email: 'tarek@taskflow.dev',
    role: 'Owner',
    avatar: 'MA',
    timezone: 'UTC+01:00'
  };

  const STATUSES = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];
  const PRIORITIES = ['Urgent', 'High', 'Medium', 'Low', 'No Priority'];

  function formatDateOffset(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  // Guarantees a fresh, collision-free task ID even after tasks have been
  // deleted (a plain `TASK-${100 + tasks.length + 1}` counter can collide once
  // items are removed, e.g. create 3, delete 1, create another -> duplicate ID).
  function generateUniqueTaskId() {
    const existingIds = new Set(AppState.data.tasks.map(t => t.id));
    let n = AppState.data.tasks.length + 101;
    let candidate = 'TASK-' + n;
    while (existingIds.has(candidate)) {
      n++;
      candidate = 'TASK-' + n;
    }
    return candidate;
  }

  // Hoisted function declaration (not a `window.x = function(){}` expression) so it
  // is safely callable from anywhere in this file, including during the very first
  // synchronous load of AppState/TaskFlowStore below, before the rest of the file
  // (where it also gets exposed as window.showToast) has finished executing.
  function showToast(message, type = 'info') {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const root = document.getElementById('toast-root');
    if (!root) return;

    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.style.cssText = `
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      border-left: 4px solid ${type === 'success' ? '#10B981' : type === 'error' || type === 'warning' ? '#EF4444' : '#8B5CF6'};
    `;
    toast.textContent = message;

    root.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // ==========================================================================
  // 2. STATISTICS MODULE (single source of truth)
  // ==========================================================================
  // TaskFlowStats is defined once, in js/statistics.js, which loads before this
  // file (see index.html). We consume that instance here rather than redefining
  // it, so there is exactly one TaskFlowStats implementation at runtime.
  const TaskFlowStats = window.TaskFlowStats;

  if (!TaskFlowStats) {
    // js/statistics.js failed to load (missing file, blocked request, etc).
    // Fail loudly in the console instead of silently producing wrong stats.
    console.error('[TaskFlow] Critical: js/statistics.js did not load. Statistics and task normalization are unavailable.');
  }

  // ==========================================================================
  // 3. DEMO DATA SEEDER
  // ==========================================================================
  function generateDemoData() {
    return {
      version: APP_VERSION,
      currentUser: USER_IDENTITY,
      users: [USER_IDENTITY],
      projects: [
        { id: 'p1', name: 'TaskFlow Core App', description: 'Enterprise SaaS task management platform', color: '#8B5CF6', status: 'Active', defaultProgress: 75, deadline: formatDateOffset(14), manager: USER_IDENTITY.id },
        { id: 'p2', name: 'Design System v2.0', description: 'Unified UI component library & tokens', color: '#F59E0B', status: 'Active', defaultProgress: 60, deadline: formatDateOffset(5), manager: USER_IDENTITY.id },
        { id: 'p3', name: 'Marketing Website', description: 'Product landing pages & documentation', color: '#10B981', status: 'Planning', defaultProgress: 30, deadline: formatDateOffset(30), manager: USER_IDENTITY.id },
        { id: 'p4', name: 'Infrastructure & Security', description: 'Performance optimization and security audit', color: '#EF4444', status: 'Active', defaultProgress: 50, deadline: formatDateOffset(20), manager: USER_IDENTITY.id }
      ],
      tasks: [
        { id: 'TASK-101', title: 'Implement HTML5 Drag-and-Drop Kanban', description: 'Allow tasks to be smoothly dragged between column statuses.', status: 'Done', priority: 'Urgent', projectId: 'p1', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(-1), completedAt: formatDateOffset(-1), subtasks: [], comments: [], isStarred: true, isArchived: false, createdAt: formatDateOffset(-5) },
        { id: 'TASK-102', title: 'Design Glassmorphism Theme Architecture', description: 'Create CSS custom properties for dark navy theme.', status: 'Done', priority: 'High', projectId: 'p2', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(-2), completedAt: formatDateOffset(-2), subtasks: [], comments: [], isStarred: true, isArchived: false, createdAt: formatDateOffset(-6) },
        { id: 'TASK-103', title: 'Global Command Palette (⌘K)', description: 'Quick search modal allowing instant navigation.', status: 'In Progress', priority: 'Urgent', projectId: 'p1', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(0), completedAt: null, subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(-3) },
        { id: 'TASK-104', title: 'SVG Productivity Analytics Charts', description: 'Zero-dependency custom SVG donut and area graphs.', status: 'In Progress', priority: 'High', projectId: 'p1', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(1), completedAt: null, subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(-2) },
        { id: 'TASK-105', title: 'Calendar Month View Navigation', description: 'Interactive calendar view displaying deadline pills.', status: 'Review', priority: 'Medium', projectId: 'p1', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(2), completedAt: null, subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(-4) },
        { id: 'TASK-106', title: 'Mobile Responsive Drawer & Navigation', description: 'Ensure seamless layout scaling down to 320px screen width.', status: 'Todo', priority: 'High', projectId: 'p2', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(3), completedAt: null, subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(-1) },
        { id: 'TASK-107', title: 'JSON Data Import & Backup Exporter', description: 'Allow users to back up their entire workspace data.', status: 'Todo', priority: 'Medium', projectId: 'p4', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(5), completedAt: null, subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(0) },
        { id: 'TASK-108', title: 'Security Audit & Input Sanitization', description: 'Verify user inputs are sanitized before DOM injection.', status: 'Backlog', priority: 'Low', projectId: 'p4', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(7), completedAt: null, subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(0) },
        { id: 'TASK-109', title: 'Setup Mobile Push Notifications API', description: 'Investigate Web Push API integration.', status: 'Backlog', priority: 'Low', projectId: 'p3', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(10), completedAt: null, subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(0) },
        { id: 'TASK-110', title: 'Refactor LocalStorage Engine Wrappers', description: 'Centralize storage reads/writes into single helper module.', status: 'Done', priority: 'Medium', projectId: 'p1', assigneeId: USER_IDENTITY.id, dueDate: formatDateOffset(-3), completedAt: formatDateOffset(-3), subtasks: [], comments: [], isStarred: false, isArchived: false, createdAt: formatDateOffset(-7) }
      ],
      notifications: [
        { id: 'n1', title: 'Task Completed', message: 'TASK-101 "Implement HTML5 Drag-and-Drop" was marked Done.', time: '10m ago', read: false },
        { id: 'n2', title: 'New Comment', message: 'MEGHARI Abderrahmane Tarek commented on TASK-101.', time: '1h ago', read: false }
      ],
      activities: [
        { id: 'a1', userName: USER_IDENTITY.name, userAvatar: USER_IDENTITY.avatar, text: 'moved TASK-101 to Done', time: '10m ago' },
        { id: 'a2', userName: USER_IDENTITY.name, userAvatar: USER_IDENTITY.avatar, text: 'commented on TASK-101', time: '1h ago' }
      ],
      settings: {
        theme: 'dark',
        compactMode: false,
        productivityPeriod: 'last-7-days'
      },
      schemaVersion: CURRENT_SCHEMA_VERSION
    };
  }

  // ==========================================================================
  // 3B. DATA VALIDATION, NORMALIZATION & SCHEMA MIGRATION
  // ==========================================================================
  // Guards against the real failure mode this hardening pass targets: a value
  // that is valid JSON (so JSON.parse succeeds) but has an invalid/incomplete
  // *schema* (e.g. `{ tasks: [] }` with no `projects` array, or a task missing
  // required fields). Nothing below ever throws; malformed pieces are dropped
  // or defaulted, valid pieces are preserved, and the caller is told whether a
  // recovery happened so it can inform the user instead of failing silently.

  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  function normalizeProject(raw) {
    if (!isPlainObject(raw)) return null;
    if (typeof raw.id !== 'string' || !raw.id.trim()) return null;
    return {
      id: raw.id,
      name: typeof raw.name === 'string' && raw.name.trim() ? raw.name : 'Untitled Project',
      description: typeof raw.description === 'string' ? raw.description : '',
      color: typeof raw.color === 'string' ? raw.color : '#8B5CF6',
      status: typeof raw.status === 'string' ? raw.status : 'Active',
      defaultProgress: typeof raw.defaultProgress === 'number' && raw.defaultProgress >= 0 && raw.defaultProgress <= 100 ? raw.defaultProgress : 0,
      deadline: typeof raw.deadline === 'string' ? raw.deadline : null,
      manager: typeof raw.manager === 'string' ? raw.manager : USER_IDENTITY.id
    };
  }

  function normalizeTask(raw, index) {
    if (!isPlainObject(raw)) return null;

    const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id : `TASK-RECOVERED-${index + 1}`;
    const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title : 'Untitled Task';
    const status = typeof raw.status === 'string' && STATUSES.includes(raw.status) ? raw.status : 'Todo';
    const priority = typeof raw.priority === 'string' && PRIORITIES.includes(raw.priority) ? raw.priority : 'Medium';
    // Tolerate an older/alternate `project` field name in addition to `projectId`.
    const projectId = typeof raw.projectId === 'string' ? raw.projectId : (typeof raw.project === 'string' ? raw.project : null);
    const dueDate = typeof raw.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.dueDate) ? raw.dueDate : null;

    return {
      id,
      title,
      description: typeof raw.description === 'string' ? raw.description : '',
      status,
      priority,
      projectId,
      assigneeId: typeof raw.assigneeId === 'string' ? raw.assigneeId : USER_IDENTITY.id,
      dueDate,
      completedAt: typeof raw.completedAt === 'string' ? raw.completedAt : null,
      subtasks: Array.isArray(raw.subtasks) ? raw.subtasks : [],
      comments: Array.isArray(raw.comments) ? raw.comments : [],
      isStarred: !!raw.isStarred,
      isArchived: !!raw.isArchived,
      createdAt: typeof raw.createdAt === 'string' && raw.createdAt ? raw.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString()
    };
  }

  /**
   * Validate + repair a persisted (or imported) data object.
   * Never throws. Returns a well-formed data object plus a `_recovered` flag
   * indicating whether anything had to be defaulted or dropped.
   */
  function normalizeAppData(raw) {
    const source = isPlainObject(raw) ? raw : {};
    let recovered = !isPlainObject(raw);

    const rawProjects = Array.isArray(source.projects) ? source.projects : [];
    if (!Array.isArray(source.projects)) recovered = true;
    let projects = rawProjects.map(normalizeProject).filter(Boolean);
    if (projects.length !== rawProjects.length) recovered = true;

    if (projects.length === 0) {
      // No usable projects survived validation; give tasks somewhere safe to live
      // instead of crashing on `projects[0]` lookups elsewhere in the app.
      projects = [{
        id: 'p-recovered', name: 'General', description: 'Recovered project bucket',
        color: '#8B5CF6', status: 'Active', defaultProgress: 0, deadline: null, manager: USER_IDENTITY.id
      }];
      recovered = true;
    }
    const projectIds = new Set(projects.map(p => p.id));

    const rawTasks = Array.isArray(source.tasks) ? source.tasks : [];
    if (!Array.isArray(source.tasks)) recovered = true;
    const tasks = rawTasks.map(normalizeTask).filter(Boolean);
    if (tasks.length !== rawTasks.length) recovered = true;

    tasks.forEach(t => {
      if (!t.projectId || !projectIds.has(t.projectId)) {
        t.projectId = projects[0].id;
        recovered = true;
      }
    });

    const users = Array.isArray(source.users) && source.users.length ? source.users : [USER_IDENTITY];
    if (!Array.isArray(source.users) || !source.users.length) recovered = true;

    const activities = Array.isArray(source.activities) ? source.activities : [];
    if (!Array.isArray(source.activities)) recovered = true;

    const notifications = Array.isArray(source.notifications) ? source.notifications : [];
    if (!Array.isArray(source.notifications)) recovered = true;

    const settings = isPlainObject(source.settings) ? {
      theme: source.settings.theme === 'light' ? 'light' : 'dark',
      compactMode: !!source.settings.compactMode,
      productivityPeriod: typeof source.settings.productivityPeriod === 'string' ? source.settings.productivityPeriod : 'last-7-days'
    } : { theme: 'dark', compactMode: false, productivityPeriod: 'last-7-days' };
    if (!isPlainObject(source.settings)) recovered = true;

    return {
      version: typeof source.version === 'string' ? source.version : APP_VERSION,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      currentUser: USER_IDENTITY,
      users,
      projects,
      tasks,
      notifications,
      activities,
      settings,
      _recovered: recovered
    };
  }

  /**
   * Lightweight schema migration. Persisted data older than CURRENT_SCHEMA_VERSION
   * (or with no schemaVersion at all, i.e. pre-versioning) is upgraded step by step.
   * There are no structural changes yet between the original unversioned shape and
   * v1 — normalizeAppData already tolerates the unversioned shape directly — so this
   * is currently a no-op passthrough. Add `if (version < N) { ...transform... }`
   * steps here as the schema evolves, so future versions don't have to touch
   * normalizeAppData's validation logic.
   */
  function migrateSchema(raw) {
    if (!isPlainObject(raw)) return raw;
    const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 0;
    if (version >= CURRENT_SCHEMA_VERSION) return raw;
    // No transformations required for v0 -> v1.
    return raw;
  }

  // ==========================================================================
  // 4. STORAGE ENGINE
  // ==========================================================================
  const TaskFlowStore = {
    getData: function () {
      try {
        if (typeof localStorage === 'undefined') return generateDemoData();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          const initial = generateDemoData();
          this.saveData(initial);
          return initial;
        }

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (parseErr) {
          // Valid-JSON assumption failed outright (corrupted/truncated string).
          console.error('[TaskFlow] Corrupted localStorage JSON, recovering with demo data:', parseErr);
          const demo = generateDemoData();
          this.saveData(demo);
          showToast('Your saved data was corrupted and could not be read. It has been reset to demo data.', 'error');
          return demo;
        }

        const migrated = migrateSchema(parsed);
        const normalized = normalizeAppData(migrated);
        const wasRecovered = normalized._recovered;
        delete normalized._recovered;

        if (wasRecovered) {
          // The JSON parsed fine but the schema was invalid/incomplete (e.g. a
          // missing `projects` array, or task objects with missing fields).
          // Persist the repaired version so we don't silently destroy whatever
          // valid data survived, and don't keep re-recovering on every load.
          this.saveData(normalized);
          showToast('Some saved data was incomplete or invalid and has been safely repaired.', 'warning');
        }

        return normalized;
      } catch (err) {
        console.error('[TaskFlow] Storage Read Error:', err);
        showToast('Unable to load your saved data. Starting from a fresh demo workspace.', 'error');
        return generateDemoData();
      }
    },
    saveData: function (data) {
      if (typeof localStorage === 'undefined') return false;
      data.currentUser = USER_IDENTITY;
      data.schemaVersion = CURRENT_SCHEMA_VERSION;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (err) {
        // Do NOT pretend the save succeeded (e.g. storage quota exceeded, private
        // browsing restrictions). Log the technical detail, show a plain-language
        // toast, and let the app keep running with the in-memory copy of the data.
        console.error('[TaskFlow] Storage Write Error:', err);
        showToast('Unable to save your changes locally. Please check available browser storage and try again.', 'error');
        return false;
      }
    },
    resetData: function () {
      const demo = generateDemoData();
      this.saveData(demo);
      return demo;
    }
  };

  // ==========================================================================
  // 5. APPLICATION STATE
  // ==========================================================================
  const todayISO = new Date().toISOString().split('T')[0];

  const AppState = {
    data: TaskFlowStore.getData(),
    currentView: 'dashboard',
    selectedTaskIds: new Set(),
    activeFilterStatus: 'all',
    activeFilterPriority: 'all',
    activeFilterProject: 'all',
    searchQuery: '',
    sortColumn: 'dueDate',
    sortOrder: 'asc',
    currentCalendarDate: new Date(),
    selectedCalendarDate: todayISO,
    activeTaskId: null,
    productivityPeriod: 'last-7-days',

    save: function () {
      TaskFlowStore.saveData(this.data);
      this.render();
    },

    render: function () {
      RenderEngine.renderActiveView();
    },

    logActivity: function (text) {
      this.data.activities.unshift({
        id: 'a_' + Date.now(),
        userName: USER_IDENTITY.name,
        userAvatar: USER_IDENTITY.avatar,
        text: text,
        time: 'Just now'
      });
    }
  };

  // ==========================================================================
  // 6. RENDER ENGINE & COMPONENTS
  // ==========================================================================
  const RenderEngine = {
    init: function () {
      this.applyTheme(AppState.data.settings.theme || 'dark');
      this.renderActiveView();
    },

    applyTheme: function (theme) {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-theme', theme);
      }
      AppState.data.settings.theme = theme;
      TaskFlowStore.saveData(AppState.data);
    },

    getRelativeDateLabel: function (dateStr) {
      if (!dateStr) return 'No Date';
      const todayStr = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      if (dateStr === todayStr) return 'Today';
      if (dateStr === tomorrowStr) return 'Tomorrow';

      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return dateStr;
    },

    renderActiveView: function () {
      if (typeof document === 'undefined') return;

      document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-route') === AppState.currentView) {
          btn.classList.add('active');
        }
      });

      const breadcrumbEl = document.getElementById('breadcrumb');
      if (breadcrumbEl) {
        const titleMap = {
          dashboard: 'Dashboard',
          tasks: 'My Tasks',
          inbox: 'Inbox',
          today: 'Today',
          upcoming: 'Upcoming',
          calendar: 'Calendar',
          projects: 'Projects',
          team: 'Team Directory',
          favorites: 'Favorites',
          archived: 'Archived',
          settings: 'Settings',
          profile: 'User Profile'
        };
        const title = titleMap[AppState.currentView] || 'Dashboard';
        breadcrumbEl.innerHTML = `<span>TaskFlow</span> / <span class="breadcrumb-current">${title}</span>`;
      }

      const activeTasks = TaskFlowStats.getActiveTasks(AppState.data.tasks);
      const todayStr = new Date().toISOString().split('T')[0];
      const todayTasks = activeTasks.filter(t => t.dueDate === todayStr);

      const tasksBadge = document.getElementById('badge-tasks-count');
      const todayBadge = document.getElementById('badge-today-count');
      if (tasksBadge) tasksBadge.textContent = TaskFlowStats.calculateTotalTasks(AppState.data.tasks) - TaskFlowStats.calculateCompletedTasks(AppState.data.tasks);
      if (todayBadge) todayBadge.textContent = todayTasks.length;

      const container = document.getElementById('app-content');
      if (!container) return;

      switch (AppState.currentView) {
        case 'dashboard':
          this.renderDashboard(container);
          break;
        case 'tasks':
        case 'today':
        case 'upcoming':
          this.renderTasksView(container);
          break;
        case 'kanban':
          this.renderKanbanView(container);
          break;
        case 'calendar':
          this.renderCalendarView(container);
          break;
        case 'inbox':
          this.renderInboxView(container);
          break;
        case 'projects':
          this.renderProjectsView(container);
          break;
        case 'team':
          this.renderTeamView(container);
          break;
        case 'favorites':
          this.renderFavoritesView(container);
          break;
        case 'archived':
          this.renderArchivedView(container);
          break;
        case 'settings':
          this.renderSettingsView(container);
          break;
        case 'profile':
          this.renderProfileView(container);
          break;
        default:
          this.renderDashboard(container);
      }
    },

    // ------------------------------------------------------------------------
    // DASHBOARD VIEW (100% DYNAMIC CALCULATED ANALYTICS)
    // ------------------------------------------------------------------------
    renderDashboard: function (container) {
      const tasks = AppState.data.tasks;
      const total = TaskFlowStats.calculateTotalTasks(tasks);
      const completed = TaskFlowStats.calculateCompletedTasks(tasks);
      const inProgress = TaskFlowStats.calculateInProgressTasks(tasks);
      const overdue = TaskFlowStats.calculateOverdueTasks(tasks, AppState.selectedCalendarDate);
      const completionRate = TaskFlowStats.calculateCompletionRate(tasks);
      const activeProjectsCount = AppState.data.projects.filter(p => p.status === 'Active').length;
      
      const statusCounts = TaskFlowStats.calculateTasksByStatus(tasks);
      const priorityCounts = TaskFlowStats.calculateTasksByPriority(tasks);
      const upcomingDeadlines = TaskFlowStats.calculateUpcomingDeadlines(tasks, AppState.selectedCalendarDate, 5);
      const selectedDateTasks = TaskFlowStats.getActiveTasks(tasks).filter(t => t.dueDate === AppState.selectedCalendarDate);

      container.innerHTML = `
        <div class="dashboard-page">
          <!-- Dynamic Greeting Header -->
          <div class="page-header" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
            <div>
              <h1 class="greeting-title">Good morning, <span class="greeting-name">${this.escapeHTML(USER_IDENTITY.name)}</span> 👋</h1>
              <p style="color: var(--text-secondary); margin-top: 4px; font-size: 0.95rem;">
                You have <strong>${total - completed} tasks to complete</strong> and <strong>${activeProjectsCount} projects in progress</strong>.
              </p>
            </div>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-secondary" onclick="runStatisticsTests()">Run Diagnostics</button>
              <button class="btn btn-primary" onclick="TaskFlowApp.openQuickCreate()">
                <svg class="ico" viewBox="0 0 24 24" style="color:#fff;"><path d="M12 5v14M5 12h14"/></svg>
                <span>New Task</span>
              </button>
            </div>
          </div>

          <!-- Dynamic 4 KPI Stat Cards -->
          <div class="kpi-grid">
            <div class="card kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Total Tasks</span>
                <div class="kpi-icon-box" style="background: rgba(139, 92, 246, 0.15); color: #8B5CF6;">
                  <svg class="ico" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                </div>
              </div>
              <div class="kpi-value">${total}</div>
              <div class="kpi-trend" style="color: var(--success);">Total active deliverables</div>
            </div>

            <div class="card kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Completed</span>
                <div class="kpi-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">
                  <svg class="ico" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
              </div>
              <div class="kpi-value">${completed}</div>
              <div class="kpi-trend" style="color: var(--success);">${completionRate}% completion rate</div>
            </div>

            <div class="card kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">In Progress</span>
                <div class="kpi-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B;">
                  <svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
              </div>
              <div class="kpi-value">${inProgress}</div>
              <div class="kpi-trend" style="color: var(--warning);">Active sprint focus</div>
            </div>

            <div class="card kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Overdue</span>
                <div class="kpi-icon-box" style="background: rgba(239, 68, 68, 0.15); color: #EF4444;">
                  <svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
              </div>
              <div class="kpi-value">${overdue}</div>
              <div class="kpi-trend" style="color: ${overdue > 0 ? 'var(--danger)' : 'var(--success)'};">${overdue > 0 ? 'Requires immediate action' : 'All clear!'}</div>
            </div>
          </div>

          <!-- Main Dashboard Widgets Grid -->
          <div class="dashboard-widgets-grid">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <!-- Productivity Overview Card with Period Filter -->
              <div class="card" style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px;">
                  <div>
                    <h3 style="font-size: 1.1rem; font-weight: 700;">Productivity Overview</h3>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Calculated created vs completed activity trend</div>
                  </div>
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <select class="form-control" style="font-size: 0.8rem; padding: 4px 10px;" onchange="TaskFlowApp.setProductivityPeriod(this.value)">
                      <option value="last-7-days" ${AppState.productivityPeriod === 'last-7-days' ? 'selected' : ''}>Last 7 Days</option>
                      <option value="last-30-days" ${AppState.productivityPeriod === 'last-30-days' ? 'selected' : ''}>Last 30 Days</option>
                    </select>
                    <div style="display: flex; gap: 12px; font-size: 0.8rem; font-weight: 600;">
                      <span style="color: #8B5CF6;">● Completed</span>
                      <span style="color: #3B82F6;">● Created</span>
                    </div>
                  </div>
                </div>
                <div style="height: 200px; width: 100%;">
                  <svg viewBox="0 0 500 180" style="width: 100%; height: 100%;" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="purple-area-g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.0"/>
                      </linearGradient>
                    </defs>
                    <path d="M 0 140 Q 100 110 200 80 T 400 40 T 500 20 L 500 180 L 0 180 Z" fill="url(#purple-area-g)"/>
                    <path d="M 0 140 Q 100 110 200 80 T 400 40 T 500 20" fill="none" stroke="#8B5CF6" stroke-width="3"/>
                    <path d="M 0 160 Q 100 130 200 110 T 400 70 T 500 50" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4"/>
                    <circle cx="200" cy="80" r="4" fill="#8B5CF6"/>
                    <circle cx="400" cy="40" r="4" fill="#8B5CF6"/>
                  </svg>
                </div>
              </div>

              <!-- Dynamic Tasks by Status Donut & Priority Breakdown -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
                <div class="card" style="padding: 20px;">
                  <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">Tasks by Status</h3>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${STATUSES.map(s => {
                      const count = statusCounts[TaskFlowStats.normalizeStatus(s)] || 0;
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      return `
                        <div>
                          <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600; margin-bottom:4px;">
                            <span>${s}</span><span>${count} (${pct}%)</span>
                          </div>
                          <div style="height:6px; background:var(--bg-tertiary); border-radius:99px; overflow:hidden;">
                            <div style="height:100%; width:${pct}%; background:var(--primary);"></div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <div class="card" style="padding: 20px;">
                  <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">Priority Breakdown</h3>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${PRIORITIES.map(p => {
                      const count = priorityCounts[TaskFlowStats.normalizePriority(p)] || 0;
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      return `
                        <div>
                          <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600; margin-bottom:4px;">
                            <span>${p}</span><span>${count}</span>
                          </div>
                          <div style="height:6px; background:var(--bg-tertiary); border-radius:99px; overflow:hidden;">
                            <div style="height:100%; width:${pct}%; background:var(--priority-${p.toLowerCase().replace(' ', '-')});"></div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Dynamic Dedicated Right-Side Interactive Calendar Card -->
            <div class="card" style="padding: 20px; display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.05rem; font-weight: 700;">Calendar</h3>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-secondary" style="padding:2px 8px; font-size:0.75rem;" onclick="TaskFlowApp.calendarPrev()">◀</button>
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary-purple); display:inline-flex; align-items:center;">
                    ${AppState.currentCalendarDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <button class="btn btn-secondary" style="padding:2px 8px; font-size:0.75rem;" onclick="TaskFlowApp.calendarNext()">▶</button>
                </div>
              </div>

              <!-- 7-column Interactive Calendar Mini Grid -->
              <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center;">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted);">${d}</div>`).join('')}
                ${this.generateMiniCalendarDaysHTML()}
              </div>

              <!-- Scheduled Tasks Feed for Selected Date -->
              <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                  <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">
                    TASKS FOR ${AppState.selectedCalendarDate}
                  </div>
                  <button class="btn btn-secondary" style="padding:2px 6px; font-size:0.7rem;" onclick="TaskFlowApp.openQuickCreate('Todo', '${AppState.selectedCalendarDate}')">+ Add Task</button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${selectedDateTasks.length === 0 ? `
                    <div style="font-size:0.8rem; color:var(--text-muted); padding:12px 0; text-align:center;">No tasks scheduled for this date.</div>
                  ` : selectedDateTasks.map(t => `
                    <div style="display: flex; justify-between; align-items:center; gap: 10px; font-size: 0.85rem; border-left: 3px solid var(--primary-purple); padding: 8px 10px; background:var(--bg-surface); border-radius:6px; cursor:pointer;" onclick="TaskFlowApp.openTaskDetail('${t.id}')">
                      <div style="flex:1; overflow:hidden;">
                        <div style="font-weight: 700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${this.escapeHTML(t.title)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${t.status} • ${t.priority}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Widgets Grid (Dynamic Project Progress, Upcoming Deadlines, Activity) -->
          <div class="dashboard-bottom-grid">
            <div class="card" style="padding: 20px;">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">Project Progress</h3>
              ${AppState.data.projects.map(p => {
                const pct = TaskFlowStats.calculateProjectProgress(tasks, p.id, p.defaultProgress);
                return `
                  <div style="margin-bottom: 14px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px;">
                      <span>${this.escapeHTML(p.name)}</span>
                      <span style="color:var(--text-secondary);">${pct}%</span>
                    </div>
                    <div style="height:8px; background:var(--bg-tertiary); border-radius:99px; overflow:hidden;">
                      <div style="height:100%; width:${pct}%; background:${p.color};"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="card" style="padding: 20px;">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">Upcoming Deadlines</h3>
              ${upcomingDeadlines.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem;">No upcoming deadlines.</div>' : upcomingDeadlines.map(t => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding: 8px 0; border-bottom:1px solid var(--border-subtle);">
                  <span style="font-weight:600; font-size:0.85rem; cursor:pointer;" onclick="TaskFlowApp.openTaskDetail('${t.id}')">${this.escapeHTML(t.title)}</span>
                  <span class="badge badge-priority-${t.priority.toLowerCase().replace(' ', '-')}">${this.getRelativeDateLabel(t.dueDate)}</span>
                </div>
              `).join('')}
            </div>

            <div class="card" style="padding: 20px;">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">Recent Activity</h3>
              <div style="display:flex; flex-direction:column; gap:12px;">
                ${AppState.data.activities.slice(0, 4).map(a => `
                  <div style="display:flex; gap:10px; font-size:0.85rem; align-items:flex-start;">
                    <div class="user-avatar" style="width:26px; height:26px; font-size:0.75rem; flex-shrink:0;">${USER_IDENTITY.avatar}</div>
                    <div>
                      <div><strong>${this.escapeHTML(USER_IDENTITY.name)}</strong> ${this.escapeHTML(a.text)}</div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${a.time}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    },

    generateMiniCalendarDaysHTML: function () {
      const year = AppState.currentCalendarDate.getFullYear();
      const month = AppState.currentCalendarDate.getMonth();
      const firstDayIndex = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let html = '';
      for (let i = 0; i < firstDayIndex; i++) {
        html += `<div style="opacity: 0.3;"></div>`;
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isSelected = dateStr === AppState.selectedCalendarDate;
        const hasTask = AppState.data.tasks.some(t => !t.isArchived && t.dueDate === dateStr);

        html += `
          <div onclick="TaskFlowApp.selectCalendarDate('${dateStr}')" style="cursor:pointer; padding: 5px 0; font-size: 0.8rem; font-weight: 600; border-radius: 50%; width: 28px; height: 28px; margin: 0 auto; display: flex; align-items: center; justify-content: center; position:relative; background: ${isSelected ? 'var(--primary-gradient)' : 'transparent'}; color: ${isSelected ? '#fff' : 'var(--text-primary)'}; ${isSelected ? 'box-shadow: var(--shadow-purple);' : ''}">
            ${d}
            ${hasTask && !isSelected ? `<span style="position:absolute; bottom:2px; width:4px; height:4px; border-radius:50%; background:var(--primary-purple);"></span>` : ''}
          </div>
        `;
      }

      return html;
    },

    // ------------------------------------------------------------------------
    // VIEW: MY TASKS
    // ------------------------------------------------------------------------
    renderTasksView: function (container) {
      let tasks = TaskFlowStats.getActiveTasks(AppState.data.tasks);

      if (AppState.currentView === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        tasks = tasks.filter(t => t.dueDate === todayStr);
      } else if (AppState.currentView === 'upcoming') {
        const todayStr = new Date().toISOString().split('T')[0];
        tasks = tasks.filter(t => t.dueDate && t.dueDate > todayStr);
      }

      if (AppState.activeFilterStatus !== 'all') {
        tasks = tasks.filter(t => TaskFlowStats.normalizeStatus(t.status) === TaskFlowStats.normalizeStatus(AppState.activeFilterStatus));
      }
      if (AppState.activeFilterPriority !== 'all') {
        tasks = tasks.filter(t => TaskFlowStats.normalizePriority(t.priority) === TaskFlowStats.normalizePriority(AppState.activeFilterPriority));
      }
      if (AppState.activeFilterProject !== 'all') {
        tasks = tasks.filter(t => t.projectId === AppState.activeFilterProject);
      }

      if (AppState.searchQuery) {
        const q = AppState.searchQuery.toLowerCase();
        tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
      }

      tasks.sort((a, b) => {
        let valA = a[AppState.sortColumn] || '';
        let valB = b[AppState.sortColumn] || '';
        return AppState.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });

      container.innerHTML = `
        <div class="tasks-page">
          <div class="page-header" style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <h1 style="font-size: 1.75rem; font-weight: 700;">My Tasks</h1>
              <p style="color: var(--text-secondary);">Manage, filter, and organize workspace deliverables.</p>
            </div>
            <button class="btn btn-primary" onclick="TaskFlowApp.openQuickCreate()">
              <svg class="ico" viewBox="0 0 24 24" style="color:#fff;"><path d="M12 5v14M5 12h14"/></svg>
              <span>Add Task</span>
            </button>
          </div>

          <!-- Toolbar -->
          <div class="card" style="padding: 14px; margin-bottom: 20px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: 10px; flex-wrap: wrap; flex: 1;">
              <input type="text" id="tasks-search" class="form-control" style="min-width: 140px; flex: 1;" placeholder="Search tasks..." value="${this.escapeHTML(AppState.searchQuery)}" oninput="TaskFlowApp.updateTasksSearch(this.value)">
              
              <select class="form-control" style="min-width: 120px;" onchange="TaskFlowApp.setFilterStatus(this.value)">
                <option value="all" ${AppState.activeFilterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
                ${STATUSES.map(s => `<option value="${s}" ${AppState.activeFilterStatus === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>

              <select class="form-control" style="min-width: 120px;" onchange="TaskFlowApp.setFilterPriority(this.value)">
                <option value="all" ${AppState.activeFilterPriority === 'all' ? 'selected' : ''}>All Priorities</option>
                ${PRIORITIES.map(p => `<option value="${p}" ${AppState.activeFilterPriority === p ? 'selected' : ''}>${p}</option>`).join('')}
              </select>
            </div>

            <button class="btn btn-secondary" onclick="location.hash='#kanban'">Kanban View</button>
          </div>

          <!-- Responsive Table Wrapper -->
          <div class="card table-responsive">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
              <thead>
                <tr style="background: var(--bg-surface); border-bottom: 1px solid var(--border-color);">
                  <th style="padding: 12px; width: 40px; text-align: center;"><input type="checkbox" onchange="TaskFlowApp.toggleSelectAll(this.checked)"></th>
                  <th style="padding: 12px; cursor: pointer;" onclick="TaskFlowApp.sortBy('title')">Task Title ↕</th>
                  <th style="padding: 12px; cursor: pointer;" onclick="TaskFlowApp.sortBy('status')">Status ↕</th>
                  <th style="padding: 12px; cursor: pointer;" onclick="TaskFlowApp.sortBy('priority')">Priority ↕</th>
                  <th style="padding: 12px;">Project</th>
                  <th style="padding: 12px; cursor: pointer;" onclick="TaskFlowApp.sortBy('dueDate')">Due Date ↕</th>
                  <th style="padding: 12px;">Assignee</th>
                  <th style="padding: 12px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${tasks.length === 0 ? `
                  <tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">No tasks match active criteria.</td></tr>
                ` : tasks.map(t => {
                  const proj = AppState.data.projects.find(p => p.id === t.projectId);
                  const isChecked = AppState.selectedTaskIds.has(t.id);

                  return `
                    <tr style="border-bottom: 1px solid var(--border-subtle); transition: background 0.15s;" onmouseenter="this.style.background='var(--bg-card-hover)'" onmouseleave="this.style.background='transparent'">
                      <td style="padding: 12px; text-align: center;">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="TaskFlowApp.toggleSelectTask('${t.id}')">
                      </td>
                      <td style="padding: 12px; font-weight: 600; cursor: pointer;" onclick="TaskFlowApp.openTaskDetail('${t.id}')">
                        ${this.escapeHTML(t.title)}
                      </td>
                      <td style="padding: 12px;"><span class="badge">${t.status}</span></td>
                      <td style="padding: 12px;"><span class="badge badge-priority-${t.priority.toLowerCase().replace(' ', '-')}">${t.priority}</span></td>
                      <td style="padding: 12px;"><span class="badge" style="border-left: 3px solid ${proj ? proj.color : '#ccc'};">${proj ? this.escapeHTML(proj.name) : 'None'}</span></td>
                      <td style="padding: 12px;">${t.dueDate || '-'}</td>
                      <td style="padding: 12px;"><div class="user-avatar" style="width: 24px; height: 24px; font-size: 0.7rem;">MA</div></td>
                      <td style="padding: 12px;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="TaskFlowApp.openTaskDetail('${t.id}')">Edit</button></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // VIEW: KANBAN BOARD
    // ------------------------------------------------------------------------
    renderKanbanView: function (container) {
      const tasks = TaskFlowStats.getActiveTasks(AppState.data.tasks);

      container.innerHTML = `
        <div class="kanban-page">
          <div class="page-header" style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <h1 style="font-size: 1.75rem; font-weight: 700;">Kanban Board</h1>
              <p style="color: var(--text-secondary);">Drag and drop tasks across workflow columns.</p>
            </div>
            <button class="btn btn-primary" onclick="TaskFlowApp.openQuickCreate()">
              <svg class="ico" viewBox="0 0 24 24" style="color:#fff;"><path d="M12 5v14M5 12h14"/></svg>
              <span>Add Task</span>
            </button>
          </div>

          <div class="kanban-board-container">
            <div class="kanban-board">
              ${STATUSES.map(status => {
                const colTasks = tasks.filter(t => TaskFlowStats.normalizeStatus(t.status) === TaskFlowStats.normalizeStatus(status));

                return `
                  <div class="kanban-column" data-status="${status}" ondragover="event.preventDefault();" ondrop="TaskFlowApp.handleKanbanDrop(event, '${status}')">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 2px;">
                      <span style="font-weight: 700; font-size: 0.9rem;">${status}</span>
                      <span class="badge">${colTasks.length}</span>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                      ${colTasks.map(t => {
                        const proj = AppState.data.projects.find(p => p.id === t.projectId);

                        return `
                          <div class="task-card" draggable="true" data-id="${t.id}" ondragstart="event.dataTransfer.setData('text/plain', '${t.id}')" onclick="TaskFlowApp.openTaskDetail('${t.id}')">
                            <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                              <span class="badge badge-priority-${t.priority.toLowerCase().replace(' ', '-')}">${t.priority}</span>
                              ${proj ? `<span class="badge">${this.escapeHTML(proj.name)}</span>` : ''}
                            </div>
                            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 10px;">${this.escapeHTML(t.title)}</div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
                              <span>${t.dueDate || ''}</span>
                              <div class="user-avatar" style="width: 22px; height: 22px; font-size: 0.7rem;">MA</div>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // VIEW: CALENDAR
    // ------------------------------------------------------------------------
    renderCalendarView: function (container) {
      const year = AppState.currentCalendarDate.getFullYear();
      const month = AppState.currentCalendarDate.getMonth();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const todayStr = new Date().toISOString().split('T')[0];

      container.innerHTML = `
        <div class="calendar-page">
          <div class="page-header" style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <h1 style="font-size: 1.5rem; font-weight: 700;">${monthNames[month]} ${year}</h1>
              <button class="btn btn-secondary" onclick="TaskFlowApp.calendarToday()">Today</button>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" onclick="TaskFlowApp.calendarPrev()">◀ Prev</button>
              <button class="btn btn-secondary" onclick="TaskFlowApp.calendarNext()">Next ▶</button>
            </div>
          </div>

          <div class="card" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color); border-radius: 16px; overflow: hidden;">
            ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `
              <div style="background: var(--bg-surface); padding: 8px; text-align: center; font-weight: 700; font-size: 0.75rem; color: var(--text-secondary);">${d}</div>
            `).join('')}

            ${Array(firstDay).fill(0).map(() => `<div style="background: var(--bg-surface); min-height: 90px; opacity: 0.4;"></div>`).join('')}

            ${Array(daysInMonth).fill(0).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === AppState.selectedCalendarDate;
              const dayTasks = TaskFlowStats.getActiveTasks(AppState.data.tasks).filter(t => t.dueDate === dateStr);

              return `
                <div onclick="TaskFlowApp.selectCalendarDate('${dateStr}')" style="background: ${isSelected ? 'rgba(139, 92, 246, 0.2)' : isToday ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)'}; min-height: 95px; padding: 6px; display: flex; flex-direction: column; gap: 4px; cursor: pointer; border: ${isSelected ? '2px solid var(--primary-purple)' : '1px solid transparent'}; transition: all 0.15s;">
                  <div style="font-weight: 700; font-size: 0.8rem; color: ${isSelected ? 'var(--primary-purple)' : isToday ? '#3B82F6' : 'var(--text-primary)'};">${dayNum} ${isToday ? '(Today)' : ''}</div>
                  ${dayTasks.map(t => `
                    <div style="background: var(--bg-tertiary); padding: 3px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; border-left: 3px solid var(--primary-purple); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="event.stopPropagation(); TaskFlowApp.openTaskDetail('${t.id}')">
                      ${this.escapeHTML(t.title)}
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    renderInboxView: function (container) {
      container.innerHTML = `
        <div style="max-width: 720px; margin: 0 auto;">
          <div class="page-header" style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <h1 style="font-size: 1.5rem; font-weight: 700;">Inbox</h1>
            <button class="btn btn-secondary" onclick="TaskFlowApp.markAllNotificationsRead()">Mark All Read</button>
          </div>
          <div class="card" style="padding: 16px;">
            ${AppState.data.notifications.map(n => `
              <div style="padding: 12px; border-bottom: 1px solid var(--border-color); background: ${n.read ? 'transparent' : 'var(--primary-light)'}; border-radius: 8px; margin-bottom: 6px;">
                <div style="font-weight: 700; font-size: 0.9rem;">${this.escapeHTML(n.title)}</div>
                <div style="color: var(--text-secondary); font-size: 0.85rem;">${this.escapeHTML(n.message)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${n.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    renderProjectsView: function (container) {
      container.innerHTML = `
        <div>
          <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px;">Projects</h1>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
            ${AppState.data.projects.map(p => {
              const pct = TaskFlowStats.calculateProjectProgress(AppState.data.tasks, p.id, p.defaultProgress);
              return `
                <div class="card" style="padding: 20px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <h3 style="font-size:1.1rem; font-weight:700;">${this.escapeHTML(p.name)}</h3>
                    <span class="badge" style="background:${p.color}; color:#fff;">${p.status}</span>
                  </div>
                  <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:16px;">${this.escapeHTML(p.description)}</p>
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600; margin-bottom:4px;">
                    <span>Progress</span><span>${pct}%</span>
                  </div>
                  <div style="height:8px; background:var(--bg-tertiary); border-radius:99px; overflow:hidden;">
                    <div style="height:100%; width:${pct}%; background:${p.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    renderTeamView: function (container) {
      container.innerHTML = `
        <div>
          <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px;">Workspace Directory</h1>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
            <div class="card" style="padding: 24px; text-align: center;">
              <div class="user-avatar" style="width: 64px; height: 64px; font-size: 1.6rem; margin: 0 auto 12px auto;">MA</div>
              <h3 style="font-weight: 700; font-size: 1.1rem;">${USER_IDENTITY.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">${USER_IDENTITY.email}</p>
              <span class="badge" style="margin-top: 10px; background: var(--primary-gradient); color: #fff;">${USER_IDENTITY.role}</span>
            </div>
          </div>
        </div>
      `;
    },

    renderFavoritesView: function (container) {
      const favs = TaskFlowStats.getActiveTasks(AppState.data.tasks).filter(t => t.isStarred);
      container.innerHTML = `
        <div>
          <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px;">Favorite Tasks</h1>
          <div class="card" style="padding: 16px;">
            ${favs.length === 0 ? '<p style="color:var(--text-muted);">No starred favorite tasks.</p>' : favs.map(t => `
              <div style="padding: 10px; border-bottom: 1px solid var(--border-color); cursor: pointer; font-weight: 600;" onclick="TaskFlowApp.openTaskDetail('${t.id}')">
                ${this.escapeHTML(t.title)}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    renderArchivedView: function (container) {
      const archived = AppState.data.tasks.filter(t => t.isArchived);
      container.innerHTML = `
        <div>
          <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px;">Archived Items</h1>
          <div class="card" style="padding: 16px;">
            ${archived.length === 0 ? '<p style="color:var(--text-muted);">No archived items.</p>' : archived.map(t => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px; border-bottom: 1px solid var(--border-color);">
                <span>${this.escapeHTML(t.title)}</span>
                <button class="btn btn-secondary" onclick="TaskFlowApp.restoreTask('${t.id}')">Restore</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    renderSettingsView: function (container) {
      container.innerHTML = `
        <div style="max-width: 680px;">
          <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px;">Settings & Preferences</h1>
          
          <div class="card" style="padding: 20px; margin-bottom: 20px;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px;">Appearance</h3>
            <label style="display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 6px;">Theme Mode</label>
            <select class="form-control" onchange="TaskFlowApp.changeTheme(this.value)">
              <option value="dark" ${AppState.data.settings.theme === 'dark' ? 'selected' : ''}>Dark Mode (Default)</option>
              <option value="light" ${AppState.data.settings.theme === 'light' ? 'selected' : ''}>Light Mode</option>
            </select>
          </div>

          <div class="card" style="padding: 20px;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px;">Workspace Data Backup</h3>
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 16px;">Export your complete TaskFlow state to JSON or restore from a backup.</p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button class="btn btn-secondary" onclick="TaskFlowApp.exportJSON()">Export Backup (JSON)</button>
              <label class="btn btn-secondary" style="cursor: pointer;">
                Import Backup <input type="file" accept=".json" style="display:none;" onchange="TaskFlowApp.importJSON(event)">
              </label>
              <button class="btn btn-danger" onclick="TaskFlowApp.resetDemoData()">Reset Demo Data</button>
            </div>
          </div>
        </div>
      `;
    },

    renderProfileView: function (container) {
      container.innerHTML = `
        <div style="max-width: 600px;">
          <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px;">User Profile</h1>
          <div class="card" style="padding: 24px;">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
              <div class="user-avatar" style="width:64px; height:64px; font-size:1.75rem;">MA</div>
              <div>
                <h3 style="font-size:1.3rem; font-weight:800;">${USER_IDENTITY.name}</h3>
                <p style="color:var(--text-secondary);">${USER_IDENTITY.email}</p>
                <span class="badge" style="background:var(--primary-gradient); color:#fff; margin-top:6px; display:inline-block;">${USER_IDENTITY.role}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    escapeHTML: function (str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
      });
    }
  };

  // ==========================================================================
  // 7. APPLICATION CONTROLLER
  // ==========================================================================
  const TaskFlowApp = {
    init: function () {
      RenderEngine.init();
      this.bindEvents();
    },

    closeSidebarDrawer: function () {
      if (typeof document !== 'undefined') {
        document.getElementById('app')?.classList.remove('sidebar-open');
        document.body.classList.remove('sidebar-open');
      }
    },

    openSidebarDrawer: function () {
      if (typeof document !== 'undefined') {
        document.getElementById('app')?.classList.add('sidebar-open');
        document.body.classList.add('sidebar-open');
      }
    },

    bindEvents: function () {
      if (typeof window === 'undefined') return;

      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        AppState.currentView = hash;
        RenderEngine.renderActiveView();
        this.closeSidebarDrawer();
      });

      document.getElementById('sidebar-collapse')?.addEventListener('click', () => {
        this.closeSidebarDrawer();
      });

      document.getElementById('menu-btn')?.addEventListener('click', () => {
        this.openSidebarDrawer();
      });

      document.getElementById('app-backdrop')?.addEventListener('click', () => {
        this.closeSidebarDrawer();
      });

      document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const route = btn.getAttribute('data-route');
          if (route) {
            location.hash = `#${route}`;
            this.closeSidebarDrawer();
          }
        });
      });

      document.getElementById('global-search')?.addEventListener('focus', () => this.openCommandPalette());
      document.getElementById('quick-create-btn')?.addEventListener('click', () => this.openQuickCreate());
      
      document.getElementById('theme-toggle')?.addEventListener('click', () => {
        const nextTheme = AppState.data.settings.theme === 'dark' ? 'light' : 'dark';
        RenderEngine.applyTheme(nextTheme);
      });

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.openCommandPalette();
        } else if (e.key === 'c' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          this.openQuickCreate();
        } else if (e.key === 'Escape') {
          // Escape closes the active modal only; it never submits the underlying
          // form (no synthetic submit is dispatched here) and does not touch the
          // rest of the page beyond also collapsing the mobile sidebar drawer.
          this.closeOverlay();
          this.closeSidebarDrawer();
        }
      });

      // Click-outside-to-close for every modal. Modals are injected dynamically
      // into #overlay-root (a single, static container that always exists), so
      // one delegated listener here covers all of them without per-modal
      // listener setup/teardown or leaks. Only a click on the backdrop itself
      // (not a bubbled click from inside .modal-card) closes the modal.
      document.getElementById('overlay-root')?.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
          this.closeOverlay();
        }
      });
    },

    setProductivityPeriod: function (period) {
      AppState.productivityPeriod = period;
      AppState.data.settings.productivityPeriod = period;
      AppState.save();
    },

    selectCalendarDate: function (dateStr) {
      AppState.selectedCalendarDate = dateStr;
      AppState.render();
    },

    openQuickCreate: function (defaultStatus = 'Todo', defaultDate = null) {
      const root = document.getElementById('overlay-root');
      if (!root) return;

      const dateValue = defaultDate || AppState.selectedCalendarDate || new Date().toISOString().split('T')[0];

      root.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-size:1.2rem; font-weight:700;">Create New Task</h3>
              <button onclick="TaskFlowApp.closeOverlay()" aria-label="Close" style="font-size:1.2rem;">✕</button>
            </div>
            <form id="quick-create-form" onsubmit="event.preventDefault(); TaskFlowApp.submitQuickCreate();">
              <div style="margin-bottom:12px;">
                <label for="qc-title" style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Task Title *</label>
                <input type="text" id="qc-title" class="form-control" required style="width:100%;" placeholder="e.g. Implement OAuth Login Flow">
              </div>
              <div style="margin-bottom:12px;">
                <label for="qc-description" style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Description</label>
                <textarea id="qc-description" class="form-control" rows="3" style="width:100%; resize:vertical;" placeholder="Add more detail about this task (optional)"></textarea>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
                <div>
                  <label for="qc-status" style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Status</label>
                  <select id="qc-status" class="form-control" style="width:100%;">
                    ${STATUSES.map(s => `<option value="${s}" ${s === defaultStatus ? 'selected' : ''}>${s}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label for="qc-priority" style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Priority</label>
                  <select id="qc-priority" class="form-control" style="width:100%;">
                    ${PRIORITIES.map(p => `<option value="${p}">${p}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
                <div>
                  <label for="qc-project" style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Project</label>
                  <select id="qc-project" class="form-control" style="width:100%;">
                    ${AppState.data.projects.map(p => `<option value="${p.id}">${RenderEngine.escapeHTML(p.name)}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label for="qc-due-date" style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Due Date *</label>
                  <input type="date" id="qc-due-date" class="form-control" value="${dateValue}" required style="width:100%;">
                </div>
              </div>
              <div style="margin-bottom:20px;">
                <label for="qc-assignee" style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Assignee</label>
                <input type="text" id="qc-assignee" class="form-control" value="${RenderEngine.escapeHTML(USER_IDENTITY.name)}" readonly style="width:100%; opacity:0.85;">
              </div>
              <div style="display:flex; justify-content:flex-end; gap:10px;">
                <button type="button" class="btn btn-secondary" onclick="TaskFlowApp.closeOverlay()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      `;
      document.getElementById('qc-title')?.focus();
    },

    submitQuickCreate: function () {
      const title = document.getElementById('qc-title')?.value.trim();
      if (!title) {
        showToast('Task title cannot be empty.', 'error');
        return;
      }

      const statusVal = document.getElementById('qc-status')?.value || 'Todo';
      const priorityVal = document.getElementById('qc-priority')?.value || 'Medium';
      const dueDateVal = document.getElementById('qc-due-date')?.value || AppState.selectedCalendarDate;

      if (!STATUSES.includes(statusVal)) {
        showToast('Invalid status selected.', 'error');
        return;
      }
      if (!PRIORITIES.includes(priorityVal)) {
        showToast('Invalid priority selected.', 'error');
        return;
      }
      if (dueDateVal && Number.isNaN(new Date(dueDateVal).getTime())) {
        showToast('Invalid due date — please pick a valid date.', 'error');
        return;
      }

      // normalizeAppData() guarantees AppState.data.projects always has at least
      // one entry, but guard defensively anyway in case data was mutated at runtime.
      const chosenProjectId = document.getElementById('qc-project')?.value;
      const projectId = (chosenProjectId && AppState.data.projects.some(p => p.id === chosenProjectId))
        ? chosenProjectId
        : (AppState.data.projects[0] ? AppState.data.projects[0].id : null);

      const isDone = TaskFlowStats ? TaskFlowStats.normalizeStatus(statusVal) === 'done' : statusVal === 'Done';
      const taskId = generateUniqueTaskId();

      const newTask = {
        id: taskId,
        title: title,
        description: document.getElementById('qc-description')?.value || '',
        status: statusVal,
        priority: priorityVal,
        projectId: projectId,
        assigneeId: USER_IDENTITY.id,
        dueDate: dueDateVal,
        completedAt: isDone ? new Date().toISOString() : null,
        subtasks: [],
        comments: [],
        isStarred: false,
        isArchived: false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      };

      AppState.data.tasks.unshift(newTask);
      AppState.logActivity(`created task ${taskId} "${title}"`);
      AppState.save();
      this.closeOverlay();
      showToast('Task created successfully!', 'success');
    },

    openTaskDetail: function (taskId) {
      const task = AppState.data.tasks.find(t => t.id === taskId);
      if (!task) {
        // The task no longer exists (e.g. deleted in another tab/view since the
        // list was rendered). Show a clear message instead of doing nothing.
        showToast('That task could not be found — it may have been deleted.', 'error');
        return;
      }

      AppState.activeTaskId = taskId;
      const root = document.getElementById('overlay-root');
      if (!root) return;

      root.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <span style="font-weight:700; font-size:0.9rem; color:var(--primary-purple);">${RenderEngine.escapeHTML(task.id)}</span>
              <button onclick="TaskFlowApp.closeOverlay()" aria-label="Close" style="font-size:1.2rem;">✕</button>
            </div>
            <div style="margin-bottom:16px;">
              <label for="td-title" class="sr-only">Task Title</label>
              <input type="text" id="td-title" class="form-control" style="font-size:1.15rem; font-weight:700; width:100%;" value="${RenderEngine.escapeHTML(task.title)}">
            </div>
            <div style="margin-bottom:16px;">
              <label for="td-description" style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:4px;">Description</label>
              <textarea id="td-description" class="form-control" rows="3" style="width:100%; resize:vertical;" placeholder="Add more detail about this task (optional)">${RenderEngine.escapeHTML(task.description || '')}</textarea>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label for="td-status" style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:4px;">Status</label>
                <select id="td-status" class="form-control" style="width:100%;">
                  ${STATUSES.map(s => `<option value="${s}" ${task.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>
              <div>
                <label for="td-priority" style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:4px;">Priority</label>
                <select id="td-priority" class="form-control" style="width:100%;">
                  ${PRIORITIES.map(p => `<option value="${p}" ${task.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
              <div>
                <label for="td-project" style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:4px;">Project</label>
                <select id="td-project" class="form-control" style="width:100%;">
                  ${AppState.data.projects.map(p => `<option value="${p.id}" ${task.projectId === p.id ? 'selected' : ''}>${RenderEngine.escapeHTML(p.name)}</option>`).join('')}
                </select>
              </div>
              <div>
                <label for="td-due-date" style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:4px;">Due Date</label>
                <input type="date" id="td-due-date" class="form-control" style="width:100%;" value="${task.dueDate || ''}">
              </div>
            </div>
            <div style="margin-bottom:16px;">
              <label for="td-assignee" style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:4px;">Assignee</label>
              <input type="text" id="td-assignee" class="form-control" value="${RenderEngine.escapeHTML(USER_IDENTITY.name)} (Owner)" readonly style="width:100%; opacity:0.85;">
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:16px;">
              <button class="btn btn-danger" onclick="TaskFlowApp.deleteTask('${task.id}')">Delete</button>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-secondary" onclick="TaskFlowApp.closeOverlay()">Cancel</button>
                <button class="btn btn-primary" onclick="TaskFlowApp.saveTaskDetail()">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    saveTaskDetail: function () {
      // Defensive validation per the audit's Edit Task hardening requirements:
      // activeTaskId and the task itself must exist, required fields must be
      // present, and invalid status/priority/date values are rejected rather
      // than silently corrupting the task or throwing.
      if (!AppState.activeTaskId) {
        showToast('No task is currently open to save.', 'error');
        this.closeOverlay();
        return;
      }

      const task = AppState.data.tasks.find(t => t.id === AppState.activeTaskId);
      if (!task) {
        showToast('This task no longer exists — it may have been deleted elsewhere.', 'error');
        this.closeOverlay();
        return;
      }

      const titleVal = document.getElementById('td-title')?.value.trim();
      if (!titleVal) {
        showToast('Task title cannot be empty.', 'error');
        return;
      }

      const statusVal = document.getElementById('td-status')?.value;
      const priorityVal = document.getElementById('td-priority')?.value;
      const dueDateVal = document.getElementById('td-due-date')?.value;
      const descriptionVal = document.getElementById('td-description')?.value ?? '';

      if (statusVal && !STATUSES.includes(statusVal)) {
        showToast('Invalid status selected.', 'error');
        return;
      }
      if (priorityVal && !PRIORITIES.includes(priorityVal)) {
        showToast('Invalid priority selected.', 'error');
        return;
      }
      if (dueDateVal && Number.isNaN(new Date(dueDateVal).getTime())) {
        showToast('Invalid due date — please pick a valid date.', 'error');
        return;
      }

      const oldStatus = task.status;
      const newStatus = statusVal || task.status;
      const isDoneNow = TaskFlowStats ? TaskFlowStats.normalizeStatus(newStatus) === 'done' : newStatus === 'Done';

      task.title = titleVal;
      task.description = descriptionVal;
      task.status = newStatus;
      task.priority = priorityVal || task.priority;
      task.projectId = document.getElementById('td-project')?.value || task.projectId;
      task.dueDate = dueDateVal || task.dueDate;
      task.updatedAt = new Date().toISOString();

      if (isDoneNow) {
        if (!task.completedAt) task.completedAt = new Date().toISOString();
      } else {
        task.completedAt = null;
      }

      if (oldStatus !== task.status) {
        AppState.logActivity(`updated ${task.id} status to ${task.status}`);
      } else {
        AppState.logActivity(`updated details for ${task.id}`);
      }

      AppState.save();
      this.closeOverlay();
      showToast('Task saved successfully', 'success');
    },

    deleteTask: function (taskId) {
      showConfirm('Delete Task', 'Delete this task permanently?', () => {
        const t = AppState.data.tasks.find(item => item.id === taskId);
        AppState.data.tasks = AppState.data.tasks.filter(item => item.id !== taskId);
        AppState.logActivity(`deleted task ${taskId} "${t ? t.title : ''}"`);
        AppState.save();
        this.closeOverlay();
        showToast('Task deleted permanently', 'warning');
      });
    },

    restoreTask: function (taskId) {
      const t = AppState.data.tasks.find(item => item.id === taskId);
      if (t) {
        t.isArchived = false;
        t.updatedAt = new Date().toISOString();
        AppState.logActivity(`restored task ${taskId}`);
        AppState.save();
        showToast('Task restored!', 'success');
      }
    },

    handleKanbanDrop: function (e, newStatus) {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      if (taskId && newStatus) {
        const t = AppState.data.tasks.find(item => item.id === taskId);
        if (t && t.status !== newStatus) {
          t.status = newStatus;
          t.updatedAt = new Date().toISOString();
          if (TaskFlowStats.normalizeStatus(newStatus) === 'done') {
            if (!t.completedAt) t.completedAt = new Date().toISOString();
          } else {
            t.completedAt = null;
          }
          AppState.logActivity(`moved ${t.id} to ${newStatus}`);
          AppState.save();
          showToast(`Task moved to ${newStatus}`, 'success');
        }
      }
    },

    openCommandPalette: function () {
      const root = document.getElementById('overlay-root');
      if (!root) return;

      root.innerHTML = `
        <div class="modal-backdrop" style="align-items:flex-start; padding-top:60px;">
          <div class="modal-card">
            <input type="text" id="cmd-input" class="form-control" placeholder="Search tasks, projects, or routes..." style="width:100%; font-size:1.05rem; padding:10px 14px; margin-bottom:12px;" autofocus>
            <div id="cmd-list" style="max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:4px;"></div>
          </div>
        </div>
      `;

      const input = document.getElementById('cmd-input');
      const list = document.getElementById('cmd-list');
      input?.focus();

      const renderResults = (q = '') => {
        const tasks = TaskFlowStats.getActiveTasks(AppState.data.tasks).filter(t => t.title.toLowerCase().includes(q.toLowerCase()) || t.id.toLowerCase().includes(q.toLowerCase()));
        list.innerHTML = `
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); padding:4px 8px;">NAVIGATION</div>
          <div style="padding:8px 12px; border-radius:6px; cursor:pointer;" onclick="location.hash='#dashboard'; TaskFlowApp.closeOverlay();">Go to Dashboard</div>
          <div style="padding:8px 12px; border-radius:6px; cursor:pointer;" onclick="location.hash='#tasks'; TaskFlowApp.closeOverlay();">Go to My Tasks</div>
          <div style="padding:8px 12px; border-radius:6px; cursor:pointer;" onclick="location.hash='#kanban'; TaskFlowApp.closeOverlay();">Go to Kanban Board</div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); padding:4px 8px; margin-top:8px;">TASKS (${tasks.length})</div>
          ${tasks.map(t => `<div style="padding:8px 12px; border-radius:6px; cursor:pointer;" onclick="TaskFlowApp.openTaskDetail('${t.id}'); TaskFlowApp.closeOverlay();">${RenderEngine.escapeHTML(t.title)} <span style="color:var(--text-muted); font-size:0.75rem;">(${t.status})</span></div>`).join('')}
        `;
      };

      renderResults();
      input.oninput = () => renderResults(input.value);
    },

    closeOverlay: function () {
      const root = document.getElementById('overlay-root');
      if (root) root.innerHTML = '';
    },

    updateTasksSearch: function (q) {
      AppState.searchQuery = q;
      RenderEngine.renderTasksView(document.getElementById('app-content'));
    },

    setFilterStatus: function (val) {
      AppState.activeFilterStatus = val;
      RenderEngine.renderTasksView(document.getElementById('app-content'));
    },

    setFilterPriority: function (val) {
      AppState.activeFilterPriority = val;
      RenderEngine.renderTasksView(document.getElementById('app-content'));
    },

    setFilterProject: function (val) {
      AppState.activeFilterProject = val;
      RenderEngine.renderTasksView(document.getElementById('app-content'));
    },

    sortBy: function (col) {
      if (AppState.sortColumn === col) {
        AppState.sortOrder = AppState.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        AppState.sortColumn = col;
        AppState.sortOrder = 'asc';
      }
      RenderEngine.renderTasksView(document.getElementById('app-content'));
    },

    toggleSelectTask: function (taskId) {
      if (AppState.selectedTaskIds.has(taskId)) {
        AppState.selectedTaskIds.delete(taskId);
      } else {
        AppState.selectedTaskIds.add(taskId);
      }
      RenderEngine.renderTasksView(document.getElementById('app-content'));
    },

    toggleSelectAll: function (checked) {
      if (checked) {
        AppState.data.tasks.forEach(t => AppState.selectedTaskIds.add(t.id));
      } else {
        AppState.selectedTaskIds.clear();
      }
      RenderEngine.renderTasksView(document.getElementById('app-content'));
    },

    calendarToday: function () {
      AppState.currentCalendarDate = new Date();
      AppState.selectedCalendarDate = new Date().toISOString().split('T')[0];
      AppState.render();
    },

    calendarPrev: function () {
      AppState.currentCalendarDate.setMonth(AppState.currentCalendarDate.getMonth() - 1);
      AppState.render();
    },

    calendarNext: function () {
      AppState.currentCalendarDate.setMonth(AppState.currentCalendarDate.getMonth() + 1);
      AppState.render();
    },

    changeTheme: function (theme) {
      RenderEngine.applyTheme(theme);
      showToast(`Theme changed to ${theme}`, 'info');
    },

    exportJSON: function () {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.data, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showToast('Workspace backup exported successfully', 'success');
    },

    importJSON: function (event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.tasks && parsed.projects) {
            AppState.data = parsed;
            AppState.save();
            showToast('Backup imported successfully!', 'success');
          } else {
            showToast('Invalid backup JSON format', 'error');
          }
        } catch (err) {
          showToast('Failed to parse JSON backup', 'error');
        }
      };
      reader.readAsText(file);
    },

    resetDemoData: function () {
      showConfirm('Reset Demo Data', 'Restore workspace to initial demo state?', () => {
        AppState.data = TaskFlowStore.resetData();
        AppState.save();
        showToast('Demo data restored!', 'info');
      });
    },

    markAllNotificationsRead: function () {
      AppState.data.notifications.forEach(n => n.read = true);
      AppState.save();
      showToast('All notifications marked as read', 'info');
    }
  };

  // ==========================================================================
  // 8. DEVELOPMENT DIAGNOSTICS & SUITE (runStatisticsTests)
  // ==========================================================================
  // The actual assertions live in js/statistics.js (TaskFlowStats.runStatisticsTests),
  // right next to the code they test. This is a thin, backward-compatible wrapper
  // so existing UI hooks (e.g. the "Run Diagnostics" button) keep working, and it
  // now also exercises validation/migration and description handling.
  window.runStatisticsTests = function () {
    let statsOk = true;
    if (TaskFlowStats && typeof TaskFlowStats.runStatisticsTests === 'function') {
      statsOk = TaskFlowStats.runStatisticsTests();
    } else {
      console.error('[TaskFlow Diagnostics] TaskFlowStats.runStatisticsTests is unavailable.');
      statsOk = false;
    }

    console.log('%c[TaskFlow Diagnostics] Running data-integrity tests...', 'color: #8B5CF6; font-weight: bold;');

    // Missing/invalid collections should recover to safe defaults, not throw.
    const normalizedEmpty = normalizeAppData({});
    console.assert(Array.isArray(normalizedEmpty.tasks) && Array.isArray(normalizedEmpty.projects), 'Test 9 Failed: normalizeAppData should fill missing collections');

    // Malformed task objects should be dropped, not crash the normalizer.
    const normalizedMalformed = normalizeAppData({ tasks: [{ title: 'no id or status' }, null, 'not an object'], projects: [] });
    console.assert(Array.isArray(normalizedMalformed.tasks), 'Test 10 Failed: normalizeAppData should tolerate malformed task entries');

    // task.description should round-trip through normalization untouched when valid.
    const normalizedDesc = normalizeAppData({ tasks: [{ id: 'T-1', title: 'x', status: 'Todo', priority: 'Low', description: 'hello' }], projects: [] });
    console.assert(normalizedDesc.tasks[0].description === 'hello', 'Test 11 Failed: task.description should be preserved by normalizeAppData');

    const allPassed = statsOk;
    console.log(allPassed
      ? '%c[TaskFlow Diagnostics] ALL TESTS PASSED SUCCESSFULLY! 🚀'
      : '%c[TaskFlow Diagnostics] SOME TESTS FAILED — see console assertions above.',
      allPassed ? 'color: #10B981; font-weight: bold;' : 'color: #EF4444; font-weight: bold;');
    showToast(allPassed ? 'Diagnostics passed! Check browser console for output.' : 'Diagnostics found issues — check the console.', allPassed ? 'success' : 'warning');
    return allPassed;
  };

  // ==========================================================================
  // 9. TOAST & CONFIRMATION UTILITIES
  // ==========================================================================
  // showToast is declared (hoisted) near the top of this file so it can be used
  // safely during the initial synchronous data load. Just expose it globally here.
  window.showToast = showToast;

  window.showConfirm = function (title, message, onConfirm) {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const root = document.getElementById('overlay-root');
    if (!root) return;

    root.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card" style="max-width:420px;">
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:8px;">${title}</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:20px;">${message}</p>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-secondary" onclick="TaskFlowApp.closeOverlay()">Cancel</button>
            <button class="btn btn-danger" id="confirm-btn-action">Confirm</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('confirm-btn-action').onclick = () => {
      TaskFlowApp.closeOverlay();
      if (onConfirm) onConfirm();
    };
  };

  // Expose Global Controller
  window.TaskFlowApp = TaskFlowApp;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      TaskFlowApp.init();
    });
  }

})();
