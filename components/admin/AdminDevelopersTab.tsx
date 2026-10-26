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
  DollarSign
} from 'lucide-react';
import {
  developerService,
  Developer,
  Project
} from '../../services/developerService';

interface AdminDevelopersTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDevelopersTab: React.FC<AdminDevelopersTabProps> = ({ showToast }) => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Developer Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Full Stack Engineer');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(45);
  const [currency, setCurrency] = useState('USD');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [assignedProjectIds, setAssignedProjectIds] = useState<number[]>([]);
  const [sendEmail, setSendEmail] = useState(true);

  // Credentials Ready Modal State (for immediate Copy to Clipboard)
  const [credsModalOpen, setCredsModalOpen] = useState(false);
  const [latestCreds, setLatestCreds] = useState<{
    name: string;
    email: string;
    password: string;
    portalUrl: string;
    role?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit Developer Modal State
  const [editingDev, setEditingDev] = useState<Developer | null>(null);
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [devsRes, projsRes] = await Promise.all([
        developerService.adminGetDevelopers(),
        developerService.adminGetProjects()
      ]);
      if (devsRes.success && devsRes.developers) {
        setDevelopers(devsRes.developers);
      }
      if (projsRes.success && projsRes.projects) {
        setProjects(projsRes.projects);
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to fetch developers', 'error');
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
    setRoleTitle('Full Stack Engineer');
    setHourlyRate(45);
    setCurrency('USD');
    setPhone('');
    setAssignedProjectIds([]);
    setSendEmail(true);
    generatePassword();
    setModalOpen(true);
  };

  const handleSaveDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Name and email are required', 'error');
      return;
    }

    setSaving(true);
    const res = await developerService.adminCreateDeveloper({
      name,
      email,
      roleTitle,
      hourlyRate: Number(hourlyRate) || 0,
      currency,
      phone,
      password,
      assignedProjectIds,
      sendEmail
    });
    setSaving(false);

    if (res.success && res.developer) {
      setModalOpen(false);
      showToast(`Developer ${res.developer.name} added successfully!`);
      if (res.credentials) {
        setLatestCreds({
          name: res.credentials.name,
          email: res.credentials.email,
          password: res.credentials.password,
          portalUrl: res.credentials.portalUrl,
          role: roleTitle
        });
        setCredsModalOpen(true);
      }
      fetchAll();
    } else {
      showToast(res.error || 'Failed to create developer', 'error');
    }
  };

  const handleCopyCredentials = () => {
    if (!latestCreds) return;
    const text = `AZARIAH MANAGEMENT GROUP — DEVELOPER PORTAL ACCESS
Portal URL: ${latestCreds.portalUrl}
Login Email: ${latestCreds.email}
Password: ${latestCreds.password}
Role: ${latestCreds.role || 'Developer'}

Please sign in and verify your profile.`;

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
          role: dev.roleTitle
        });
        setCredsModalOpen(true);
      }
    } else {
      showToast(res.error || 'Failed to resend invitation', 'error');
    }
  };

  const handleDeleteDeveloper = async (dev: Developer) => {
    if (!window.confirm(`Are you sure you want to remove developer "${dev.name}"? This will unlink their time logs.`)) {
      return;
    }
    const res = await developerService.adminDeleteDeveloper(dev.id);
    if (res.success) {
      showToast(`Developer "${dev.name}" removed.`);
      fetchAll();
    } else {
      showToast(res.error || 'Failed to delete developer', 'error');
    }
  };

  const filteredDevelopers = developers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" /> Developers & Engineering Team
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provision developer profiles, assign project portfolios, dispatch credentials, and track attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/25 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Developer
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search developers by name, email, or role title..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Developers Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Developer</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Hourly Rate</th>
                <th className="py-3.5 px-5">Assigned Projects</th>
                <th className="py-3.5 px-5">Work Status</th>
                <th className="py-3.5 px-5">Hours Logged</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredDevelopers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No developers found. Click <strong>Add Developer</strong> above to onboard your first team member!
                  </td>
                </tr>
              ) : (
                filteredDevelopers.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{dev.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{dev.email}</div>
                    </td>
                    <td className="py-4 px-5 text-sky-400 font-semibold">{dev.roleTitle}</td>
                    <td className="py-4 px-5 text-white font-mono font-semibold">
                      {dev.currency} {Number(dev.hourlyRate).toFixed(2)}/hr
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
                        onClick={() => handleResendInvite(dev)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Resend Invitation & View Credentials"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeveloper(dev)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-colors"
                        title="Remove Developer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================================================================
          MODAL: ADD DEVELOPER
      ======================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-sky-400" /> Onboard New Developer
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Create credentials, set compensation, and assign to ongoing corporate projects.
            </p>

            <form onSubmit={handleSaveDeveloper} className="space-y-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : '')}
                    placeholder="45.00"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
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
                    Dispatch branded HTML welcome email with credentials & access link to developer
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
                  {saving ? 'Creating Profile...' : 'Create & Onboard Developer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: COPY CREDENTIALS TO CLIPBOARD (User requested requirement!)
      ======================================================================= */}
      {credsModalOpen && latestCreds && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-7 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-black uppercase tracking-wider text-white">
                Developer Credentials Ready
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              The developer account has been generated. You can copy the credentials below to send them via WhatsApp, Slack, or SMS:
            </p>

            {/* Credentials Card Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider block">
                  Developer Name
                </span>
                <span className="text-white font-bold">{latestCreds.name}</span>
              </div>
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
