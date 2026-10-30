import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Mail,
  RefreshCw,
  Trash2,
  Edit2,
  Clock,
  Briefcase,
  KeyRound,
  ExternalLink,
  ShieldAlert,
  Search,
  CheckCircle2,
  DollarSign,
  Building2,
  Plus,
  X,
  Tag,
  Layers,
  ChevronRight,
  Filter,
  FileText
} from 'lucide-react';
import {
  developerService,
  Developer,
  Project,
  Department,
  CompensationType
} from '../../services/developerService';

interface AdminDevelopersTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const DEPARTMENT_COLORS = [
  { name: 'Sky Blue', value: '#38bdf8' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Purple / Violet', value: '#a855f7' },
  { name: 'Amber Gold', value: '#f59e0b' },
  { name: 'Rose Red', value: '#f43f5e' },
  { name: 'Cyan Tech', value: '#06b6d4' },
  { name: 'Indigo Corporate', value: '#6366f1' },
  { name: 'Lime Advisory', value: '#84cc16' }
];

export const AdminDevelopersTab: React.FC<AdminDevelopersTabProps> = ({ showToast }) => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  // Add Staff Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Senior Associate');
  const [departmentId, setDepartmentId] = useState<number | ''>('');
  const [departmentName, setDepartmentName] = useState<string>('Engineering & Technology');
  const [customDeptInput, setCustomDeptInput] = useState(false);
  const [compensationType, setCompensationType] = useState<CompensationType>('hourly');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(45);
  const [salary, setSalary] = useState<number | ''>(5000);
  const [paytime, setPaytime] = useState<string>('hourly');
  const [contractAmount, setContractAmount] = useState<number | ''>(10000);
  const [contractTerms, setContractTerms] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [assignedProjectIds, setAssignedProjectIds] = useState<number[]>([]);
  const [sendEmail, setSendEmail] = useState(true);

  // Edit Staff Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Developer | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editDeptId, setEditDeptId] = useState<number | ''>('');
  const [editDeptName, setEditDeptName] = useState('');
  const [editCompensationType, setEditCompensationType] = useState<CompensationType>('hourly');
  const [editHourlyRate, setEditHourlyRate] = useState<number | ''>(45);
  const [editSalary, setEditSalary] = useState<number | ''>(5000);
  const [editPaytime, setEditPaytime] = useState<string>('hourly');
  const [editContractAmount, setEditContractAmount] = useState<number | ''>(10000);
  const [editContractTerms, setEditContractTerms] = useState<string>('');
  const [editCurrency, setEditCurrency] = useState('USD');
  const [editPhone, setEditPhone] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'pending'>('active');
  const [editPassword, setEditPassword] = useState('');

  // Department Management Modal State
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptSaving, setDeptSaving] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [newDeptColor, setNewDeptColor] = useState('#38bdf8');
  const [editingDeptId, setEditingDeptId] = useState<number | null>(null);

  // Credentials Ready Modal State (for immediate Copy to Clipboard)
  const [credsModalOpen, setCredsModalOpen] = useState(false);
  const [latestCreds, setLatestCreds] = useState<{
    name: string;
    email: string;
    password: string;
    portalUrl: string;
    role?: string;
    department?: string;
    compensationSummary?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [devsRes, deptsRes, projsRes] = await Promise.all([
        developerService.adminGetDevelopers(),
        developerService.adminGetDepartments(),
        developerService.adminGetProjects()
      ]);
      if (devsRes.success && devsRes.developers) {
        setDevelopers(devsRes.developers);
      }
      if (deptsRes.success && deptsRes.departments) {
        setDepartments(deptsRes.departments);
      }
      if (projsRes.success && projsRes.projects) {
        setProjects(projsRes.projects);
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to fetch staff directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'AMG-';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleOpenAddModal = () => {
    setName('');
    setEmail('');
    setRoleTitle('Senior Associate');
    const firstDept = departments.length > 0 ? departments[0] : null;
    if (firstDept) {
      setDepartmentId(firstDept.id);
      setDepartmentName(firstDept.name);
    } else {
      setDepartmentId('');
      setDepartmentName('Engineering & Technology');
    }
    setCustomDeptInput(false);
    setCompensationType('hourly');
    setHourlyRate(45);
    setSalary(5000);
    setPaytime('hourly');
    setContractAmount(10000);
    setContractTerms('');
    setCurrency('USD');
    setPhone('');
    setAssignedProjectIds([]);
    setSendEmail(true);
    generatePassword();
    setModalOpen(true);
  };

  const handleOpenEditModal = (staff: Developer) => {
    setEditingStaff(staff);
    setEditName(staff.name);
    setEditRoleTitle(staff.roleTitle || 'Associate');
    setEditDeptId(staff.departmentId || '');
    setEditDeptName(staff.department || 'Engineering & Technology');
    setEditCompensationType(staff.compensationType || 'hourly');
    setEditHourlyRate(staff.hourlyRate || 0);
    setEditSalary(staff.salary || 0);
    setEditPaytime(staff.paytime || (staff.compensationType === 'salary' ? 'monthly' : staff.compensationType === 'contract' ? 'contract' : 'hourly'));
    setEditContractAmount(staff.contractAmount || 0);
    setEditContractTerms(staff.contractTerms || '');
    setEditCurrency(staff.currency || 'USD');
    setEditPhone(staff.phone || '');
    setEditStatus(staff.status || 'active');
    setEditPassword('');
    setEditModalOpen(true);
  };

  const handleSaveDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Name and email are required', 'error');
      return;
    }

    setSaving(true);
    const chosenDeptName = customDeptInput ? departmentName : (departments.find(d => d.id === departmentId)?.name || departmentName || 'Engineering & Technology');

    const effectiveHourly = compensationType === 'hourly' ? (Number(hourlyRate) || 0) : 0;
    const effectiveSalary = compensationType === 'salary' ? (Number(salary) || 0) : 0;
    const effectiveContract = compensationType === 'contract' ? (Number(contractAmount) || 0) : 0;

    let compSummary = `${currency} ${effectiveHourly.toFixed(2)}/hr (${paytime})`;
    if (compensationType === 'salary') {
      compSummary = `${currency} ${effectiveSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })} / month (${paytime})`;
    } else if (compensationType === 'contract') {
      compSummary = `${currency} ${effectiveContract.toLocaleString(undefined, { minimumFractionDigits: 2 })} total contract (${paytime})`;
    }

    const res = await developerService.adminCreateDeveloper({
      name,
      email,
      roleTitle,
      departmentId: typeof departmentId === 'number' ? departmentId : null,
      department: chosenDeptName,
      compensationType,
      hourlyRate: effectiveHourly,
      salary: effectiveSalary,
      paytime,
      contractAmount: effectiveContract,
      contractTerms: compensationType === 'contract' ? contractTerms : undefined,
      currency,
      phone,
      password,
      assignedProjectIds,
      sendEmail
    });
    setSaving(false);

    if (res.success && res.developer) {
      setModalOpen(false);
      showToast(`Staff member "${res.developer.name}" onboarded successfully!`);
      if (res.credentials) {
        setLatestCreds({
          name: res.credentials.name,
          email: res.credentials.email,
          password: res.credentials.password,
          portalUrl: res.credentials.portalUrl,
          role: roleTitle,
          department: chosenDeptName,
          compensationSummary: compSummary
        });
        setCredsModalOpen(true);
      }
      fetchAll();
    } else {
      showToast(res.error || 'Failed to create staff member', 'error');
    }
  };

  const handleSaveStaffEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setEditSaving(true);
    const chosenDeptName = departments.find(d => d.id === editDeptId)?.name || editDeptName;

    const res = await developerService.adminUpdateDeveloper({
      id: editingStaff.id,
      name: editName,
      roleTitle: editRoleTitle,
      departmentId: typeof editDeptId === 'number' ? editDeptId : null,
      department: chosenDeptName,
      compensationType: editCompensationType,
      hourlyRate: editCompensationType === 'hourly' ? (Number(editHourlyRate) || 0) : 0,
      salary: editCompensationType === 'salary' ? (Number(editSalary) || 0) : 0,
      paytime: editPaytime,
      contractAmount: editCompensationType === 'contract' ? (Number(editContractAmount) || 0) : 0,
      contractTerms: editCompensationType === 'contract' ? editContractTerms : undefined,
      currency: editCurrency,
      phone: editPhone,
      status: editStatus,
      password: editPassword.trim() || undefined
    });
    setEditSaving(false);

    if (res.success) {
      setEditModalOpen(false);
      showToast(`Staff profile for "${editName}" updated successfully.`);
      fetchAll();
    } else {
      showToast(res.error || 'Failed to update staff member', 'error');
    }
  };

  const handleCopyCredentials = () => {
    if (!latestCreds) return;
    const compLine = latestCreds.compensationSummary ? `Compensation: ${latestCreds.compensationSummary}\n` : '';
    const text = `AZARIAH MANAGEMENT GROUP — STAFF CREDENTIALS
Department: ${latestCreds.department || 'Corporate'}
Role: ${latestCreds.role || 'Staff Member'}
${compLine}Portal URL: ${latestCreds.portalUrl}
Login Email: ${latestCreds.email}
Password: ${latestCreds.password}

Please sign in to access your assigned tasks, department records, and time tracker.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Credentials copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleResendInvite = async (dev: Developer) => {
    const res = await developerService.adminResendInvite(dev.id);
    if (res.success) {
      showToast(`Invitation credentials resent to ${dev.email}`);
      if (res.credentials) {
        setLatestCreds({
          name: dev.name,
          email: res.credentials.email,
          password: res.credentials.password,
          portalUrl: `${window.location.origin}/#dev-portal`,
          role: dev.roleTitle,
          department: dev.department
        });
        setCredsModalOpen(true);
      }
    } else {
      showToast(res.error || 'Failed to resend invitation', 'error');
    }
  };

  const handleDeleteDeveloper = async (dev: Developer) => {
    if (!window.confirm(`Are you sure you want to remove staff member "${dev.name}"? This will unlink their tasks and time logs.`)) {
      return;
    }
    const res = await developerService.adminDeleteDeveloper(dev.id);
    if (res.success) {
      showToast(`Staff member "${dev.name}" removed.`);
      fetchAll();
    } else {
      showToast(res.error || 'Failed to delete staff member', 'error');
    }
  };

  // Department Management Operations
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      showToast('Department name is required', 'error');
      return;
    }

    setDeptSaving(true);
    if (editingDeptId) {
      const res = await developerService.adminUpdateDepartment({
        id: editingDeptId,
        name: newDeptName.trim(),
        description: newDeptDesc.trim(),
        color: newDeptColor
      });
      setDeptSaving(false);
      if (res.success) {
        showToast(`Department "${newDeptName}" updated!`);
        setNewDeptName('');
        setNewDeptDesc('');
        setEditingDeptId(null);
        fetchAll();
      } else {
        showToast(res.error || 'Failed to update department', 'error');
      }
    } else {
      const res = await developerService.adminCreateDepartment({
        name: newDeptName.trim(),
        description: newDeptDesc.trim(),
        color: newDeptColor
      });
      setDeptSaving(false);
      if (res.success) {
        showToast(`Department "${newDeptName}" created!`);
        setNewDeptName('');
        setNewDeptDesc('');
        fetchAll();
      } else {
        showToast(res.error || 'Failed to create department', 'error');
      }
    }
  };

  const handleDeleteDepartment = async (dept: Department) => {
    if (!window.confirm(`Delete department "${dept.name}"? Associated staff members will have their department unlinked safely.`)) {
      return;
    }
    const res = await developerService.adminDeleteDepartment(dept.id);
    if (res.success) {
      showToast(`Department "${dept.name}" deleted.`);
      if (selectedDeptFilter === dept.name) setSelectedDeptFilter('all');
      fetchAll();
    } else {
      showToast(res.error || 'Failed to delete department', 'error');
    }
  };

  const filteredDevelopers = developers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.roleTitle && d.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.department && d.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept =
      selectedDeptFilter === 'all' ||
      (d.department && d.department.toLowerCase() === selectedDeptFilter.toLowerCase()) ||
      (!d.department && selectedDeptFilter === 'Engineering & Technology');

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" /> Staff Directory & Departments
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {developers.length} Staff Across {departments.length} Departments
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Manage organization-wide departments (Engineering, Marketing, Operations, Finance, Legal, Creative, HR), onboard staff with credentials, assign roles, and allocate cross-functional project portfolios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setDeptModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 hover:border-sky-500/50 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Building2 className="w-4 h-4 text-sky-400" /> Manage Departments
          </button>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/25 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedDeptFilter('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            selectedDeptFilter === 'all'
              ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <span>All Departments</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            selectedDeptFilter === 'all' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}>
            {developers.length}
          </span>
        </button>

        {departments.map((dept) => {
          const isSelected = selectedDeptFilter.toLowerCase() === dept.name.toLowerCase();
          const deptCount = developers.filter(
            d => (d.department && d.department.toLowerCase() === dept.name.toLowerCase()) ||
                 (!d.department && dept.name.toLowerCase().includes('engineering'))
          ).length;

          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptFilter(dept.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-100 text-slate-950 border-white shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: dept.color || '#38bdf8' }}
              />
              <span>{dept.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-300 text-slate-900' : 'bg-slate-800 text-slate-400'
              }`}>
                {deptCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search staff by name, email, department, or role title..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Staff Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Staff Member</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Role Title</th>
                <th className="py-3.5 px-5">Compensation & Paytime</th>
                <th className="py-3.5 px-5">Assigned Projects</th>
                <th className="py-3.5 px-5">Work Status</th>
                <th className="py-3.5 px-5">Hours Logged</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredDevelopers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No staff found matching the selected filter. Click <strong>Add Staff Member</strong> above to onboard a team member.
                  </td>
                </tr>
              ) : (
                filteredDevelopers.map((dev) => {
                  const deptObj = departments.find(
                    d => d.name.toLowerCase() === (dev.department || 'engineering & technology').toLowerCase()
                  );
                  const deptBadgeColor = deptObj?.color || '#38bdf8';

                  return (
                    <tr key={dev.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-sm">{dev.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{dev.email}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
                          style={{
                            borderColor: `${deptBadgeColor}40`,
                            backgroundColor: `${deptBadgeColor}15`,
                            color: deptBadgeColor
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: deptBadgeColor }}
                          />
                          {dev.department || 'Engineering & Technology'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-200 font-semibold">{dev.roleTitle}</td>
                      <td className="py-4 px-5">
                        {dev.compensationType === 'salary' ? (
                          <div>
                            <div className="text-white font-mono font-bold text-sm">
                              {dev.currency} {Number(dev.salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              <Briefcase className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>Fixed Salary • {dev.paytime || 'Monthly'}</span>
                            </div>
                          </div>
                        ) : dev.compensationType === 'contract' ? (
                          <div>
                            <div className="text-white font-mono font-bold text-sm">
                              {dev.currency} {Number(dev.contractAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              <FileText className="w-3 h-3 text-purple-400 shrink-0" />
                              <span>Paid on Contract • {dev.paytime || 'Milestone'}</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-white font-mono font-bold text-sm">
                              {dev.currency} {Number(dev.hourlyRate || 0).toFixed(2)}/hr
                            </div>
                            <div className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                              <span>Hourly Rate • {dev.paytime || 'Hourly'}</span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {dev.projects && dev.projects.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {dev.projects.map((p) => (
                              <span
                                key={p.id}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300"
                              >
                                {p.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {dev.isCurrentlyClockedIn ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Working Now
                          </span>
                        ) : dev.status === 'active' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                            Offline
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-white font-bold whitespace-nowrap">
                        {dev.totalHoursLogged || 0} hrs
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(dev)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300 transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleResendInvite(dev)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Resend Invitation & View Credentials"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeveloper(dev)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-colors"
                          title="Remove Staff Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================================================================
          MODAL: MANAGE DEPARTMENTS
      ======================================================================= */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-4 sm:my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-6 h-6 text-sky-400" />
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Organization Departments
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add new functional departments or update existing business units.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDeptModalOpen(false);
                  setEditingDeptId(null);
                  setNewDeptName('');
                  setNewDeptDesc('');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing Departments List */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Active Departments ({departments.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-3 group hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: dept.color || '#38bdf8' }}
                        />
                        <span className="text-xs font-bold text-white truncate">{dept.name}</span>
                      </div>
                      {dept.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{dept.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                        <span>{dept.staffCount || 0} Staff</span>
                        <span>•</span>
                        <span>{dept.tasksCount || 0} Tasks</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDeptId(dept.id);
                          setNewDeptName(dept.name);
                          setNewDeptDesc(dept.description || '');
                          setNewDeptColor(dept.color || '#38bdf8');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300"
                        title="Edit Department"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDepartment(dept)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400"
                        title="Delete Department"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create / Edit Department Form */}
            <form onSubmit={handleSaveDepartment} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" />
                  {editingDeptId ? 'Edit Department Details' : 'Create New Department'}
                </h4>
                {editingDeptId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDeptId(null);
                      setNewDeptName('');
                      setNewDeptDesc('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Strategic Marketing & Media, Legal & Compliance, Operations..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description / Function
                </label>
                <input
                  type="text"
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  placeholder="e.g. Brand initiatives, market expansion, and communications strategy"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Department Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {DEPARTMENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNewDeptColor(c.value)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        newDeptColor === c.value
                          ? 'border-white bg-slate-800 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.value }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={deptSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {deptSaving ? 'Saving...' : editingDeptId ? 'Save Changes' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: ADD STAFF MEMBER
      ======================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl relative my-4 sm:my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 sm:px-8 py-5 bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-sky-400" /> Onboard New Staff Member
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Create staff credentials, assign department affiliation, set compensation, and allocate to projects.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 ml-4"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDeveloper} className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@azariahmg.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Department Assignment */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Department Assignment *
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomDeptInput(!customDeptInput)}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    {customDeptInput ? 'Select from list' : '+ Custom Department'}
                  </button>
                </div>

                {customDeptInput ? (
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    placeholder="Enter custom department name..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                ) : (
                  <select
                    value={departmentId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setDepartmentId(id);
                      const found = departments.find(d => d.id === id);
                      if (found) setDepartmentName(found.name);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Marketing Specialist, Lead Architect, Financial Analyst..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 240-555-0199"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Compensation Model & Paytime Architecture */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    Compensation Model
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {compensationType === 'hourly' && '⏱️ Pay per logged hour'}
                    {compensationType === 'salary' && '💼 Fixed recurring salary'}
                    {compensationType === 'contract' && '📜 Paid based on contract / milestones'}
                  </span>
                </div>

                {/* Segmented Toggle: Hourly / Salary / Contract */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCompensationType('hourly');
                      if (paytime !== 'hourly' && paytime !== 'weekly' && paytime !== 'biweekly' && paytime !== 'monthly') {
                        setPaytime('hourly');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      compensationType === 'hourly'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hourly Rate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCompensationType('salary');
                      if (paytime !== 'monthly' && paytime !== 'biweekly' && paytime !== 'semimonthly' && paytime !== 'weekly') {
                        setPaytime('monthly');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      compensationType === 'salary'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Fixed Salary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCompensationType('contract');
                      if (paytime !== 'contract' && paytime !== 'milestone' && paytime !== 'retainer') {
                        setPaytime('contract');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      compensationType === 'contract'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Paid on Contract</span>
                  </button>
                </div>

                {/* Conditional Inputs based on selected Compensation Model */}
                {compensationType === 'hourly' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Hourly Rate
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : '')}
                        placeholder="45.00"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="GHS">GHS (GH₵)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Paytime / Frequency
                      </label>
                      <select
                        value={paytime}
                        onChange={(e) => setPaytime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="hourly">Hourly (Per Session / Clock-out)</option>
                        <option value="weekly">Weekly (Every Friday)</option>
                        <option value="biweekly">Bi-Weekly (Every 2 Weeks)</option>
                        <option value="monthly">Monthly (End of Month)</option>
                      </select>
                    </div>
                  </div>
                )}

                {compensationType === 'salary' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Salary Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : '')}
                        placeholder="5000.00"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="GHS">GHS (GH₵)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Paytime / Frequency
                      </label>
                      <select
                        value={paytime}
                        onChange={(e) => setPaytime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="monthly">Monthly (End of Month)</option>
                        <option value="biweekly">Bi-Weekly (1st & 15th / Every 2 Wks)</option>
                        <option value="semimonthly">Semi-Monthly (Twice a month)</option>
                        <option value="weekly">Weekly (Every Friday)</option>
                        <option value="annual">Annual / Quarterly</option>
                      </select>
                    </div>
                  </div>
                )}

                {compensationType === 'contract' && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Contract Value / Sum
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={contractAmount}
                          onChange={(e) => setContractAmount(e.target.value ? Number(e.target.value) : '')}
                          placeholder="12000.00"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="GHS">GHS (GH₵)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD ($)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Paytime / Terms
                        </label>
                        <select
                          value={paytime}
                          onChange={(e) => setPaytime(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="contract">Paid Based on Contract / Milestone</option>
                          <option value="milestone">Milestone Deliverable Sign-off</option>
                          <option value="upfront_50_50">50% Advance, 50% on Delivery</option>
                          <option value="retainer">Monthly Contract Retainer</option>
                          <option value="delivery">End of Project Full Delivery</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Contract Scope & Payment Terms (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={contractTerms}
                        onChange={(e) => setContractTerms(e.target.value)}
                        placeholder="e.g. Full delivery of module deliverables, disbursements release on milestone QA sign-off..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Password Generator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Initial Login Password
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Project Assignments */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Assign to Projects
                </label>
                {projects.length === 0 ? (
                  <p className="text-xs text-slate-500">No projects created yet. Create projects in the Projects tab.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    {projects.map((p) => {
                      const isSelected = assignedProjectIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs border transition-colors ${
                            isSelected
                              ? 'bg-sky-500/15 border-sky-500/40 text-white font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAssignedProjectIds([...assignedProjectIds, p.id]);
                              } else {
                                setAssignedProjectIds(assignedProjectIds.filter((id) => id !== p.id));
                              }
                            }}
                            className="rounded border-slate-700 text-sky-500 focus:ring-0"
                          />
                          <span className="truncate">{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Send Email Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-sky-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Dispatch branded HTML welcome email with credentials & access link to staff member
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {saving ? 'Creating Profile...' : 'Create & Onboard Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: EDIT STAFF MEMBER
      ======================================================================= */}
      {editModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl relative my-4 sm:my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 sm:px-8 py-5 bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-sky-400" /> Edit Staff Profile: {editingStaff.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update department, position title, compensation, or reset credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 ml-4"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffEdit} className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={editingStaff.email}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Department Assignment
                  </label>
                  <select
                    value={editDeptId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setEditDeptId(id);
                      const found = departments.find(d => d.id === id);
                      if (found) setEditDeptName(found.name);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    value={editRoleTitle}
                    onChange={(e) => setEditRoleTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Edit Compensation Model & Paytime Architecture */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    Compensation Model
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {editCompensationType === 'hourly' && '⏱️ Pay per logged hour'}
                    {editCompensationType === 'salary' && '💼 Fixed recurring salary'}
                    {editCompensationType === 'contract' && '📜 Paid based on contract / milestones'}
                  </span>
                </div>

                {/* Segmented Toggle: Hourly / Salary / Contract */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setEditCompensationType('hourly');
                      if (editPaytime !== 'hourly' && editPaytime !== 'weekly' && editPaytime !== 'biweekly' && editPaytime !== 'monthly') {
                        setEditPaytime('hourly');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      editCompensationType === 'hourly'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hourly Rate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditCompensationType('salary');
                      if (editPaytime !== 'monthly' && editPaytime !== 'biweekly' && editPaytime !== 'semimonthly' && editPaytime !== 'weekly') {
                        setEditPaytime('monthly');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      editCompensationType === 'salary'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Fixed Salary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditCompensationType('contract');
                      if (editPaytime !== 'contract' && editPaytime !== 'milestone' && editPaytime !== 'retainer') {
                        setEditPaytime('contract');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      editCompensationType === 'contract'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Paid on Contract</span>
                  </button>
                </div>

                {/* Conditional Inputs based on selected Compensation Model */}
                {editCompensationType === 'hourly' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Hourly Rate
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editHourlyRate}
                        onChange={(e) => setEditHourlyRate(e.target.value ? Number(e.target.value) : '')}
                        placeholder="45.00"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Currency
                      </label>
                      <select
                        value={editCurrency}
                        onChange={(e) => setEditCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="GHS">GHS (GH₵)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Paytime / Frequency
                      </label>
                      <select
                        value={editPaytime}
                        onChange={(e) => setEditPaytime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="hourly">Hourly (Per Session / Clock-out)</option>
                        <option value="weekly">Weekly (Every Friday)</option>
                        <option value="biweekly">Bi-Weekly (Every 2 Weeks)</option>
                        <option value="monthly">Monthly (End of Month)</option>
                      </select>
                    </div>
                  </div>
                )}

                {editCompensationType === 'salary' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Salary Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editSalary}
                        onChange={(e) => setEditSalary(e.target.value ? Number(e.target.value) : '')}
                        placeholder="5000.00"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Currency
                      </label>
                      <select
                        value={editCurrency}
                        onChange={(e) => setEditCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="GHS">GHS (GH₵)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Paytime / Frequency
                      </label>
                      <select
                        value={editPaytime}
                        onChange={(e) => setEditPaytime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="monthly">Monthly (End of Month)</option>
                        <option value="biweekly">Bi-Weekly (1st & 15th / Every 2 Wks)</option>
                        <option value="semimonthly">Semi-Monthly (Twice a month)</option>
                        <option value="weekly">Weekly (Every Friday)</option>
                        <option value="annual">Annual / Quarterly</option>
                      </select>
                    </div>
                  </div>
                )}

                {editCompensationType === 'contract' && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Contract Value / Sum
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editContractAmount}
                          onChange={(e) => setEditContractAmount(e.target.value ? Number(e.target.value) : '')}
                          placeholder="12000.00"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Currency
                        </label>
                        <select
                          value={editCurrency}
                          onChange={(e) => setEditCurrency(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="GHS">GHS (GH₵)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD ($)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Paytime / Terms
                        </label>
                        <select
                          value={editPaytime}
                          onChange={(e) => setEditPaytime(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="contract">Paid Based on Contract / Milestone</option>
                          <option value="milestone">Milestone Deliverable Sign-off</option>
                          <option value="upfront_50_50">50% Advance, 50% on Delivery</option>
                          <option value="retainer">Monthly Contract Retainer</option>
                          <option value="delivery">End of Project Full Delivery</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Contract Scope & Payment Terms (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={editContractTerms}
                        onChange={(e) => setEditContractTerms(e.target.value)}
                        placeholder="e.g. Full delivery of module deliverables, disbursements release on milestone QA sign-off..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reset Password (Leave blank to keep existing password)
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password if resetting..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-emerald-400 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {editSaving ? 'Updating...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: COPY CREDENTIALS TO CLIPBOARD
      ======================================================================= */}
      {credsModalOpen && latestCreds && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 flex justify-center items-start">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-7 shadow-2xl relative my-auto sm:my-12">
            <div className="flex items-center gap-3 mb-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-black uppercase tracking-wider text-white">
                Staff Credentials Ready
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              The staff account has been provisioned. You can copy the credentials below to dispatch them via WhatsApp, Slack, or SMS:
            </p>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider block">
                  Staff Member
                </span>
                <span className="text-white font-bold">{latestCreds.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider block">
                  Department & Role
                </span>
                <span className="text-sky-400 font-bold">{latestCreds.department} — {latestCreds.role}</span>
              </div>
              {latestCreds.compensationSummary && (
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider block">
                    Compensation
                  </span>
                  <span className="text-amber-400 font-bold">{latestCreds.compensationSummary}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider block">
                  Portal Login URL
                </span>
                <span className="text-sky-400 break-all">{latestCreds.portalUrl}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider block">
                  Login Email
                </span>
                <span className="text-white font-bold">{latestCreds.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider block">
                  Password
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {latestCreds.password}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white shadow-lg shadow-sky-600/25'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy All Credentials'}
              </button>
              <button
                type="button"
                onClick={() => setCredsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDevelopersTab;
