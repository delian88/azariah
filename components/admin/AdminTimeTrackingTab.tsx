import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Calendar,
  Users,
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Printer
} from 'lucide-react';
import { printAdminTimeTrackingReport } from '../../services/reportPrinter';
import {
  developerService,
  TimeLog,
  Developer,
  Project,
  formatLocalTime,
  formatLocalDate,
  getClientTimezone
} from '../../services/developerService';

interface AdminTimeTrackingTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminTimeTrackingTab: React.FC<AdminTimeTrackingTabProps> = ({ showToast }) => {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [activeNow, setActiveNow] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalLogs: 0,
    totalMinutes: 0,
    totalHours: 0,
    activeDevelopersCount: 0
  });

  // Filters
  const [selectedDevId, setSelectedDevId] = useState<number | ''>('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [logsRes, devsRes, projsRes] = await Promise.all([
        developerService.adminGetTimeLogs({
          developerId: selectedDevId ? Number(selectedDevId) : undefined,
          projectId: selectedProjectId ? Number(selectedProjectId) : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          limit: 200
        }),
        developerService.adminGetDevelopers(),
        developerService.adminGetProjects()
      ]);

      if (logsRes.success) {
        setLogs(logsRes.logs || []);
        setActiveNow(logsRes.activeNow || []);
        if (logsRes.metrics) {
          setMetrics(logsRes.metrics);
        }
      }

      if (devsRes.success && devsRes.developers) {
        setDevelopers(devsRes.developers);
      }
      if (projsRes.success && projsRes.projects) {
        setProjects(projsRes.projects);
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to fetch time logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedDevId, selectedProjectId, startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" /> Developer Time Tracking & Attendance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time developer attendance monitoring, shift histories, and billable engineering hours across projects.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              const selectedDev = developers.find((d) => d.id === selectedDevId);
              const selectedProj = projects.find((p) => p.id === selectedProjectId);
              printAdminTimeTrackingReport({
                logs,
                metrics,
                selectedDevName: selectedDev ? selectedDev.name : undefined,
                selectedProjectName: selectedProj ? selectedProj.name : undefined,
                startDate,
                endDate
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shadow-sm"
            title="Print Attendance & Shift Records Report (Clean Data)"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" /> Print Audit Report
          </button>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
          </button>
        </div>
      </div>

      {/* LIVE "WORKING RIGHT NOW" BANNER */}
      {activeNow.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Active Developers Currently Clocked In ({activeNow.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeNow.map((a) => (
              <div key={a.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-white text-xs">{a.name}</div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    {Math.floor(a.elapsedMinutes / 60)}h {a.elapsedMinutes % 60}m
                  </span>
                </div>
                <div className="text-[11px] text-sky-400 font-medium">
                  {a.projectName || 'General Development'}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Clocked in at {formatLocalTime(a.clockIn)}</span>
                  {a.clientTimezone && (
                    <span className="text-[9px] text-sky-400/80 font-mono">
                      {a.clientTimezone}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Logged Hours</span>
          <div className="text-2xl font-black text-white mt-1">
            {metrics.totalHours} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Shift Sessions</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{metrics.totalLogs}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Active Online Right Now</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{metrics.activeDevelopersCount}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Registered Developers</span>
          <div className="text-2xl font-black text-purple-400 mt-1">{developers.length}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Filter by Developer
          </label>
          <select
            value={selectedDevId}
            onChange={(e) => setSelectedDevId(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Developers</option>
            {developers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.roleTitle})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Filter by Project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Time Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Developer</th>
                <th className="py-3.5 px-5">Project</th>
                <th className="py-3.5 px-5">Clock In</th>
                <th className="py-3.5 px-5">Clock Out</th>
                <th className="py-3.5 px-5">Duration</th>
                <th className="py-3.5 px-5">Task Summary</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No time logs match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5 text-white font-semibold whitespace-nowrap">
                      {formatLocalDate(log.clockIn)}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-white">{log.developerName}</div>
                      <div className="text-[10px] text-slate-400">{log.developerRole}</div>
                    </td>
                    <td className="py-4 px-5 text-sky-400 font-semibold">{log.projectName || 'General Development'}</td>
                    <td className="py-4 px-5 text-slate-300 whitespace-nowrap">
                      <div>{formatLocalTime(log.clockIn, false)}</div>
                      {log.clientTimezone && (
                        <div className="text-[9px] text-slate-500 font-mono">{log.clientTimezone}</div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-slate-300 whitespace-nowrap">
                      {log.clockOut ? formatLocalTime(log.clockOut, false) : '—'}
                    </td>
                    <td className="py-4 px-5 font-bold text-white whitespace-nowrap">
                      {log.isActive ? (
                        <span className="text-emerald-400 animate-pulse">Running live</span>
                      ) : (
                        `${log.totalHours} hrs`
                      )}
                    </td>
                    <td className="py-4 px-5 text-slate-400 max-w-xs truncate" title={log.taskSummary}>
                      {log.taskSummary || 'Session complete.'}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      {log.isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Active Now
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                          Logged
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTimeTrackingTab;
