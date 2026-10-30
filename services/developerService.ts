import { getApiUrl } from '../context/ContentContext';

export interface Developer {
  id: number;
  name: string;
  email: string;
  roleTitle: string;
  hourlyRate: number;
  currency: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  emailConfirmed?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  projects?: {
    id: number;
    name: string;
    status: string;
    roleInProject?: string;
  }[];
  assignedProjectsCount?: number;
  totalHoursLogged?: number;
  isCurrentlyClockedIn?: boolean;
}

export interface Milestone {
  id?: number;
  projectId?: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  orderIndex?: number;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  description?: string;
  budget: number;
  currency: string;
  status: 'planning' | 'in_progress' | 'in_review' | 'launched' | 'on_hold';
  launchDate?: string;
  repoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  milestones?: Milestone[];
  developers?: {
    id: number;
    name: string;
    email: string;
    roleTitle: string;
    roleInProject?: string;
  }[];
  milestonesCount?: number;
  completedMilestonesCount?: number;
  progressPercent?: number;
  totalHoursLogged?: number;
}

export interface TimeLog {
  id: number;
  developerId: number;
  developerName?: string;
  developerEmail?: string;
  developerRole?: string;
  projectId?: number | null;
  projectName?: string;
  clockIn: string;
  clockOut?: string | null;
  totalMinutes: number;
  totalHours: number;
  taskSummary?: string;
  clientTimezone?: string;
  isActive?: boolean;
}

export interface TimeStatus {
  isClockedIn: boolean;
  activeSession?: {
    id: number;
    clockIn: string;
    projectId?: number | null;
    projectName?: string;
    elapsedMinutes: number;
    taskSummary?: string;
    clientTimezone?: string;
  } | null;
  metrics: {
    todayHours: number;
    todayMinutes: number;
    weeklyHours: number;
    weeklyMinutes: number;
    monthlyHours: number;
    monthlyMinutes: number;
    lifetimeHours: number;
  };
}

