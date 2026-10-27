import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Eye,
  FileText,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  RefreshCw,
  Printer,
  X,
  Lock,
  Mail,
  Phone,
  Briefcase,
  Building,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  teamService,
  TeamMember,
  TeamStats,
  WorkflowRole
} from '../../services/teamService';

interface AdminTeamTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  currentAdminId?: number;
}

export const AdminTeamTab: React.FC<AdminTeamTabProps> = ({ showToast, currentAdminId }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats>({
    total: 0,
    approvers: 0,
    reviewers: 0,
    contributors: 0,
    observers: 0,
    active: 0,
    inactive: 0
  });
  const [availablePermissions, setAvailablePermissions] = useState<Record<string, string>>({
    manage_team: 'Manage Management Team & Access Control',
    manage_content: 'Manage Branding, CMS Text & Media Assets',
    manage_blog: 'Create, Edit & Publish Editorial News',
    manage_projects: 'Manage Projects, Scopes & Deliverables',
    manage_developers: 'Manage Developers, Rates & Onboarding',
    manage_payroll: 'Disburse Payroll & Issue Official Payslips',
    manage_timetracking: 'Audit & Approve Developer Time Logs',
    manage_security: 'View Device Trust & Audit Security Sessions'
  });
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [workflowFilter, setWorkflowFilter] = useState<'all' | WorkflowRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [credsModalOpen, setCredsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Add / Edit Form State
  const [saving, setSaving] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [memberToReset, setMemberToReset] = useState<TeamMember | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRoleTitle, setFormRoleTitle] = useState('Management Executive');
  const [formWorkflowRole, setFormWorkflowRole] = useState<WorkflowRole>('reviewer');
  const [formDepartment, setFormDepartment] = useState('Executive Management');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formPermissions, setFormPermissions] = useState<string[]>([]);
  const [formSendWelcomeEmail, setFormSendWelcomeEmail] = useState(true);

  // Creds Display Modal
  const [latestCreds, setLatestCreds] = useState<{
    name: string;
    email: string;
    username: string;
    password: string;
    roleTitle: string;
    workflowRole: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch all members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await teamService.getTeamMembers();
      if (res.success && res.members) {
        setMembers(res.members);
        if (res.stats) setStats(res.stats);
        if (res.availablePermissions) setAvailablePermissions(res.availablePermissions);
      } else {
        showToast(res.error || 'Failed to fetch team members', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error loading team data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Quick Preset Role Templates
  const applyRoleTemplate = (preset: 'partner' | 'reviewer' | 'finance' | 'content' | 'observer') => {
    const allPerms = Object.keys(availablePermissions);
    switch (preset) {
      case 'partner':
        setFormWorkflowRole('approver');
        setFormRoleTitle('Managing Partner / Senior Director');
        setFormDepartment('Executive Leadership');
        setFormPermissions(allPerms);
        break;
      case 'reviewer':
        setFormWorkflowRole('reviewer');
        setFormRoleTitle('Executive Reviewer & Auditor');
        setFormDepartment('Operations & Governance');
        setFormPermissions(['manage_content', 'manage_blog', 'manage_projects', 'manage_timetracking']);
        break;
      case 'finance':
        setFormWorkflowRole('approver');
        setFormRoleTitle('Financial Controller & Payroll Lead');
        setFormDepartment('Finance & Treasury');
        setFormPermissions(['manage_payroll', 'manage_timetracking', 'manage_projects', 'manage_developers']);
        break;
      case 'content':
        setFormWorkflowRole('contributor');
        setFormRoleTitle('Editorial Content Director');
        setFormDepartment('Media & Communications');
        setFormPermissions(['manage_blog', 'manage_content', 'manage_projects']);
        break;
      case 'observer':
        setFormWorkflowRole('observer');
        setFormRoleTitle('Strategic Advisory Stakeholder');
        setFormDepartment('Advisory Board');
        setFormPermissions(['manage_content']);
        break;
    }
    showToast(`Applied preset configuration: ${preset.toUpperCase()}`, 'info');
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'AMG-';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '!9';
    setFormPassword(pass);
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormUsername('');
    generateSecurePassword();
    setFormRoleTitle('Management Executive');
    setFormWorkflowRole('reviewer');
    setFormDepartment('Executive Management');
    setFormPhone('');
    setFormStatus('active');
    setFormPermissions(['manage_content', 'manage_blog', 'manage_projects', 'manage_timetracking']);
    setFormSendWelcomeEmail(true);
    setAddModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormName(member.name || '');
    setFormEmail(member.email || '');
    setFormUsername(member.username || '');
    setFormPassword('');
    setFormRoleTitle(member.roleTitle || 'Management Executive');
    setFormWorkflowRole(member.workflowRole || 'reviewer');
    setFormDepartment(member.department || 'Executive Management');
    setFormPhone(member.phone || '');
    setFormStatus(member.status || 'active');
    setFormPermissions(Array.isArray(member.permissions) ? member.permissions : []);
    setEditModalOpen(true);
  };

  const togglePermission = (permKey: string) => {
    setFormPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const toggleSelectAllPermissions = () => {
    const allKeys = Object.keys(availablePermissions);
    if (formPermissions.length === allKeys.length) {
      setFormPermissions([]);
    } else {
      setFormPermissions(allKeys);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword) {
      showToast('Name, Email, and Password are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await teamService.createTeamMember({
        name: formName.trim(),
        email: formEmail.trim(),
        username: formUsername.trim() || undefined,
        password: formPassword,
        role: formWorkflowRole === 'approver' ? 'super_admin' : 'admin',
        roleTitle: formRoleTitle.trim(),
        workflowRole: formWorkflowRole,
        department: formDepartment.trim(),
        phone: formPhone.trim() || undefined,
        permissions: formPermissions,
        status: formStatus,
        sendWelcomeEmail: formSendWelcomeEmail
      });

      if (res.success && res.member) {
        showToast(res.message || 'Management team member created successfully!', 'success');
        setAddModalOpen(false);
        if (res.credentials) {
          setLatestCreds(res.credentials);
          setCredsModalOpen(true);
        }
        await fetchMembers();
      } else {
        showToast(res.error || 'Failed to create team member', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!formName.trim() || !formEmail.trim()) {
      showToast('Name and Email cannot be empty.', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await teamService.updateTeamMember({
        id: editingMember.id,
        name: formName.trim(),
        email: formEmail.trim(),
        username: formUsername.trim() || undefined,
        password: formPassword.trim() ? formPassword : undefined,
        role: formWorkflowRole === 'approver' ? 'super_admin' : 'admin',
        roleTitle: formRoleTitle.trim(),
        workflowRole: formWorkflowRole,
        department: formDepartment.trim(),
        phone: formPhone.trim() || undefined,
        permissions: formPermissions,
        status: formStatus
      });

      if (res.success) {
        showToast(res.message || 'Management details updated successfully!', 'success');
        setEditModalOpen(false);
        setEditingMember(null);
        await fetchMembers();
      } else {
        showToast(res.error || 'Failed to update member', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    setSaving(true);
    try {
      const res = await teamService.deleteTeamMember(memberToDelete.id);
      if (res.success) {
        showToast(res.message || 'Team member removed.', 'info');
        setDeleteModalOpen(false);
        setMemberToDelete(null);
        await fetchMembers();
      } else {
        showToast(res.error || 'Failed to delete member', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPasswordSubmit = async (sendEmail: boolean) => {
    if (!memberToReset) return;
    setSaving(true);
    try {
      const res = await teamService.resetMemberPassword(memberToReset.id, formPassword || undefined, sendEmail);
      if (res.success) {
        showToast(res.message || 'Password reset successfully!', 'success');
        setResetModalOpen(false);
        setLatestCreds({
          name: memberToReset.name,
          email: memberToReset.email,
          username: memberToReset.username,
          password: res.plainPassword || formPassword,
          roleTitle: memberToReset.roleTitle,
          workflowRole: memberToReset.workflowRole
        });
        setCredsModalOpen(true);
      } else {
        showToast(res.error || 'Failed to reset password', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!latestCreds) return;
    const text = `AZARIAH MANAGEMENT GROUP - EXECUTIVE CREDENTIALS\nName: ${latestCreds.name}\nEmail: ${latestCreds.email}\nUsername: ${latestCreds.username}\nTemporary Password: ${latestCreds.password}\nRole: ${latestCreds.roleTitle} (${latestCreds.workflowRole.toUpperCase()})\nLogin URL: https://azariahmg.com/#admin`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Credentials copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(q);
        const matchesEmail = m.email?.toLowerCase().includes(q);
        const matchesUsername = m.username?.toLowerCase().includes(q);
        const matchesDept = m.department?.toLowerCase().includes(q);
        const matchesRole = m.roleTitle?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesUsername && !matchesDept && !matchesRole) {
          return false;
        }
      }
      // Workflow
      if (workflowFilter !== 'all' && m.workflowRole !== workflowFilter) {
        return false;
      }
      // Status
      if (statusFilter !== 'all' && m.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [members, searchQuery, workflowFilter, statusFilter]);

  // Workflow badge helpers
  const getWorkflowBadge = (role: WorkflowRole) => {
    switch (role) {
      case 'approver':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Approver (Full Sign-Off)
          </span>
        );
      case 'reviewer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-purple-500/15 border border-purple-500/40 text-purple-300">
            <Eye className="w-3 h-3 text-purple-400" /> Reviewer (Audit & Verify)
          </span>
        );
      case 'contributor':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-sky-500/15 border border-sky-500/40 text-sky-300">
            <FileText className="w-3 h-3 text-sky-400" /> Contributor
          </span>
        );
      case 'observer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-300">
            <Info className="w-3 h-3 text-amber-400" /> Observer (Read-Only)
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 overflow-hidden w-full max-w-full">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-lime-500/10 border border-lime-500/30 text-lime-400 text-[10px] font-black uppercase tracking-widest rounded-sm">
              Executive Governance
            </span>
            <span className="text-slate-500 text-xs">&bull;</span>
            <span className="text-slate-400 text-xs">Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 mt-1">
            <Users className="w-6 h-6 text-lime-400" /> Management Team & Permissions
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Authorize leadership executives, assign strategic roles, designate workflow privileges (Approvers, Reviewers, Contributors, Observers), and govern administrative capabilities.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchMembers}
            disabled={loading}
            className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Reload team roster"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Print governance directory"
          >
            <Printer className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Print Directory</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all shadow-md shadow-lime-500/20"
          >
            <UserPlus className="w-4 h-4" /> Add Team Member
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Executives</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <p className="text-[10px] text-slate-500">Registered console administrators</p>
        </div>

        <div className="p-4 bg-slate-950 border border-emerald-900/30 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-400 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Approvers</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{stats.approvers}</div>
          <p className="text-[10px] text-emerald-500/80">Authorized sign-off authority</p>
        </div>

        <div className="p-4 bg-slate-950 border border-purple-900/30 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-purple-400 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Reviewers</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{stats.reviewers}</div>
          <p className="text-[10px] text-purple-500/80">Audit & milestone verification</p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Access</span>
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-2xl font-black text-lime-400">{stats.active}</div>
          <p className="text-[10px] text-slate-500">{stats.inactive} account(s) deactivated</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-slate-950 border border-slate-800 rounded-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, department, or executive role..."
            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Workflow Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
            Workflow:
          </span>
          <button
            type="button"
            onClick={() => setWorkflowFilter('all')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold whitespace-nowrap transition-colors ${
              workflowFilter === 'all'
                ? 'bg-lime-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setWorkflowFilter('approver')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
              workflowFilter === 'approver'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-emerald-400 hover:text-emerald-300 border border-emerald-900/40'
            }`}
          >
            <ShieldCheck className="w-3 h-3" /> Approvers ({stats.approvers})
          </button>
          <button
            type="button"
            onClick={() => setWorkflowFilter('reviewer')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
              workflowFilter === 'reviewer'
                ? 'bg-purple-500 text-slate-950'
                : 'bg-slate-900 text-purple-400 hover:text-purple-300 border border-purple-900/40'
            }`}
          >
            <Eye className="w-3 h-3" /> Reviewers ({stats.reviewers})
          </button>
          <button
            type="button"
            onClick={() => setWorkflowFilter('contributor')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
              workflowFilter === 'contributor'
                ? 'bg-sky-500 text-slate-950'
                : 'bg-slate-900 text-sky-400 hover:text-sky-300 border border-sky-900/40'
            }`}
          >
            <FileText className="w-3 h-3" /> Contributors ({stats.contributors})
          </button>
          <button
            type="button"
            onClick={() => setWorkflowFilter('observer')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
              workflowFilter === 'observer'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-amber-400 hover:text-amber-300 border border-amber-900/40'
            }`}
          >
            <Info className="w-3 h-3" /> Observers ({stats.observers})
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-sm focus:outline-none focus:border-lime-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-lime-400" />
            <span>Synchronizing executive roster...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
            <p className="font-bold text-slate-400">No management team members match your criteria.</p>
            <p className="text-[11px]">Try modifying your search or click &quot;Add Team Member&quot; to register leadership personnel.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Executive Member</th>
                  <th className="py-3 px-4">Role Title & Dept</th>
                  <th className="py-3 px-4">Workflow Authority</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((member) => {
                  const isCurrent = member.id === currentAdminId;
                  const isRoot = member.id === 1;
                  const permsCount = Array.isArray(member.permissions) ? member.permissions.length : 0;
                  const totalPermsCount = Object.keys(availablePermissions).length;

                  return (
                    <tr
                      key={member.id}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-lime-500/[0.03] hover:bg-lime-500/[0.07]'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-xs shrink-0 relative">
                            {member.name
                              ? member.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                              : 'AMG'}
                            {member.status === 'active' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border border-slate-900"></span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">
                                {member.name || 'Unnamed Executive'}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 bg-lime-500/20 text-lime-300 text-[9px] font-black uppercase tracking-widest rounded-sm border border-lime-500/30">
                                  You
                                </span>
                              )}
                              {isRoot && (
                                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-widest rounded-sm border border-amber-500/30">
                                  Root Admin
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span className="truncate max-w-[180px]">{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <Phone className="w-2.5 h-2.5" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Title & Department */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-200 text-xs">
                            {member.roleTitle || 'Management Executive'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Building className="w-3 h-3 text-slate-500" />
                            <span>{member.department || 'Executive Management'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Workflow Designation */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getWorkflowBadge(member.workflowRole)}
                      </td>

                      {/* Permissions Summary */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${
                                permsCount === totalPermsCount
                                  ? 'bg-lime-500/15 border-lime-500/30 text-lime-400 font-black'
                                  : 'bg-slate-800 border-slate-700 text-slate-300'
                              }`}
                            >
                              {permsCount === totalPermsCount
                                ? 'Full Authority (8/8)'
                                : `${permsCount} of ${totalPermsCount} Permissions`}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[220px]">
                            {member.permissions?.map((p) => p.replace('manage_', '')).join(', ') || 'No granular permissions'}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {member.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-lime-500/10 border border-lime-500/30 text-lime-400">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-400">
                            <X className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(member)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-sm transition-colors border border-slate-700"
                            title="Edit roles and permissions"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMemberToReset(member);
                              generateSecurePassword();
                              setResetModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-sm transition-colors border border-slate-700"
                            title="Reset administrator password"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-lime-400" />
                          </button>

                          {!isRoot && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                setMemberToDelete(member);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-sm transition-colors border border-red-800/40"
                              title="Delete executive account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD TEAM MEMBER */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-lime-500/10 border border-lime-500/30 rounded-sm text-lime-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white">
                    Add Management Team Member
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Assign executive designation, workflow authority (Approver / Reviewer), and permissions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-sm hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              {/* Preset Templates */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-lime-400" /> Quick Role Templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyRoleTemplate('partner')}
                    className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-slate-800 hover:bg-lime-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Managing Partner
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRoleTemplate('reviewer')}
                    className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-slate-800 hover:bg-purple-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Executive Reviewer
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRoleTemplate('finance')}
                    className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Financial Controller
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRoleTemplate('content')}
                    className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Content Director
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRoleTemplate('observer')}
                    className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Advisory Observer
                  </button>
                </div>
              </div>

              {/* Section 1: Member Identity */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-lime-400" /> Executive Identity & Contact
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. David Sterling"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Official Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. david.s@azariahmg.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Username (Optional)
                    </label>
                    <input
                      type="text"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="Auto-generated if blank"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Direct Phone / Mobile
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+1 (240) 813-0308"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Workflow Designation (CRITICAL REQUIREMENT) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-lime-400" /> Workflow Designation & Sign-Off Authority *
                  </h4>
                  <span className="text-[10px] text-slate-400">Defines corporate governance tier</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Approver */}
                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'approver'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="workflowRole"
                      value="approver"
                      checked={formWorkflowRole === 'approver'}
                      onChange={() => setFormWorkflowRole('approver')}
                      className="mt-1 text-emerald-500 focus:ring-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-black text-xs text-emerald-400 uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" /> Approver (Full Sign-off)
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Highest authority. Can approve and disburse payroll, sign off on developer logs, publish editorial news, and authorize milestones.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Reviewer */}
                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'reviewer'
                        ? 'bg-purple-500/15 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="workflowRole"
                      value="reviewer"
                      checked={formWorkflowRole === 'reviewer'}
                      onChange={() => setFormWorkflowRole('reviewer')}
                      className="mt-1 text-purple-500 focus:ring-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-black text-xs text-purple-400 uppercase tracking-wider">
                        <Eye className="w-3.5 h-3.5" /> Reviewer (Audit & Verify)
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Quality and compliance auditor. Can review time tracking submissions, inspect milestone deliverables, proof drafts, and flag issues.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Contributor */}
                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'contributor'
                        ? 'bg-sky-500/15 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="workflowRole"
                      value="contributor"
                      checked={formWorkflowRole === 'contributor'}
                      onChange={() => setFormWorkflowRole('contributor')}
                      className="mt-1 text-sky-500 focus:ring-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-black text-xs text-sky-400 uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5" /> Contributor
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Content and project creator. Can draft blog articles, update project notes, and collaborate on initiatives.
                      </p>
                    </div>
                  </label>

                  {/* Option 4: Observer */}
                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'observer'
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="workflowRole"
                      value="observer"
                      checked={formWorkflowRole === 'observer'}
                      onChange={() => setFormWorkflowRole('observer')}
                      className="mt-1 text-amber-500 focus:ring-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-black text-xs text-amber-400 uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5" /> Observer (Read-Only)
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Non-editing stakeholder. Can monitor dashboards, review live project statuses, and view audit reports.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 3: Title and Department */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-lime-400" /> Role Title & Department
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Executive Role Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formRoleTitle}
                      onChange={(e) => setFormRoleTitle(e.target.value)}
                      placeholder="e.g. Managing Director & Senior Reviewer"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Department / Group *
                    </label>
                    <input
                      type="text"
                      required
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      placeholder="e.g. Executive Leadership"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Granular Permissions Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-lime-400" /> Granular Access Permissions Matrix ({formPermissions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={toggleSelectAllPermissions}
                    className="text-[10px] font-bold text-lime-400 hover:underline uppercase tracking-wider"
                  >
                    {formPermissions.length === Object.keys(availablePermissions).length
                      ? 'Clear All'
                      : 'Select All (Full Authority)'}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  {Object.entries(availablePermissions).map(([permKey, permLabel]) => {
                    const isChecked = formPermissions.includes(permKey);
                    return (
                      <label
                        key={permKey}
                        onClick={() => togglePermission(permKey)}
                        className={`p-2.5 rounded-sm border cursor-pointer transition-colors flex items-center justify-between gap-2 text-xs ${
                          isChecked
                            ? 'bg-lime-500/10 border-lime-500/40 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-[11px] leading-tight">{permLabel}</span>
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-lime-500 border-lime-500 text-slate-950'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Password and Onboarding */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-lime-400" /> Security Credentials & Invite
                </h4>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Temporary Access Password *
                    </label>
                    <button
                      type="button"
                      onClick={generateSecurePassword}
                      className="text-[10px] font-bold text-lime-400 hover:underline"
                    >
                      Generate Strong Password
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white font-mono rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    placeholder="Enter or generate a secure password"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSendWelcomeEmail}
                      onChange={(e) => setFormSendWelcomeEmail(e.target.checked)}
                      className="rounded-sm bg-slate-950 border-slate-700 text-lime-500 focus:ring-0"
                    />
                    <span>
                      Dispatch official HTML onboarding email with login URL and access credentials.
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Submit Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all shadow-md shadow-lime-500/20 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {saving ? 'Registering...' : 'Save & Authorize Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT TEAM MEMBER */}
      {editModalOpen && editingMember && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-lime-500/10 border border-lime-500/30 rounded-sm text-lime-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white">
                    Edit Executive & Permissions
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modifying configuration for <strong className="text-white">{editingMember.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-sm hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              {/* Identity & Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-lime-400" /> Identity & Status
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Username</label>
                    <input
                      type="text"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Access Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      disabled={editingMember.id === 1}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="active">Active (Access Granted)</option>
                      <option value="inactive">Inactive (Deactivated)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Workflow Designation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-lime-400" /> Workflow Designation & Authority *
                  </h4>
                  {editingMember.id === 1 && (
                    <span className="text-[10px] text-amber-400">Root Admin locked to Approver</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'approver'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="editWorkflowRole"
                      value="approver"
                      checked={formWorkflowRole === 'approver'}
                      onChange={() => setFormWorkflowRole('approver')}
                      className="mt-1 text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <div className="font-black text-xs text-emerald-400 uppercase tracking-wider">
                        Approver (Full Sign-off)
                      </div>
                      <p className="text-[11px] text-slate-400">Full disbursement, milestone approval, and publishing rights.</p>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'reviewer'
                        ? 'bg-purple-500/15 border-purple-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="editWorkflowRole"
                      value="reviewer"
                      disabled={editingMember.id === 1}
                      checked={formWorkflowRole === 'reviewer'}
                      onChange={() => setFormWorkflowRole('reviewer')}
                      className="mt-1 text-purple-500 focus:ring-0 disabled:opacity-40"
                    />
                    <div>
                      <div className="font-black text-xs text-purple-400 uppercase tracking-wider">
                        Reviewer (Audit & Verify)
                      </div>
                      <p className="text-[11px] text-slate-400">Audit developer time logs, milestone submissions, and draft reviews.</p>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'contributor'
                        ? 'bg-sky-500/15 border-sky-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="editWorkflowRole"
                      value="contributor"
                      disabled={editingMember.id === 1}
                      checked={formWorkflowRole === 'contributor'}
                      onChange={() => setFormWorkflowRole('contributor')}
                      className="mt-1 text-sky-500 focus:ring-0 disabled:opacity-40"
                    />
                    <div>
                      <div className="font-black text-xs text-sky-400 uppercase tracking-wider">
                        Contributor
                      </div>
                      <p className="text-[11px] text-slate-400">Editorial content creation, draft articles, and project notes.</p>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-sm border cursor-pointer transition-all flex items-start gap-3 ${
                      formWorkflowRole === 'observer'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="editWorkflowRole"
                      value="observer"
                      disabled={editingMember.id === 1}
                      checked={formWorkflowRole === 'observer'}
                      onChange={() => setFormWorkflowRole('observer')}
                      className="mt-1 text-amber-500 focus:ring-0 disabled:opacity-40"
                    />
                    <div>
                      <div className="font-black text-xs text-amber-400 uppercase tracking-wider">
                        Observer (Read-Only)
                      </div>
                      <p className="text-[11px] text-slate-400">Read-only oversight of corporate dashboards and time logs.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Title and Department */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-lime-400" /> Title & Department
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Role Title *</label>
                    <input
                      type="text"
                      required
                      value={formRoleTitle}
                      onChange={(e) => setFormRoleTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Department *</label>
                    <input
                      type="text"
                      required
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Granular Permissions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-lime-400" /> Permissions Matrix ({formPermissions.length})
                  </h4>
                  {editingMember.id !== 1 && (
                    <button
                      type="button"
                      onClick={toggleSelectAllPermissions}
                      className="text-[10px] font-bold text-lime-400 hover:underline uppercase tracking-wider"
                    >
                      {formPermissions.length === Object.keys(availablePermissions).length ? 'Clear All' : 'Select All'}
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  {Object.entries(availablePermissions).map(([permKey, permLabel]) => {
                    const isChecked = formPermissions.includes(permKey);
                    return (
                      <label
                        key={permKey}
                        onClick={() => editingMember.id !== 1 && togglePermission(permKey)}
                        className={`p-2.5 rounded-sm border cursor-pointer transition-colors flex items-center justify-between gap-2 text-xs ${
                          isChecked
                            ? 'bg-lime-500/10 border-lime-500/40 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-[11px] leading-tight">{permLabel}</span>
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-lime-500 border-lime-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Optional New Password */}
              <div className="space-y-2 p-3 bg-slate-950 border border-slate-800 rounded-sm">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Override Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Leave empty unless changing password"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all shadow-md shadow-lime-500/20 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREDENTIALS READY CARD */}
      {credsModalOpen && latestCreds && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-md shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-lime-500/10 border border-lime-500/30 text-lime-400 rounded-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-white">
                  Credentials Ready
                </h3>
                <p className="text-[11px] text-slate-400">
                  Access credentials generated for {latestCreds.name}.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-sans">
                  Account Holder
                </span>
                <span className="text-white font-bold">{latestCreds.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-sans">
                  Access Email
                </span>
                <span className="text-lime-400">{latestCreds.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-sans">
                  Designated Workflow
                </span>
                <span className="text-purple-300 uppercase">{latestCreds.workflowRole}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-indigo-900/50 rounded-sm space-y-1">
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest block font-sans font-bold">
                  Temporary Password
                </span>
                <div className="text-base font-bold text-white tracking-wider select-all">
                  {latestCreds.password}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-sans">
                  Login URL
                </span>
                <span className="text-slate-300 break-all">https://azariahmg.com/#admin</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="flex-1 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-lime-500/20"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Credentials'}
              </button>
              <button
                type="button"
                onClick={() => setCredsModalOpen(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RESET PASSWORD */}
      {resetModalOpen && memberToReset && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-md shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-white">
                  Reset Password
                </h3>
                <p className="text-[11px] text-slate-400">
                  Update credentials for <strong className="text-white">{memberToReset.name}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={generateSecurePassword}
                    className="text-[10px] font-bold text-lime-400 hover:underline"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white font-mono rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleResetPasswordSubmit(true)}
                  disabled={saving}
                  className="flex-1 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-lime-500/20 disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" /> Save & Email Member
                </button>
                <button
                  type="button"
                  onClick={() => handleResetPasswordSubmit(false)}
                  disabled={saving}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-sm transition-colors"
                >
                  Save Only
                </button>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-sm text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CONFIRMATION */}
      {deleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-md shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-red-950/40 border border-red-800 text-red-400 rounded-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-white">
                  Remove Executive Account
                </h3>
                <p className="text-[11px] text-slate-400">
                  This action is permanent and revokes console access.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-white font-bold">{memberToDelete.name}</strong> ({memberToDelete.email}) from the management roster? All active device trusts and sessions will be invalidated immediately.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={saving}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {saving ? 'Removing...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamTab;
