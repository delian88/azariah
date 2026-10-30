import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Clock,
  Play,
  Square,
  CheckCircle2,
  Calendar,
  DollarSign,
  FileText,
  Printer,
  LogOut,
  Folder,
  Check,
  ChevronRight,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowLeft,
  KeyRound,
  Shield,
  ShieldCheck,
  Code2,
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';
import {
  developerService,
  Developer,
  Project,
  TimeLog,
  TimeStatus,
  Payslip,
  getDeveloperToken,
  setDeveloperToken,
  clearDeveloperSession,
  getSavedDeveloperUser,
  parseServerDate,
  formatLocalTime,
  formatLocalDate,
  getClientTimezone
} from '../services/developerService';
import {
  printTimeLogsReport,
  printProjectsReport,
  printPayslipsReport,
  printSinglePayslipVoucher
} from '../services/reportPrinter';
import Logo from './Logo';

interface DeveloperPortalProps {
  onBackToHome: () => void;
}

export const DeveloperPortal: React.FC<DeveloperPortalProps> = ({ onBackToHome }) => {
  // Session State
  const [token, setToken] = useState<string | null>(getDeveloperToken);
  const [developer, setDeveloper] = useState<Developer | null>(getSavedDeveloperUser);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'tracker' | 'projects' | 'payslips'>('tracker');

  // Time Tracker State
  const [timeStatus, setTimeStatus] = useState<TimeStatus | null>(null);
  const [clockLoading, setClockLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [clockInNotes, setClockInNotes] = useState('');
  const [clockOutModalOpen, setClockOutModalOpen] = useState(false);
  const [clockOutSummary, setClockOutSummary] = useState('');

  // Live Timer
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef<any>(null);

  // Data Collections
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Selected Payslip for Voucher Modal / Print
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [confirmingPayslipId, setConfirmingPayslipId] = useState<number | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ---------------------------------------------------------------------------
  // Load Developer Data
  // ---------------------------------------------------------------------------
  const refreshAllData = useCallback(async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const [statusRes, logsRes, projectsRes, payslipsRes] = await Promise.all([
        developerService.getDevTimeStatus(),
        developerService.getDevTimeHistory(100),
        developerService.getDevAssignedProjects(),
        developerService.getDevPayslips()
      ]);

      if (statusRes.success) {
        setTimeStatus({
          isClockedIn: Boolean(statusRes.isClockedIn),
          activeSession: statusRes.activeSession,
          metrics: statusRes.metrics || {
            todayHours: 0,
            todayMinutes: 0,
            weeklyHours: 0,
            weeklyMinutes: 0,
            monthlyHours: 0,
            monthlyMinutes: 0,
            lifetimeHours: 0
          }
        });
      }

      if (logsRes.success && logsRes.logs) {
        setTimeLogs(logsRes.logs);
      }

      if (projectsRes.success && projectsRes.projects) {
        setProjects(projectsRes.projects);
      }

      if (payslipsRes.success && payslipsRes.payslips) {
        setPayslips(payslipsRes.payslips);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to sync developer portal data', 'error');
    } finally {
      setLoadingData(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshAllData();
    }
  }, [token, refreshAllData]);

  // Live Timer Effect while clocked in (Real-time stopwatch starting at 00:00:00)
  useEffect(() => {
    if (timeStatus?.isClockedIn && timeStatus.activeSession?.clockIn) {
      const startTime = parseServerDate(timeStatus.activeSession.clockIn).getTime();
      const updateTimer = () => {
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
        setLiveElapsedSeconds(diffSeconds);
      };
      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } else {
      setLiveElapsedSeconds(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timeStatus?.isClockedIn, timeStatus?.activeSession?.clockIn]);

  // Format stopwatch seconds -> HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // ---------------------------------------------------------------------------
  // AUTH: Login & Logout
  // ---------------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter your email and password');
      return;
    }
    setLoginLoading(true);
    setLoginError('');

    const res = await developerService.devLogin(loginEmail, loginPassword);
    setLoginLoading(false);

    if (res.success && res.token && res.developer) {
      setDeveloperToken(res.token, res.developer);
      setToken(res.token);
      setDeveloper(res.developer);
      showToast(`Welcome back, ${res.developer.name}!`);
    } else {
      setLoginError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleLogout = () => {
    clearDeveloperSession();
    setToken(null);
    setDeveloper(null);
    setTimeStatus(null);
    setTimeLogs([]);
    setProjects([]);
    setPayslips([]);
  };

  // ---------------------------------------------------------------------------
  // CLOCK IN / CLOCK OUT HANDLERS
  // ---------------------------------------------------------------------------
  const handleClockIn = async () => {
    setClockLoading(true);
    const pId = selectedProjectId ? Number(selectedProjectId) : null;
    const clientTimestamp = new Date().toISOString();
    const clientTimezone = getClientTimezone();

    // Immediately start live timer from 0 seconds so UI begins at 00:00:00 in real time
    setLiveElapsedSeconds(0);

    const res = await developerService.devClockIn(pId, clockInNotes, clientTimestamp, clientTimezone);
    setClockLoading(false);

    if (res.success) {
      showToast('You are now clocked in. Session timer started at 00:00:00.');
      setClockInNotes('');
      // Set active session in state immediately with client timestamp fallback
      const activeClockIn = res.session?.clockIn || clientTimestamp;
      setTimeStatus((prev) => ({
        isClockedIn: true,
        activeSession: {
          id: res.session?.id || Date.now(),
          clockIn: activeClockIn,
          projectId: pId,
          projectName: projects.find((p) => p.id === pId)?.name || 'General Development',
          elapsedMinutes: 0,
          taskSummary: clockInNotes
        },
        metrics: prev?.metrics || {
          todayHours: 0,
          todayMinutes: 0,
          weeklyHours: 0,
          weeklyMinutes: 0,
          monthlyHours: 0,
          monthlyMinutes: 0,
          lifetimeHours: 0
        }
      }));
      refreshAllData();
    } else {
      showToast(res.error || 'Clock in failed', 'error');
    }
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    const clientTimestamp = new Date().toISOString();
    const res = await developerService.devClockOut(clockOutSummary, clientTimestamp, false);
    setClockLoading(false);
    setClockOutModalOpen(false);
    setClockOutSummary('');

    if (res.success) {
      showToast(res.message || 'Clock out successful');
      setLiveElapsedSeconds(0);
      setTimeStatus((prev) => (prev ? { ...prev, isClockedIn: false, activeSession: null } : null));
      refreshAllData();
    } else {
      showToast(res.error || 'Clock out failed', 'error');
    }
  };

  const handleDiscardSession = async () => {
    if (!window.confirm('Are you sure you want to discard this active session? The counter will reset to 00:00:00 and no time will be recorded.')) {
      return;
    }
    setClockLoading(true);
    const res = await developerService.devClockOut('', undefined, true);
    setClockLoading(false);
    setClockOutModalOpen(false);

    if (res.success) {
      showToast('Active session discarded. Counter reset.');
      setLiveElapsedSeconds(0);
      setTimeStatus((prev) => (prev ? { ...prev, isClockedIn: false, activeSession: null } : null));
      refreshAllData();
    } else {
      showToast(res.error || 'Failed to discard session', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // PAYSLIP CONFIRMATION
  // ---------------------------------------------------------------------------
  const handleConfirmPayment = async (payslip: Payslip) => {
    setConfirmingPayslipId(payslip.id);
    const res = await developerService.confirmPayslipPayment(payslip.id);
    setConfirmingPayslipId(null);

    if (res.success) {
      showToast(res.message || 'Payment confirmed successfully');
      setPayslips((prev) =>
        prev.map((p) => (p.id === payslip.id ? { ...p, status: 'confirmed', confirmedAt: res.confirmedAt || new Date().toISOString() } : p))
      );
      if (selectedPayslip?.id === payslip.id) {
        setSelectedPayslip({ ...selectedPayslip, status: 'confirmed', confirmedAt: res.confirmedAt || new Date().toISOString() });
      }
    } else {
      showToast(res.error || 'Failed to confirm payment', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // PRINT PURE DATA REPORT FOR CURRENT TAB
  // ---------------------------------------------------------------------------
  const handlePrintCurrentTab = (targetTab?: 'tracker' | 'projects' | 'payslips') => {
    const tabToPrint = targetTab || activeTab;
    if (tabToPrint === 'tracker') {
      printTimeLogsReport({
        developer,
        timeLogs,
        metrics: timeStatus?.metrics
      });
    } else if (tabToPrint === 'projects') {
      printProjectsReport({
        developer,
        projects
      });
    } else if (tabToPrint === 'payslips') {
      printPayslipsReport({
        developer,
        payslips
      });
    }
  };

  // ===========================================================================
  // RENDER: LOGIN SCREEN (If not authenticated)
  // ===========================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Website
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" /> Engineer Portal
            </div>
          </div>

          {/* Portal Toggle Switch (Developer Active) */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#admin';
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800/80 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              <span>Admin Console</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] bg-slate-900 text-sky-400 border border-sky-500/60 shadow-[0_0_12px_rgba(56,189,248,0.18)]"
            >
              <Code2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Developer Portal</span>
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Developer Command</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in with the credentials dispatched to your email</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Developer Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@azariahmg.com"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/25 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Access Portal →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              Forgot credentials or need invite access? Contact your project lead or{' '}
              <a href="mailto:support@azariahmg.com" className="text-sky-400 hover:underline">
                support@azariahmg.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: AUTHENTICATED DEVELOPER PORTAL
  // ===========================================================================
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/95 border-red-500/30 text-red-300'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-white text-base">
              AZARIAH <span className="text-sky-400">ENGINEERING</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Developer Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">{developer?.name || 'Developer'}</span>
            <span className="text-[11px] text-slate-400">{developer?.roleTitle || 'Team Engineer'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Portal Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* HERO LIVE TRACKER CARD */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Pulse */}
          {timeStatus?.isClockedIn && (
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Status & Stopwatch */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-3 w-3 relative rounded-full ${
                    timeStatus?.isClockedIn ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  {timeStatus?.isClockedIn && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                  {timeStatus?.isClockedIn ? '🟢 Active Session In Progress' : '⚪ Currently Off Clock'}
                </span>
              </div>

              {timeStatus?.isClockedIn ? (
                <div>
                  <div className="text-4xl sm:text-6xl font-black text-emerald-400 font-mono tracking-tight">
                    {formatTimer(liveElapsedSeconds)}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center flex-wrap gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                    <span>Project: </span>
                    <strong className="text-white">
                      {timeStatus.activeSession?.projectName || 'General Development'}
                    </strong>
                    <span className="text-slate-600">•</span>
                    <span>
                      Clocked in at <strong className="text-slate-200">{formatLocalTime(timeStatus.activeSession?.clockIn)}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-sky-400 border border-slate-700">
                      {getClientTimezone()}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">Ready to begin your shift?</div>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">
                    Select your assigned project below and click Clock In. Your billable hours and milestones will sync live.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Clock In / Clock Out Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!timeStatus?.isClockedIn ? (
                <>
                  <div className="w-full sm:w-60">
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="">General Project / All Tasks</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleClockIn}
                    disabled={clockLoading}
                    className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" /> Clock In
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setClockOutModalOpen(true)}
                    disabled={clockLoading}
                    className="py-3.5 px-6 sm:px-8 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4 fill-white" /> Clock Out
                  </button>
                  <button
                    onClick={handleDiscardSession}
                    disabled={clockLoading}
                    className="py-3.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-red-400 border border-slate-700/80 rounded-xl text-xs font-semibold transition-colors"
                    title="Discard active session and reset counter to 0"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* HOURS BREAKDOWN METRIC TILES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Today's Hours</div>
              <div className="text-2xl font-black text-white mt-1">
                {timeStatus?.metrics.todayHours ?? 0} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">This Week</div>
              <div className="text-2xl font-black text-sky-400 mt-1">
                {timeStatus?.metrics.weeklyHours ?? 0} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">This Month</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {timeStatus?.metrics.monthlyHours ?? 0} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lifetime Logged</div>
              <div className="text-2xl font-black text-purple-400 mt-1">
                {timeStatus?.metrics.lifetimeHours ?? 0} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'tracker'
                ? 'bg-sky-500/15 border border-sky-500/40 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Clock className="w-4 h-4" /> Time Logs ({timeLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'projects'
                ? 'bg-sky-500/15 border border-sky-500/40 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Folder className="w-4 h-4" /> Assigned Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('payslips')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'payslips'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Payslips & Vouchers ({payslips.length})
          </button>
        </div>

        {/* =====================================================================
            TAB 1: TIME LOGS & ATTENDANCE HISTORY
        ===================================================================== */}
        {activeTab === 'tracker' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Clock In / Out History</h3>
                <p className="text-xs text-slate-400">Complete record of your logged sessions and work summaries</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePrintCurrentTab('tracker')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shadow-sm"
                  title="Print Time Logs Report (Clean Data)"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-400" /> Print Report
                </button>
                <button
                  onClick={refreshAllData}
                  disabled={loadingData}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 transition-colors"
                >
                  Sync Now
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5">Project</th>
                    <th className="py-3.5 px-5">Clock In</th>
                    <th className="py-3.5 px-5">Clock Out</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5">Task Summary</th>
                    <th className="py-3.5 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {timeLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No time logs recorded yet. Click <strong>Clock In</strong> above to begin your first session!
                      </td>
                    </tr>
                  ) : (
                    timeLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-5 text-white font-semibold whitespace-nowrap">
                          {formatLocalDate(log.clockIn)}
                        </td>
                        <td className="py-4 px-5 text-sky-400 font-medium">
                          {log.projectName || 'General Development'}
                        </td>
                        <td className="py-4 px-5 text-slate-300 whitespace-nowrap">
                          {formatLocalTime(log.clockIn, false)}
                        </td>
                        <td className="py-4 px-5 text-slate-300 whitespace-nowrap">
                          {log.clockOut ? formatLocalTime(log.clockOut, false) : '—'}
                        </td>
                        <td className="py-4 px-5 font-bold text-white whitespace-nowrap">
                          {log.isActive ? (
                            <span className="text-emerald-400 animate-pulse">Running live</span>
                          ) : (
                            `${log.totalHours} hrs (${log.totalMinutes}m)`
                          )}
                        </td>
                        <td className="py-4 px-5 text-slate-400 max-w-xs truncate" title={log.taskSummary}>
                          {log.taskSummary || 'Session complete.'}
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          {log.isActive ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                              Completed
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
        )}

        {/* =====================================================================
            TAB 2: ASSIGNED PROJECTS & MILESTONES
        ===================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Assigned Corporate Projects</h3>
                <p className="text-xs text-slate-400">Roadmap, deliverables, milestones, and development status</p>
              </div>
              <button
                onClick={() => handlePrintCurrentTab('projects')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
                title="Print Projects & Milestones Report (Clean Data)"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" /> Print Report
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                You have not been assigned to any corporate projects yet. Your administrator will link you shortly.
              </div>
            ) : (
              projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl">{proj.description || 'No description provided.'}</p>
                    </div>

                    <div className="text-right">
                      {proj.launchDate && (
                        <div className="text-xs text-slate-400">
                          Target Launch: <strong className="text-white">{proj.launchDate}</strong>
                        </div>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold mt-1"
                        >
                          Repository <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-sky-400" /> Project Milestones
                    </h4>

                    {(!proj.milestones || proj.milestones.length === 0) ? (
                      <p className="text-xs text-slate-500">No milestones configured for this project yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {proj.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 ${
                              m.status === 'completed'
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                                : 'bg-slate-900 border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                {m.status === 'completed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-slate-600" />
                                )}
                              </div>
                              <div>
                                <div className={`text-xs font-bold ${m.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                                  {m.title}
                                </div>
                                {m.description && <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>}
                              </div>
                            </div>
                            {m.dueDate && (
                              <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                                Due: {m.dueDate}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 3: PAYSLIPS & CONFIRMATION
        ===================================================================== */}
        {activeTab === 'payslips' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payroll & Payment Vouchers</h3>
                  <p className="text-xs text-slate-400">Review disbursements, confirm receipt, and print official statements</p>
                </div>
                <button
                  onClick={() => handlePrintCurrentTab('payslips')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
                  title="Print Disbursements Statement (Clean Data)"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" /> Print Statement
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-5">Voucher Ref</th>
                      <th className="py-3.5 px-5">Billing Period</th>
                      <th className="py-3.5 px-5">Hours Billed</th>
                      <th className="py-3.5 px-5">Hourly Rate</th>
                      <th className="py-3.5 px-5">Total Paid</th>
                      <th className="py-3.5 px-5">Method</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {payslips.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          No payslips recorded yet. Disbursements issued by the administrator will appear here.
                        </td>
                      </tr>
                    ) : (
                      payslips.map((ps) => (
                        <tr key={ps.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-5 text-white font-mono font-bold">{ps.referenceNo}</td>
                          <td className="py-4 px-5 text-slate-300">
                            {ps.periodStart} → {ps.periodEnd}
                          </td>
                          <td className="py-4 px-5 text-slate-300 font-semibold">{ps.hoursBilled} hrs</td>
                          <td className="py-4 px-5 text-slate-300">
                            {ps.currency} {ps.hourlyRate}
                          </td>
                          <td className="py-4 px-5 font-black text-emerald-400 text-sm">
                            {ps.currency} {Number(ps.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-5 text-slate-400">{ps.paymentMethod}</td>
                          <td className="py-4 px-5">
                            {ps.status === 'confirmed' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                                <Check className="w-3 h-3" /> Confirmed
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                Pending Confirmation
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                            {ps.status !== 'confirmed' && (
                              <button
                                onClick={() => handleConfirmPayment(ps)}
                                disabled={confirmingPayslipId === ps.id}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                              >
                                {confirmingPayslipId === ps.id ? 'Confirming...' : 'Confirm Payment'}
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPayslip(ps)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                            >
                              View / Print
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =======================================================================
          MODAL: CLOCK OUT SUMMARY NOTE
      ======================================================================= */}
      {clockOutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Clock Out & Record Accomplishments</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter a brief summary of what tasks and features you achieved during this session.
            </p>

            <textarea
              rows={4}
              value={clockOutSummary}
              onChange={(e) => setClockOutSummary(e.target.value)}
              placeholder="e.g. Implemented time tracking API, integrated clock-in stopwatch, tested payslip printing."
              className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setClockOutModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleClockOut}
                disabled={clockLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {clockLoading ? 'Clocking Out...' : 'Confirm Clock Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: OFFICIAL PRINTABLE PAYSLIP VOUCHER
      ======================================================================= */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative my-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
            {/* Action Bar (Hidden on print) */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 print:hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Voucher Detail</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => selectedPayslip && printSinglePayslipVoucher({ developer, payslip: selectedPayslip })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  title="Print Official Voucher Document (Clean Data)"
                >
                  <Printer className="w-4 h-4" /> Print Voucher
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Voucher Content */}
            <div className="mt-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-6 print:border-slate-300">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                    AZARIAH <span className="text-sky-400 print:text-blue-600">MANAGEMENT GROUP</span>
                  </h1>
                  <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                    Corporate Financial Operations & Engineering Disbursements
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 print:text-slate-600 uppercase">Voucher Ref</div>
                  <div className="text-base font-bold font-mono text-white print:text-black">{selectedPayslip.referenceNo}</div>
                  <div className="text-[11px] text-slate-500 print:text-slate-600 mt-1">Issued: {formatLocalDate(selectedPayslip.issuedAt)}</div>
                </div>
              </div>

              {/* Developer & Period Matrix */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Disbursed To</div>
                  <div className="text-sm font-bold text-white print:text-black mt-0.5">{developer?.name || selectedPayslip.developerName}</div>
                  <div className="text-xs text-slate-400 print:text-slate-600">{developer?.email || selectedPayslip.developerEmail}</div>
                  <div className="text-xs text-sky-400 print:text-blue-600 font-medium">{developer?.roleTitle || selectedPayslip.developerRole}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Billing Window</div>
                  <div className="text-xs font-bold text-white print:text-black mt-0.5">
                    {selectedPayslip.periodStart} to {selectedPayslip.periodEnd}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-2">Disbursement Method</div>
                  <div className="text-xs text-slate-300 print:text-slate-800">{selectedPayslip.paymentMethod}</div>
                </div>
              </div>

              {/* Itemized Calculation Table */}
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 print:bg-slate-100 print:text-black print:border-slate-300">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Hours</th>
                    <th className="p-3 text-right">Hourly Rate</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-slate-200 text-slate-300 print:text-black">
                  <tr>
                    <td className="p-3 font-semibold">Approved Engineering Work Hours</td>
                    <td className="p-3 text-right">{selectedPayslip.hoursBilled} hrs</td>
                    <td className="p-3 text-right">{selectedPayslip.currency} {selectedPayslip.hourlyRate}</td>
                    <td className="p-3 text-right font-bold">
                      {selectedPayslip.currency} {(Number(selectedPayslip.hoursBilled) * Number(selectedPayslip.hourlyRate)).toFixed(2)}
                    </td>
                  </tr>
                  {Number(selectedPayslip.bonus) > 0 && (
                    <tr>
                      <td className="p-3 text-emerald-400 font-semibold">Performance Bonus / Milestone Incentive</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">+{selectedPayslip.currency} {Number(selectedPayslip.bonus).toFixed(2)}</td>
                    </tr>
                  )}
                  {Number(selectedPayslip.deductions) > 0 && (
                    <tr>
                      <td className="p-3 text-rose-400 font-semibold">Withholdings / Deductions</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right text-rose-400 font-bold">-{selectedPayslip.currency} {Number(selectedPayslip.deductions).toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-slate-800 print:border-slate-400">
                  <tr className="text-sm font-black text-white print:text-black">
                    <td colSpan={3} className="p-4 text-right uppercase tracking-wider">Total Disbursed Net</td>
                    <td className="p-4 text-right text-lg text-emerald-400 print:text-emerald-700 font-mono">
                      {selectedPayslip.currency} {Number(selectedPayslip.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {selectedPayslip.notes && (
                <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 print:bg-slate-50 print:border-slate-200 print:text-slate-700">
                  <strong className="text-slate-300 print:text-black">Voucher Memo:</strong> {selectedPayslip.notes}
                </div>
              )}

              {/* Status & Confirmation Footer */}
              <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Disbursement Status</div>
                  <div className="font-bold mt-0.5 text-emerald-400 print:text-emerald-700 flex items-center gap-1.5">
                    {selectedPayslip.status === 'confirmed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Confirmed Receipt by Developer on {selectedPayslip.confirmedAt ? formatLocalDate(selectedPayslip.confirmedAt) : 'Active'}</span>
                      </>
                    ) : (
                      <span className="text-amber-400">Pending Developer Receipt Confirmation</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="w-44 border-b border-slate-600 print:border-black mb-1" />
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Authorized Signature</div>
                  <div className="text-[10px] text-slate-400">Azariah Management Group Executive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPortal;