export interface Payslip {
  id: number;
  developerId: number;
  developerName?: string;
  developerEmail?: string;
  developerRole?: string;
  referenceNo: string;
  periodStart: string;
  periodEnd: string;
  hoursBilled: number;
  hourlyRate: number;
  bonus: number;
  deductions: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  notes?: string;
  status: 'issued' | 'confirmed';
  confirmedAt?: string | null;
  issuedAt: string;
  createdAt?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'in_review' | 'completed' | 'blocked';

export interface DeveloperTask {
  id: number;
  title: string;
  description?: string;
  developerId: number;
  developerName?: string;
  developerEmail?: string;
  developerRole?: string;
  projectId?: number | null;
  projectName?: string;
  projectSlug?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  estimatedHours: number;
  actualHours: number;
  assignedByAdminId?: number;
  assignedByAdminName?: string;
  completedAt?: string | null;
  notes?: string | null;
  emailNotified?: boolean | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskMetrics {
  total: number;
  pending: number;
  in_progress: number;
  in_review: number;
  completed: number;
  blocked: number;
  urgent: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}


// Helpers for auth headers
const getAdminHeaders = (): HeadersInit => {
  const token = localStorage.getItem('amg_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const getDeveloperToken = (): string | null => {
  return localStorage.getItem('amg_developer_token');
};

export const setDeveloperToken = (token: string, dev: Developer) => {
  localStorage.setItem('amg_developer_token', token);
  localStorage.setItem('amg_developer_user', JSON.stringify(dev));
};

export const clearDeveloperSession = () => {
  localStorage.removeItem('amg_developer_token');
  localStorage.removeItem('amg_developer_user');
};

export const getSavedDeveloperUser = (): Developer | null => {
  const saved = localStorage.getItem('amg_developer_user');
  try {
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getDevHeaders = (): HeadersInit => {
  const token = getDeveloperToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const developerService = {
  // ==========================================
  // DEVELOPER SELF-SERVICE PORTAL CALLS
  // ==========================================
  async devLogin(email: string, password: string): Promise<{ success: boolean; token?: string; developer?: Developer; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/developers/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Login network error' };
    }
  },

  async getDevProfile(): Promise<{ success: boolean; developer?: Developer; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/developers/me'), {
        headers: getDevHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async devClockIn(
    projectId?: number | null,
    notes?: string,
    clientTimestamp?: string,
    clientTimezone?: string
  ): Promise<{ success: boolean; message?: string; session?: any; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/timetracker/clock-in'), {
        method: 'POST',
        headers: getDevHeaders(),
        body: JSON.stringify({
          projectId,
          notes,
          clientTimestamp: clientTimestamp || new Date().toISOString(),
          clientTimezone: clientTimezone || (Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || 'UTC')
        })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async devClockOut(
    taskSummary?: string,
    clientTimestamp?: string,
    discard = false
  ): Promise<{ success: boolean; message?: string; summary?: any; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/timetracker/clock-out'), {
        method: 'POST',
        headers: getDevHeaders(),
        body: JSON.stringify({
          taskSummary,
          clientTimestamp: clientTimestamp || new Date().toISOString(),
          discard
        })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async getDevTimeStatus(): Promise<{ success: boolean; isClockedIn?: boolean; activeSession?: any; metrics?: TimeStatus['metrics']; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/timetracker/status'), {
        headers: getDevHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async getDevTimeHistory(limit = 100): Promise<{ success: boolean; logs?: TimeLog[]; error?: string }> {
    try {
      const res = await fetch(getApiUrl(`api/timetracker/my-history?limit=${limit}`), {
        headers: getDevHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async getDevAssignedProjects(): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/projects/assigned'), {
        headers: getDevHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async getDevPayslips(): Promise<{ success: boolean; payslips?: Payslip[]; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/payslips/my-payslips'), {
        headers: getDevHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async confirmPayslipPayment(payslipId: number): Promise<{ success: boolean; message?: string; confirmedAt?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/payslips/confirm'), {
        method: 'POST',
        headers: getDevHeaders(),
        body: JSON.stringify({ payslipId })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // ==========================================
  // ADMIN PANEL OPERATIONS
  // ==========================================
  // Developers CRUD
  async adminGetDevelopers(): Promise<{ success: boolean; developers?: Developer[]; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/developers'), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminCreateDeveloper(data: {
    name: string;
    email: string;
    roleTitle: string;
    hourlyRate: number;
    currency: string;
    phone?: string;
    password?: string;
    assignedProjectIds?: number[];
    sendEmail?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    developer?: Developer;
    credentials?: { name: string; email: string; password: string; portalUrl: string };
    emailDispatched?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/developers'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminUpdateDeveloper(data: {
    id: number;
    name?: string;
    roleTitle?: string;
    hourlyRate?: number;
    currency?: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'pending';
    password?: string;
    assignedProjectIds?: number[];
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/developers'), {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminDeleteDeveloper(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl(`api/developers?id=${id}`), {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminResendInvite(developerId: number, password?: string): Promise<{ success: boolean; message?: string; credentials?: { email: string; password: string }; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/developers/resend-invite'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ developerId, password })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Projects CRUD
  async adminGetProjects(): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/projects'), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminCreateProject(data: {
    name: string;
    description?: string;
    budget?: number;
    currency?: string;
    status: Project['status'];
    launchDate?: string;
    repoUrl?: string;
    milestones?: Milestone[];
    developerIds?: number[];
  }): Promise<{ success: boolean; message?: string; project?: Project; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/projects'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminUpdateProject(data: {
    id: number;
    name?: string;
    description?: string;
    budget?: number;
    currency?: string;
    status?: Project['status'];
    launchDate?: string;
    repoUrl?: string;
    milestones?: Milestone[];
    developerIds?: number[];
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/projects'), {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminDeleteProject(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl(`api/projects?id=${id}`), {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Time Logs
  async adminGetTimeLogs(filters?: {
    developerId?: number;
    projectId?: number;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{
    success: boolean;
    logs?: TimeLog[];
    activeNow?: any[];
    metrics?: {
      totalLogs: number;
      totalMinutes: number;
      totalHours: number;
      activeDevelopersCount: number;
    };
    error?: string;
  }> {
    try {
      const query = new URLSearchParams();
      if (filters?.developerId) query.set('developerId', String(filters.developerId));
      if (filters?.projectId) query.set('projectId', String(filters.projectId));
      if (filters?.startDate) query.set('startDate', filters.startDate);
      if (filters?.endDate) query.set('endDate', filters.endDate);
      if (filters?.limit) query.set('limit', String(filters.limit));

      const res = await fetch(getApiUrl(`api/timetracker?${query.toString()}`), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Payslips
  async adminCalculatePay(developerId: number, startDate: string, endDate: string): Promise<{
    success: boolean;
    hoursBilled?: number;
    hourlyRate?: number;
    estimatedPay?: number;
    currency?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl(`api/payslips/calculate?developerId=${developerId}&startDate=${startDate}&endDate=${endDate}`), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminGetPayslips(filters?: { developerId?: number; status?: string }): Promise<{
    success: boolean;
    payslips?: Payslip[];
    summary?: {
      totalPayslips: number;
      totalAmount: number;
      confirmedCount: number;
      pendingConfirmationCount: number;
    };
    error?: string;
  }> {
    try {
      const query = new URLSearchParams();
      if (filters?.developerId) query.set('developerId', String(filters.developerId));
      if (filters?.status) query.set('status', filters.status);

      const res = await fetch(getApiUrl(`api/payslips?${query.toString()}`), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminCreatePayslip(data: {
    developerId: number;
    periodStart: string;
    periodEnd: string;
    hoursBilled: number;
    hourlyRate: number;
    bonus?: number;
    deductions?: number;
    totalAmount?: number;
    currency?: string;
    paymentMethod: string;
    notes?: string;
    sendEmail?: boolean;
  }): Promise<{ success: boolean; message?: string; payslip?: any; emailSent?: boolean; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/payslips'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminDeletePayslip(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl(`api/payslips?id=${id}`), {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // ---------------------------------------------------------------------------
  // TASK MANAGEMENT & DEVELOPER ASSIGNMENTS
  // ---------------------------------------------------------------------------
  async adminGetTasks(filters?: {
    developerId?: number;
    projectId?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<{ success: boolean; tasks: DeveloperTask[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (filters?.developerId) params.append('developerId', String(filters.developerId));
      if (filters?.projectId) params.append('projectId', String(filters.projectId));
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(getApiUrl(`api/tasks${qs}`), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, tasks: [], error: e.message };
    }
  },

  async adminGetTaskStats(): Promise<{ success: boolean; metrics?: TaskMetrics; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/tasks/stats'), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminCreateTask(data: {
    title: string;
    description?: string;
    developerId: number;
    projectId?: number | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string | null;
    estimatedHours?: number;
    sendEmail?: boolean;
  }): Promise<{ success: boolean; message?: string; task?: DeveloperTask; emailSent?: boolean; emailError?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/tasks'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminUpdateTask(
    id: number,
    data: Partial<DeveloperTask> & { sendEmail?: boolean }
  ): Promise<{ success: boolean; message?: string; task?: DeveloperTask; emailSent?: boolean; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/tasks'), {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, ...data })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminDeleteTask(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(getApiUrl(`api/tasks?id=${id}`), {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async adminResendTaskEmail(taskId: number): Promise<{ success: boolean; message?: string; emailResult?: any; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/tasks/resend-email'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ taskId })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async devGetMyTasks(): Promise<{ success: boolean; tasks: DeveloperTask[]; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/tasks/my-tasks'), {
        headers: getDevHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, tasks: [], error: e.message };
    }
  },

  async devUpdateTaskStatus(
    taskId: number,
    status: TaskStatus,
    notes?: string,
    actualHours?: number
  ): Promise<{ success: boolean; message?: string; task?: DeveloperTask; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/tasks/update-status'), {
        method: 'POST',
        headers: getDevHeaders(),
        body: JSON.stringify({ id: taskId, status, notes, actualHours })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
};


/**
 * Safely parses any date string from the server.
 * If the string does not have a timezone indicator ('Z' or offset),
 * it is treated as UTC (since the server stores and returns UTC).
 */
export const parseServerDate = (dateStr: string | null | undefined): Date => {
  if (!dateStr) return new Date();
  const trimmed = dateStr.trim();
  if (trimmed.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }
  // Convert "YYYY-MM-DD HH:MM:SS" -> "YYYY-MM-DDTHH:MM:SSZ"
  const isoFormatted = trimmed.replace(' ', 'T') + 'Z';
  const parsed = new Date(isoFormatted);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date(trimmed);
};

/**
 * Format date to the developer's local time (e.g. "03:39:05 PM")
 */
export const formatLocalTime = (dateStr: string | null | undefined, includeSeconds = true): string => {
  if (!dateStr) return '—';
  try {
    const d = parseServerDate(dateStr);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds ? { second: '2-digit' } : {})
    });
  } catch {
    return dateStr;
  }
};

/**
 * Format date to the developer's local date string (e.g. "Oct 26, 2026")
 */
export const formatLocalDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—';
  try {
    const d = parseServerDate(dateStr);
    return d.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

/**
 * Retrieve current user's local timezone name (e.g. "Africa/Lagos", "America/New_York")
 */
export const getClientTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

