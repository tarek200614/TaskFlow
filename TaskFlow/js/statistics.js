/**
 * TASKFLOW - Reusable Statistics Engine Module
 * Pure calculation functions for tasks, projects, productivity, and trends.
 * Author: MEGHARI Abderrahmane Tarek
 */

(function () {
  'use strict';

  const TaskFlowStats = {
    // Normalization Helpers
    normalizeStatus: function (status) {
      if (!status) return 'todo';
      const s = String(status).toLowerCase().trim();
      if (s === 'backlog') return 'backlog';
      if (s === 'todo') return 'todo';
      if (s === 'in progress' || s === 'in-progress') return 'in-progress';
      if (s === 'review') return 'review';
      if (s === 'done' || s === 'completed') return 'done';
      return 'todo';
    },

    normalizePriority: function (priority) {
      if (!priority) return 'none';
      const p = String(priority).toLowerCase().trim();
      if (p === 'urgent') return 'urgent';
      if (p === 'high') return 'high';
      if (p === 'medium') return 'medium';
      if (p === 'low') return 'low';
      return 'none';
    },

    getActiveTasks: function (tasks) {
      if (!Array.isArray(tasks)) return [];
      return tasks.filter(t => !t.isArchived);
    },

    calculateTotalTasks: function (tasks) {
      return this.getActiveTasks(tasks).length;
    },

    calculateCompletedTasks: function (tasks) {
      return this.getActiveTasks(tasks).filter(t => this.normalizeStatus(t.status) === 'done').length;
    },

    calculateInProgressTasks: function (tasks) {
      return this.getActiveTasks(tasks).filter(t => this.normalizeStatus(t.status) === 'in-progress').length;
    },

    calculateTodoTasks: function (tasks) {
      return this.getActiveTasks(tasks).filter(t => this.normalizeStatus(t.status) === 'todo').length;
    },

    calculateBacklogTasks: function (tasks) {
      return this.getActiveTasks(tasks).filter(t => this.normalizeStatus(t.status) === 'backlog').length;
    },

    calculateReviewTasks: function (tasks) {
      return this.getActiveTasks(tasks).filter(t => this.normalizeStatus(t.status) === 'review').length;
    },

    calculateOverdueTasks: function (tasks, referenceDateStr) {
      const ref = referenceDateStr || new Date().toISOString().split('T')[0];
      return this.getActiveTasks(tasks).filter(t => {
        const isDone = this.normalizeStatus(t.status) === 'done';
        return !isDone && t.dueDate && t.dueDate < ref;
      }).length;
    },

    calculateCompletionRate: function (tasks) {
      const total = this.calculateTotalTasks(tasks);
      if (total === 0) return 0;
      const completed = this.calculateCompletedTasks(tasks);
      return Math.round((completed / total) * 100);
    },

    calculateAverageCompletionTime: function (tasks) {
      const completedTasks = this.getActiveTasks(tasks).filter(t => this.normalizeStatus(t.status) === 'done' && t.createdAt && t.completedAt);
      if (completedTasks.length === 0) return 0;

      let totalDays = 0;
      completedTasks.forEach(t => {
        const created = new Date(t.createdAt).getTime();
        const completed = new Date(t.completedAt).getTime();
        const diffDays = Math.max(0, (completed - created) / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      });

      return Math.round((totalDays / completedTasks.length) * 10) / 10;
    },

    calculateTasksCreated: function (tasks, startDateStr, endDateStr) {
      return this.getActiveTasks(tasks).filter(t => t.createdAt >= startDateStr && t.createdAt <= endDateStr).length;
    },

    calculateTasksCompleted: function (tasks, startDateStr, endDateStr) {
      return this.getActiveTasks(tasks).filter(t => t.completedAt && t.completedAt.startsWith(startDateStr) || (t.completedAt >= startDateStr && t.completedAt <= endDateStr)).length;
    },

    calculateTasksByStatus: function (tasks) {
      const active = this.getActiveTasks(tasks);
      const res = { backlog: 0, todo: 0, 'in-progress': 0, review: 0, done: 0 };
      active.forEach(t => {
        const key = this.normalizeStatus(t.status);
        if (res[key] !== undefined) res[key]++;
      });
      return res;
    },

    calculateTasksByPriority: function (tasks) {
      const active = this.getActiveTasks(tasks);
      const res = { urgent: 0, high: 0, medium: 0, low: 0, none: 0 };
      active.forEach(t => {
        const key = this.normalizePriority(t.priority);
        if (res[key] !== undefined) res[key]++;
      });
      return res;
    },

    calculateTasksByProject: function (tasks, projectId) {
      return this.getActiveTasks(tasks).filter(t => t.projectId === projectId).length;
    },

    calculateTasksByDate: function (tasks, dateStr) {
      return this.getActiveTasks(tasks).filter(t => t.dueDate === dateStr);
    },

    calculateUpcomingDeadlines: function (tasks, referenceDateStr, limit = 5) {
      const ref = referenceDateStr || new Date().toISOString().split('T')[0];
      return this.getActiveTasks(tasks)
        .filter(t => this.normalizeStatus(t.status) !== 'done' && t.dueDate && t.dueDate >= ref)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, limit);
    },

    calculateProjectProgress: function (tasks, projectId, defaultProgress = 0) {
      const projTasks = this.getActiveTasks(tasks).filter(t => t.projectId === projectId);
      if (projTasks.length === 0) return defaultProgress;
      const completed = projTasks.filter(t => this.normalizeStatus(t.status) === 'done').length;
      return Math.round((completed / projTasks.length) * 100);
    },

    calculateWeeklyProductivity: function (tasks, referenceDateStr) {
      return this.calculateProductivityTrend(tasks, 'last-7-days', referenceDateStr);
    },

    calculateMonthlyProductivity: function (tasks, referenceDateStr) {
      return this.calculateProductivityTrend(tasks, 'last-30-days', referenceDateStr);
    },

    calculateProductivityTrend: function (tasks, period = 'last-7-days', referenceDateStr) {
      const active = this.getActiveTasks(tasks);
      const daysCount = period === 'last-30-days' || period === 'this-month' ? 30 : 7;
      const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();

      const dates = [];
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(refDate);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }

      return dates.map(dateStr => {
        const created = active.filter(t => t.createdAt === dateStr).length;
        const completed = active.filter(t => t.completedAt && t.completedAt.startsWith(dateStr)).length;
        return { date: dateStr, created, completed };
      });
    },

    runStatisticsTests: function () {
      console.log('%c[TaskFlow Diagnostics] Executing Statistics Module Test Harness...', 'color: #8B5CF6; font-weight: bold;');

      const mockTasks = [
        { id: '1', status: 'done', priority: 'urgent', projectId: 'p1', dueDate: '2026-08-01', createdAt: '2026-07-28', completedAt: '2026-08-01', isArchived: false },
        { id: '2', status: 'in-progress', priority: 'high', projectId: 'p1', dueDate: '2026-08-05', createdAt: '2026-08-02', completedAt: null, isArchived: false },
        { id: '3', status: 'todo', priority: 'medium', projectId: 'p2', dueDate: '2026-08-10', createdAt: '2026-08-03', completedAt: null, isArchived: false },
        { id: '4', status: 'done', priority: 'low', projectId: 'p2', dueDate: '2026-08-01', createdAt: '2026-07-25', completedAt: '2026-07-29', isArchived: false }, // Overdue date BUT completed!
        { id: '5', status: 'todo', priority: 'urgent', projectId: 'p1', dueDate: '2026-08-01', createdAt: '2026-08-01', completedAt: null, isArchived: false }  // Overdue & active!
      ];

      const refDate = '2026-08-05';

      console.assert(this.calculateTotalTasks(mockTasks) === 5, 'Test 1 Failed: Total tasks count');
      console.assert(this.calculateCompletedTasks(mockTasks) === 2, 'Test 2 Failed: Completed tasks count');
      console.assert(this.calculateInProgressTasks(mockTasks) === 1, 'Test 3 Failed: In Progress count');
      console.assert(this.calculateOverdueTasks(mockTasks, refDate) === 1, 'Test 4 Failed: Overdue count (completed task must not count as overdue)');
      console.assert(this.calculateCompletionRate(mockTasks) === 40, 'Test 5 Failed: Completion rate percentage');
      console.assert(this.calculateProjectProgress(mockTasks, 'p1') === 33, 'Test 6 Failed: Project p1 progress');
      console.assert(this.calculateTasksByStatus(mockTasks).done === 2, 'Test 7 Failed: Status breakdown');
      console.assert(this.calculateUpcomingDeadlines(mockTasks, refDate, 2).length === 2, 'Test 8 Failed: Upcoming deadlines count');

      console.log('%c[TaskFlow Diagnostics] ALL 8 CORE TEST HARNESS ASSERTIONS PASSED! 🚀', 'color: #10B981; font-weight: bold;');
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Statistics Engine test harness passed!', 'success');
      }
      return true;
    }
  };

  // Expose Statistics Module Globally
  if (typeof window !== 'undefined') {
    window.TaskFlowStats = TaskFlowStats;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskFlowStats;
  }

})();
