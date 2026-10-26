import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderPlus,
  Layers,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  Edit2,
  RefreshCw
} from 'lucide-react';
import {
  developerService,
  Project,
  Developer,
  Milestone
} from '../../services/developerService';

interface AdminProjectsTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({ showToast }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number | ''>(5000);
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState<Project['status']>('in_progress');
  const [launchDate, setLaunchDate] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedDevIds, setSelectedDevIds] = useState<number[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: 'Project Kickoff & Architecture Blueprint', status: 'completed', dueDate: '' },
    { title: 'Core Backend Engine & Database Schema', status: 'in_progress', dueDate: '' },
    { title: 'Frontend UI Implementation & Client Review', status: 'pending', dueDate: '' },
    { title: 'Production QA & Final Deployment', status: 'pending', dueDate: '' }
  ]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [projsRes, devsRes] = await Promise.all([
        developerService.adminGetProjects(),
        developerService.adminGetDevelopers()
      ]);
      if (projsRes.success && projsRes.projects) {
        setProjects(projsRes.projects);
      }
      if (devsRes.success && devsRes.developers) {
        setDevelopers(devsRes.developers);
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProjectId(null);
    setName('');
    setDescription('');
    setBudget(5000);
    setCurrency('USD');
    setStatus('in_progress');
    setLaunchDate('');
    setRepoUrl('');
    setSelectedDevIds([]);
    setMilestones([
      { title: 'Architecture & Specifications', status: 'completed', dueDate: '' },
      { title: 'Core Feature Delivery', status: 'in_progress', dueDate: '' },
      { title: 'Testing & Quality Assurance', status: 'pending', dueDate: '' },
      { title: 'Official Launch & Handover', status: 'pending', dueDate: '' }
    ]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (p: Project) => {
    setEditingProjectId(p.id);
    setName(p.name);
    setDescription(p.description || '');
    setBudget(p.budget || 0);
    setCurrency(p.currency || 'USD');
    setStatus(p.status);
    setLaunchDate(p.launchDate || '');
    setRepoUrl(p.repoUrl || '');
    setSelectedDevIds(p.developers ? p.developers.map((d) => d.id) : []);
    setMilestones(
      p.milestones && p.milestones.length > 0
        ? p.milestones.map((m) => ({ title: m.title, description: m.description, dueDate: m.dueDate, status: m.status }))
        : [{ title: 'Main Deliverable', status: 'pending' }]
    );
    setModalOpen(true);
  };

  const handleAddMilestoneRow = () => {
    setMilestones([...milestones, { title: '', status: 'pending', dueDate: '' }]);
  };

  const handleRemoveMilestoneRow = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Project name is required', 'error');
      return;
    }

    setSaving(true);
    let res;
    if (editingProjectId) {
      res = await developerService.adminUpdateProject({
        id: editingProjectId,
        name,
        description,
        budget: Number(budget) || 0,
        currency,
        status,
        launchDate,
        repoUrl,
        milestones: milestones.filter((m) => m.title.trim() !== ''),
        developerIds: selectedDevIds
      });
    } else {
      res = await developerService.adminCreateProject({
        name,
        description,
        budget: Number(budget) || 0,
        currency,
        status,
        launchDate,
        repoUrl,
        milestones: milestones.filter((m) => m.title.trim() !== ''),
        developerIds: selectedDevIds
      });
    }
    setSaving(false);

    if (res.success) {
      setModalOpen(false);
      showToast(editingProjectId ? 'Project updated successfully' : 'Project created successfully');
      fetchAll();
    } else {
      showToast(res.error || 'Failed to save project', 'error');
    }
  };

  const handleDeleteProject = async (p: Project) => {
    if (!window.confirm(`Are you sure you want to delete project "${p.name}"?`)) return;
    const res = await developerService.adminDeleteProject(p.id);
    if (res.success) {
      showToast(`Project "${p.name}" deleted.`);
      fetchAll();
    } else {
      showToast(res.error || 'Failed to delete project', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-sky-400" /> Projects & Strategic Milestones
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Define corporate software projects, allocate budgets, set target launch dates, and assign engineers.
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
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/25 transition-all"
          >
            <FolderPlus className="w-4 h-4" /> Create Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            No projects created yet. Click <strong>Create Project</strong> above to define your first corporate project!
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{proj.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.description || 'No description provided.'}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                      proj.status === 'launched'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : proj.status === 'in_progress'
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <Layers className="w-3.5 h-3.5 text-sky-400" /> Milestones Progress
                    </span>
                    <span className="font-mono text-white font-bold">{proj.progressPercent || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${proj.progressPercent || 0}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {proj.completedMilestonesCount || 0} of {proj.milestonesCount || 0} milestones completed
                  </div>
                </div>

                {/* Financials & Target Date */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Budget</span>
                    <span className="text-white font-bold font-mono">
                      {proj.currency} {Number(proj.budget).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Target Launch</span>
                    <span className="text-slate-300">{proj.launchDate || 'To be decided'}</span>
                  </div>
                </div>

                {/* Assigned Developers */}
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold mb-1.5">
                    Engineering Team ({proj.developers ? proj.developers.length : 0})
                  </span>
                  {proj.developers && proj.developers.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.developers.map((d) => (
                        <span
                          key={d.id}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-950 border border-slate-800 text-sky-300 flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          {d.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No developers assigned</span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                {proj.repoUrl ? (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Repo <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-slate-600">No public repo</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =======================================================================
          MODAL: CREATE / EDIT PROJECT
      ======================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-sky-400" />
              {editingProjectId ? 'Update Project & Milestones' : 'Create New Project'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Configure project goals, target completion milestones, allocated budget, and developer team assignments.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CreAItube Autonomous Media Engine"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Project Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of project goals, target audience, and business impact..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Budget
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : '')}
                    placeholder="10000"
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
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="launched">Launched</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Launch Date
                  </label>
                  <input
                    type="date"
                    value={launchDate}
                    onChange={(e) => setLaunchDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Milestones Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-400" /> Milestones & Key Deliverables
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMilestoneRow}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                      <input
                        type="text"
                        required
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].title = e.target.value;
                          setMilestones(updated);
                        }}
                        placeholder="Milestone title..."
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="date"
                        value={m.dueDate || ''}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].dueDate = e.target.value;
                          setMilestones(updated);
                        }}
                        className="w-36 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-[11px] text-white focus:outline-none focus:border-sky-500"
                      />
                      <select
                        value={m.status}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].status = e.target.value as any;
                          setMilestones(updated);
                        }}
                        className="w-28 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-[11px] text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestoneRow(idx)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Developer Team Assignments */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Assign Team Engineers
                </label>
                {developers.length === 0 ? (
                  <p className="text-xs text-slate-500">No developers available yet. Add them in Developers tab.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    {developers.map((d) => {
                      const isAssigned = selectedDevIds.includes(d.id);
                      return (
                        <label
                          key={d.id}
                          className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs border transition-colors ${
                            isAssigned
                              ? 'bg-sky-500/15 border-sky-500/40 text-white font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDevIds([...selectedDevIds, d.id]);
                              } else {
                                setSelectedDevIds(selectedDevIds.filter((id) => id !== d.id));
                              }
                            }}
                            className="rounded border-slate-700 text-sky-500 focus:ring-0"
                          />
                          <div className="truncate">
                            <span className="font-bold">{d.name}</span>
                            <span className="text-[10px] text-slate-500 block">{d.roleTitle}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
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
                  {saving ? 'Saving...' : editingProjectId ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsTab;
