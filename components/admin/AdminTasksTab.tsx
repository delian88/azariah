import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckSquare,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Folder,
  Mail,
  Send,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowRight,
  ExternalLink,
  Kanban,
  List,
  Sparkles,
  HelpCircle,
  Shield,
  FileText
} from 'lucide-react';
import {
  developerService,
  DeveloperTask,
  TaskPriority,
  TaskStatus,
  TaskMetrics,
  Developer,
  Project,
  formatLocalDate
} from '../../services/developerService';

interface AdminTasksTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const PRIORITY_BADGES: Record<TaskPriority, { label: string; bg: string; text: string; border: string }> = {
  low: { label: 'Low', bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
  medium: { label: 'Medium', bg: 'bg-sky-950/60', text: 'text-sky-400', border: 'border-sky-800/60' },
  high: { label: 'High', bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/60' },
  urgent: { label: 'Urgent', bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-800/60' }
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; badgeBg: string; badgeText: string; dotColor: string }> = {
  pending: { label: 'Pending', badgeBg: 'bg-slate-800/90', badgeText: 'text-slate-300', dotColor: 'bg-slate-400' },
  in_progress: { label: 'In Progress', badgeBg: 'bg-sky-950/70', badgeText: 'text-sky-300', dotColor: 'bg-sky-400' },
  in_review: { label: 'In Review', badgeBg: 'bg-purple-950/70', badgeText: 'text-purple-300', dotColor: 'bg-purple-400' },
  completed: { label: 'Completed', badgeBg: 'bg-lime-950/70', badgeText: 'text-lime-300', dotColor: 'bg-lime-400' },
  blocked: { label: 'Blocked', badgeBg: 'bg-rose-950/70', badgeText: 'text-rose-300', dotColor: 'bg-rose-400' }
};

export const AdminTasksTab: React.FC<AdminTasksTabProps> = ({ showToast }) => {
  // Data State
  const [tasks, setTasks] = useState<DeveloperTask[]>([]);
  const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filters State
  const [search, setSearch] = useState('');
  const [developerFilter, setDeveloperFilter] = useState<number | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DeveloperTask | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDeveloperId, setFormDeveloperId] = useState<number | ''>('');
  const [formProjectId, setFormProjectId] = useState<number | ''>('');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formStatus, setFormStatus] = useState<TaskStatus>('pending');
  const [formDueDate, setFormDueDate] = useState('');
  const [formEstimatedHours, setFormEstimatedHours] = useState<number | ''>(4);
  const [formActualHours, setFormActualHours] = useState<number | ''>(0);
  const [formNotes, setFormNotes] = useState('');
  const [formSendEmail, setFormSendEmail] = useState(true);

  // Quick Action Loading States
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [resendingEmailId, setResendingEmailId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // Selected Task Detail Drawer
  const [detailTask, setDetailTask] = useState<DeveloperTask | null>(null);

  // ---------------------------------------------------------------------------
  // Load Tasks & Relations
  // ---------------------------------------------------------------------------
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [tasksRes, statsRes, devsRes, projsRes] = await Promise.all([
        developerService.adminGetTasks({
          developerId: developerFilter !== 'all' ? developerFilter : undefined,
          projectId: projectFilter !== 'all' ? projectFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          search: search.trim() || undefined
        }),
        developerService.adminGetTaskStats(),
        developerService.adminGetDevelopers(),
        developerService.adminGetProjects()
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.tasks || []);
      } else {
        showToast(tasksRes.error || 'Failed to fetch tasks', 'error');
      }

      if (statsRes.success && statsRes.metrics) {
        setMetrics(statsRes.metrics);
      }

      if (devsRes.success) {
        setDevelopers(devsRes.developers || []);
      }

      if (projsRes.success) {
        setProjects(projsRes.projects || []);
      }
    } catch (e: any) {
      showToast(e.message || 'Error communicating with task API', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [developerFilter, projectFilter, statusFilter, priorityFilter, search, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------------------------------------------------------------------
  // Open Create Modal
  // ---------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormDeveloperId(developers.length > 0 ? developers[0].id : '');
    setFormProjectId('');
    setFormPriority('medium');
    setFormStatus('pending');
    setFormDueDate('');
    setFormEstimatedHours(4);
    setFormActualHours(0);
    setFormNotes('');
    setFormSendEmail(true);
    setModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Open Edit Modal
  // ---------------------------------------------------------------------------
  const handleOpenEditModal = (task: DeveloperTask) => {
    setEditingTask(task);
    setFormTitle(task.title || '');
    setFormDescription(task.description || '');
    setFormDeveloperId(task.developerId || '');
    setFormProjectId(task.projectId || '');
    setFormPriority(task.priority || 'medium');
    setFormStatus(task.status || 'pending');
    setFormDueDate(task.dueDate || '');
    setFormEstimatedHours(task.estimatedHours || 0);
    setFormActualHours(task.actualHours || 0);
    setFormNotes(task.notes || '');
    setFormSendEmail(false);
    setModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Save Task (Create or Update)
  // ---------------------------------------------------------------------------
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Task title is required', 'error');
      return;
    }
    if (!formDeveloperId) {
      showToast('Please select a developer to assign this task to', 'error');
      return;
    }

    setModalSaving(true);

    if (editingTask) {
      // Update
      const res = await developerService.adminUpdateTask(editingTask.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        developerId: Number(formDeveloperId),
        projectId: formProjectId ? Number(formProjectId) : null,
        priority: formPriority,
        status: formStatus,
        dueDate: formDueDate || null,
        estimatedHours: Number(formEstimatedHours) || 0,
        actualHours: Number(formActualHours) || 0,
        notes: formNotes.trim(),
        sendEmail: formSendEmail
      });

      setModalSaving(false);
      if (res.success) {
        showToast(res.message || 'Task updated successfully');
        setModalOpen(false);
        loadData(true);
      } else {
        showToast(res.error || 'Failed to update task', 'error');
      }
    } else {
      // Create
      const res = await developerService.adminCreateTask({
        title: formTitle.trim(),
        description: formDescription.trim(),
        developerId: Number(formDeveloperId),
        projectId: formProjectId ? Number(formProjectId) : null,
        priority: formPriority,
        status: formStatus,
        dueDate: formDueDate || null,
        estimatedHours: Number(formEstimatedHours) || 0,
        sendEmail: formSendEmail
      });

      setModalSaving(false);
      if (res.success) {
        showToast(res.message || 'Task created and assigned successfully');
        setModalOpen(false);
        loadData(true);
      } else {
        showToast(res.error || 'Failed to create task', 'error');
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Quick Status Change (Inline or Kanban)
  // ---------------------------------------------------------------------------
  const handleQuickStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    setUpdatingTaskId(taskId);
    try {
      const res = await developerService.adminUpdateTask(taskId, {
        status: newStatus
      });
      if (res.success) {
        showToast(`Task status updated to ${STATUS_CONFIG[newStatus].label}`);
        // Optimistic update in UI
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        loadData(true);
      } else {
        showToast(res.error || 'Failed to update status', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Network error updating status', 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Resend Email Confirmation
  // ---------------------------------------------------------------------------
  const handleResendEmail = async (taskId: number) => {
    setResendingEmailId(taskId);
    try {
      const res = await developerService.adminResendTaskEmail(taskId);
      if (res.success) {
        showToast(res.message || 'Task assignment email dispatched successfully');
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, emailNotified: 1 } : t));
      } else {
        showToast(res.error || 'Failed to send assignment email', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error dispatching task email', 'error');
    } finally {
      setResendingEmailId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete Task
  // ---------------------------------------------------------------------------
  const handleDeleteTask = async (task: DeveloperTask) => {
    if (!confirm(`Are you sure you want to permanently delete task "${task.title}"?`)) {
      return;
    }
    setDeletingTaskId(task.id);
    try {
      const res = await developerService.adminDeleteTask(task.id);
      if (res.success) {
        showToast(res.message || 'Task deleted');
        setTasks(prev => prev.filter(t => t.id !== task.id));
        if (detailTask?.id === task.id) setDetailTask(null);
        loadData(true);
      } else {
        showToast(res.error || 'Failed to delete task', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error deleting task', 'error');
    } finally {
      setDeletingTaskId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* ===================================================================== */}
      {/* 1. HEADER & KPI CARDS                                                 */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lime-500/10 border border-lime-500/20 rounded-sm">
              <CheckSquare className="w-5 h-5 text-lime-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Task Management & Assignments
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Create and assign engineering tasks to developers, trigger automated email confirmations, and track live status and execution hours in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="p-2 sm:px-3 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-sm text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            title="Refresh Tasks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-lime-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-lime-500/20 active:translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create & Assign Task</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total Tasks */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Tasks</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{metrics.total}</div>
            <div className="text-[10px] text-slate-500 mt-1">
              Est: <span className="text-sky-400 font-bold">{metrics.totalEstimatedHours.toFixed(1)}h</span> &bull; Actual: <span className="text-lime-400 font-bold">{metrics.totalActualHours.toFixed(1)}h</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-slate-900/90 border border-sky-900/30 rounded-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-sky-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-300 font-mono">{metrics.in_progress}</div>
            <div className="text-[10px] text-sky-500/80 mt-1">Currently being worked on</div>
          </div>

          {/* In Review */}
          <div className="bg-slate-900/90 border border-purple-900/30 rounded-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">In Review</span>
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">{metrics.in_review}</div>
            <div className="text-[10px] text-purple-500/80 mt-1">Ready for verification</div>
          </div>

          {/* Completed */}
          <div className="bg-slate-900/90 border border-lime-900/30 rounded-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-lime-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
            </div>
            <div className="text-2xl font-black text-lime-300 font-mono">{metrics.completed}</div>
            <div className="text-[10px] text-lime-500/80 mt-1">
              {metrics.total > 0 ? `${Math.round((metrics.completed / metrics.total) * 100)}% completion rate` : '0%'}
            </div>
          </div>

          {/* Urgent Backlog */}
          <div className="col-span-2 lg:col-span-1 bg-slate-900/90 border border-red-900/30 rounded-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-red-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Urgent Attention</span>
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400 font-mono">{metrics.urgent}</div>
            <div className="text-[10px] text-red-400/80 mt-1">
              {metrics.blocked > 0 ? `${metrics.blocked} blocked tasks` : 'No blocked issues'}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. FILTER & VIEW CONTROLS TOOLBAR                                     */}
      {/* ===================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title, scope, developer, or project..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-sm self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-lime-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List / Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-slate-800 text-lime-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80">
          {/* Filter: Developer */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Developer
            </label>
            <select
              value={developerFilter}
              onChange={(e) => setDeveloperFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
            >
              <option value="all">All Developers ({developers.length})</option>
              {developers.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.roleTitle})</option>
              ))}
            </select>
          </div>

          {/* Filter: Project */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Project
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Filter: Status */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Filter: Priority */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. TASK CONTENT VIEWS (TABLE OR KANBAN)                               */}
      {/* ===================================================================== */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-sm">
          <RefreshCw className="w-7 h-7 text-lime-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Loading Engineering Tasks...
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-sm p-6">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Tasks Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {search || developerFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No tasks match your current filter parameters. Try clearing some filters or searching with different keywords.'
                : 'No engineering tasks have been created yet. Click "Create & Assign Task" to assign your first task to a developer with automated email notification.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Create New Task
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ------------------------------------------------------------------- */
        /* TABLE / LIST VIEW                                                   */
        /* ------------------------------------------------------------------- */
        <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Task & Scope</th>
                  <th className="py-3 px-4">Assigned Developer</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status & Quick Change</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Hours (Est / Act)</th>
                  <th className="py-3 px-4 text-center">Email</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {tasks.map((task) => {
                  const pBadge = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium;
                  const sBadge = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                  const isUpdating = updatingTaskId === task.id;
                  const isResending = resendingEmailId === task.id;
                  const isDeleting = deletingTaskId === task.id;

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Task Title & Description Excerpt */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <button
                          type="button"
                          onClick={() => setDetailTask(task)}
                          className="font-bold text-white hover:text-lime-400 text-left transition-colors flex items-center gap-1.5"
                        >
                          <span className="truncate">{task.title}</span>
                          <ChevronRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </td>

                      {/* Developer Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-[11px] text-lime-400">
                            {task.developerName ? task.developerName.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200">
                              {task.developerName || `Dev #${task.developerId}`}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {task.developerRole || task.developerEmail || 'Developer'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {task.projectName ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[11px] font-bold text-slate-300">
                            <Folder className="w-3 h-3 text-sky-400" />
                            {task.projectName}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">General</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                          {pBadge.label}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            disabled={isUpdating}
                            value={task.status}
                            onChange={(e) => handleQuickStatusChange(task.id, e.target.value as TaskStatus)}
                            className={`pl-2 pr-6 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer appearance-none ${sBadge.badgeBg} ${sBadge.badgeText} border-slate-700 focus:outline-none focus:border-lime-500`}
                          >
                            <option value="pending" className="bg-slate-900 text-white">Pending</option>
                            <option value="in_progress" className="bg-slate-900 text-white">In Progress</option>
                            <option value="in_review" className="bg-slate-900 text-white">In Review</option>
                            <option value="completed" className="bg-slate-900 text-white">Completed</option>
                            <option value="blocked" className="bg-slate-900 text-white">Blocked</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 text-[11px]">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{formatLocalDate(task.dueDate)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Hours: Estimated vs Actual */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <span className="text-lime-400 font-bold">{Number(task.actualHours || 0).toFixed(1)}h</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-sky-300">{Number(task.estimatedHours || 0).toFixed(1)}h</span>
                      </td>

                      {/* Email Status & Resend */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        {Boolean(task.emailNotified) ? (
                          <button
                            type="button"
                            onClick={() => handleResendEmail(task.id)}
                            disabled={isResending}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-lime-950/40 text-lime-400 border border-lime-800/40 rounded text-[10px] font-bold hover:bg-lime-900/60 transition-colors"
                            title="Email dispatched. Click to resend confirmation."
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {isResending ? 'Sending...' : 'Notified'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleResendEmail(task.id)}
                            disabled={isResending}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[10px] font-bold hover:text-white hover:border-slate-600 transition-colors"
                            title="Click to dispatch task email confirmation"
                          >
                            <Mail className="w-3 h-3 text-slate-400" />
                            {isResending ? 'Sending...' : 'Send Email'}
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(task)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                            title="Edit Task Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task)}
                            disabled={isDeleting}
                            className="p-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-900/40 rounded transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------------- */
        /* KANBAN BOARD VIEW                                                   */
        /* ------------------------------------------------------------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {(['pending', 'in_progress', 'in_review', 'blocked', 'completed'] as TaskStatus[]).map((colStatus) => {
            const colConfig = STATUS_CONFIG[colStatus];
            const colTasks = tasks.filter(t => t.status === colStatus);

            return (
              <div
                key={colStatus}
                className="bg-slate-900 border border-slate-800 rounded-sm flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${colConfig.dotColor}`}></span>
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {colConfig.label}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black font-mono bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Card List */}
                <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto max-h-[700px] custom-scrollbar">
                  {colTasks.length === 0 ? (
                    <div className="py-12 text-center text-slate-600 text-xs italic">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const pBadge = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium;

                      return (
                        <div
                          key={task.id}
                          className="bg-slate-950 border border-slate-800/90 hover:border-slate-700 rounded-sm p-3 space-y-2.5 shadow-sm transition-all hover:shadow-md group"
                        >
                          {/* Priority & Project Header */}
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                              {pBadge.label}
                            </span>
                            {task.projectName && (
                              <span className="text-[10px] font-bold text-sky-400 truncate max-w-[120px]">
                                {task.projectName}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4
                            onClick={() => setDetailTask(task)}
                            className="text-xs font-bold text-white hover:text-lime-400 cursor-pointer line-clamp-2 transition-colors"
                          >
                            {task.title}
                          </h4>

                          {/* Developer & Hours */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-400">
                            <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                              <User className="w-3 h-3 text-slate-500" />
                              <span className="truncate text-slate-300">{task.developerName || 'Dev'}</span>
                            </div>
                            <div className="font-mono text-slate-400">
                              <span className="text-lime-400 font-bold">{Number(task.actualHours || 0).toFixed(1)}</span> / {Number(task.estimatedHours || 0).toFixed(1)}h
                            </div>
                          </div>

                          {/* Quick Workflow Action Mover */}
                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-1 text-[10px]">
                            {colStatus !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(task.id, 'completed')}
                                className="px-2 py-0.5 bg-lime-950/40 hover:bg-lime-900/60 text-lime-400 border border-lime-800/40 rounded transition-colors font-bold flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </button>
                            )}

                            {colStatus === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(task.id, 'in_progress')}
                                className="px-2 py-0.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-400 border border-sky-800/40 rounded transition-colors font-bold ml-auto"
                              >
                                Start &rarr;
                              </button>
                            )}

                            {colStatus === 'in_progress' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(task.id, 'in_review')}
                                className="px-2 py-0.5 bg-purple-950/40 hover:bg-purple-900/60 text-purple-400 border border-purple-800/40 rounded transition-colors font-bold ml-auto"
                              >
                                Review &rarr;
                              </button>
                            )}

                            {colStatus === 'in_review' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(task.id, 'in_progress')}
                                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors font-bold"
                              >
                                &larr; Revise
                              </button>
                            )}

                            {colStatus === 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(task.id, 'in_progress')}
                                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors font-bold ml-auto"
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. CREATE / EDIT TASK MODAL                                           */}
      {/* ===================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-sm shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-lime-500/10 border border-lime-500/20 rounded">
                  <CheckSquare className="w-5 h-5 text-lime-400" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  {editingTask ? `Edit Task #${editingTask.id}` : 'Create & Assign New Task'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Task Title <span className="text-lime-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Implement OAuth SSO Integration and Audit Security Logs"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none"
                />
              </div>

              {/* Developer & Project Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Developer */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Assign To Developer <span className="text-lime-400">*</span>
                  </label>
                  <select
                    required
                    value={formDeveloperId}
                    onChange={(e) => setFormDeveloperId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none"
                  >
                    <option value="" disabled>Select Developer...</option>
                    {developers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.roleTitle}) — {d.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Associated Project
                  </label>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none"
                  >
                    <option value="">General Assignment / No Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority, Status, Due Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Priority */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none font-bold"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">⚡ Urgent Priority</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Workflow Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none font-bold"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Hours Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Estimated Allocation (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formEstimatedHours}
                    onChange={(e) => setFormEstimatedHours(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none font-mono"
                    placeholder="4.0"
                  />
                </div>

                {editingTask && (
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                      Actual Hours Logged
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formActualHours}
                      onChange={(e) => setFormActualHours(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none font-mono"
                      placeholder="0.0"
                    />
                  </div>
                )}
              </div>

              {/* Scope & Description */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Scope of Work & Technical Requirements
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail the exact deliverables, requirements, endpoints, acceptance criteria, or branch names..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs leading-relaxed focus:border-lime-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Internal Admin / Dev Notes */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Internal Notes & Progress Log (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Status update notes, blockers, or PR links..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs leading-relaxed focus:border-lime-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Send Email Checkbox */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formSendEmail}
                    onChange={(e) => setFormSendEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-lime-500 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-lime-400" /> Send Email Confirmation to Developer
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Dispatches an automated branded assignment email containing task title, priority badge, due date, scope, and direct portal link.
                    </p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black uppercase text-xs tracking-wider rounded-sm flex items-center gap-2 transition-all shadow-lg shadow-lime-500/20 active:translate-y-0.5 disabled:opacity-50"
                >
                  {modalSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving Task...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {editingTask ? 'Save Changes' : 'Assign Task'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. TASK DETAIL DRAWER                                                 */}
      {/* ===================================================================== */}
      {detailTask && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${PRIORITY_BADGES[detailTask.priority].bg} ${PRIORITY_BADGES[detailTask.priority].text} ${PRIORITY_BADGES[detailTask.priority].border}`}>
                      {PRIORITY_BADGES[detailTask.priority].label} Priority
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${STATUS_CONFIG[detailTask.status].badgeBg} ${STATUS_CONFIG[detailTask.status].badgeText}`}>
                      {STATUS_CONFIG[detailTask.status].label}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white leading-snug">
                    {detailTask.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailTask(null)}
                  className="p-1 text-slate-400 hover:text-white text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Assignment Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-sm p-4 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Developer</span>
                  <span className="text-white font-bold">{detailTask.developerName || `Dev #${detailTask.developerId}`}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Project</span>
                  <span className="text-sky-400 font-bold">{detailTask.projectName || 'General Assignment'}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Due Date</span>
                  <span className="text-amber-400 font-bold">{detailTask.dueDate ? formatLocalDate(detailTask.dueDate) : 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Hours (Est / Actual)</span>
                  <span className="font-mono text-white font-bold">{detailTask.estimatedHours}h est / <span className="text-lime-400">{detailTask.actualHours}h actual</span></span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned By</span>
                  <span className="text-slate-300">{detailTask.assignedByAdminName || 'Admin'}</span>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Scope of Work & Description
                </h4>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-sm text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {detailTask.description || 'No detailed scope provided.'}
                </div>
              </div>

              {/* Notes */}
              {detailTask.notes && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Execution Notes & Progress Log
                  </h4>
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-sm text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {detailTask.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleResendEmail(detailTask.id)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
              >
                <Mail className="w-3.5 h-3.5 text-lime-400" />
                Resend Email Confirmation
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditModal(detailTask);
                    setDetailTask(null);
                  }}
                  className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 rounded-sm text-xs font-black uppercase tracking-wider"
                >
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasksTab;
