import { getApiUrl } from '../context/ContentContext';

export type WorkflowRole = 'approver' | 'reviewer' | 'contributor' | 'observer';

export interface TeamMember {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  roleTitle: string;
  workflowRole: WorkflowRole;
  department: string;
  phone?: string;
  permissions: string[];
  status: 'active' | 'inactive';
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  isSuperAdmin?: boolean;
  isCurrentUser?: boolean;
}

export interface TeamStats {
  total: number;
  approvers: number;
  reviewers: number;
  contributors: number;
  observers: number;
  active: number;
  inactive: number;
}

export interface CreateMemberPayload {
  name: string;
  email: string;
  username?: string;
  password: string;
  role?: string;
  roleTitle?: string;
  workflowRole: WorkflowRole;
  department?: string;
  phone?: string;
  permissions: string[];
  status?: 'active' | 'inactive';
  sendWelcomeEmail?: boolean;
}

export interface UpdateMemberPayload {
  id: number;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role?: string;
  roleTitle?: string;
  workflowRole: WorkflowRole;
  department?: string;
  phone?: string;
  permissions: string[];
  status: 'active' | 'inactive';
}

const getAdminHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('amg_admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const teamService = {
  async getTeamMembers(): Promise<{
    success: boolean;
    members?: TeamMember[];
    stats?: TeamStats;
    availablePermissions?: Record<string, string>;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/admin/team'), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to fetch team members' };
    }
  },

  async createTeamMember(data: CreateMemberPayload): Promise<{
    success: boolean;
    message?: string;
    member?: TeamMember;
    credentials?: {
      name: string;
      email: string;
      username: string;
      password: string;
      roleTitle: string;
      workflowRole: string;
    };
    emailDispatched?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/admin/team'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to create team member' };
    }
  },

  async updateTeamMember(data: UpdateMemberPayload): Promise<{
    success: boolean;
    message?: string;
    member?: TeamMember;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/admin/team'), {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to update team member' };
    }
  },

  async deleteTeamMember(id: number): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl(`api/admin/team?id=${id}`), {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to delete team member' };
    }
  },

  async resetMemberPassword(id: number, password?: string, sendEmail?: boolean): Promise<{
    success: boolean;
    message?: string;
    plainPassword?: string;
    emailSent?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/admin/team/reset-password'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, password, sendEmail })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to reset password' };
    }
  }
};
