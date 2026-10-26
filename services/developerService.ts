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

  async devClockIn(projectId?: number | null, notes?: string): Promise<{ success: boolean; message?: string; session?: any; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/timetracker/clock-in'), {
        method: 'POST',
        headers: getDevHeaders(),
        body: JSON.stringify({ projectId, notes })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async devClockOut(taskSummary?: string): Promise<{ success: boolean; message?: string; summary?: any; error?: string }> {
    try {
      const res = await fetch(getApiUrl('api/timetracker/clock-out'), {
        method: 'POST',
        headers: getDevHeaders(),
        body: JSON.stringify({ taskSummary })
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
  }
};
