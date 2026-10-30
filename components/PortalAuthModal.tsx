import React, { useState, useEffect } from 'react';
import { ShieldCheck, Code2, Lock, User, Mail, Eye, EyeOff, RefreshCw, X, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { developerService, setDeveloperToken, getDeveloperToken, getSavedDeveloperUser } from '../services/developerService';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'admin' | 'developer';
  onNavigate?: (view: any) => void;
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'admin',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'developer'>(initialTab);
  const { login, verifyOtp, resendOtp, showToast, isAdmin } = useContent();

  // Admin form state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminShowPassword, setAdminShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  // Admin OTP state
  const [otpData, setOtpData] = useState<{
    email?: string;
    emailMasked?: string;
    reason?: string;
    devOtpCode?: string;
  } | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Developer form state
  const [devEmail, setDevEmail] = useState('');
  const [devPassword, setDevPassword] = useState('');
  const [devShowPassword, setDevShowPassword] = useState(false);
  const [devLoading, setDevLoading] = useState(false);

  // General error state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMsg(null);
    setOtpData(null);
    setOtpCode('');
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.location.hash = view === 'admin' ? '#admin' : '#dev-portal';
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setErrorMsg(null);
    setAdminLoading(true);

    try {
      const res = await login(adminUsername.trim(), adminPassword);
      setAdminLoading(false);

      if (res.requiresOtp) {
        setOtpData({
          email: res.email,
          emailMasked: res.emailMasked,
          reason: res.reason,
          devOtpCode: res.devOtpCode,
        });
        showToast('Verification code dispatched to your email.', 'info');
        return;
      }

      if (res.success) {
        showToast('Admin Console session authenticated successfully.');
        onClose();
        navigateTo('admin');
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setAdminLoading(false);
      setErrorMsg(err.message || 'Network error occurred during authentication.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMsg(null);
    setOtpLoading(true);

    try {
      const res = await verifyOtp(adminUsername.trim(), otpCode.trim());
      setOtpLoading(false);

      if (res.success) {
        showToast('Two-factor verification successful. Welcome to Admin Console!');
        onClose();
        navigateTo('admin');
      } else {
        setErrorMsg(res.error || 'Invalid or expired verification code.');
      }
    } catch (err: any) {
      setOtpLoading(false);
      setErrorMsg(err.message || 'OTP verification error.');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setResendCooldown(45);
      const res = await resendOtp(adminUsername.trim());
      if (res.success) {
        showToast('A new verification code has been dispatched.', 'info');
      } else {
        setErrorMsg(res.error || 'Failed to resend code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not resend OTP code.');
    }
  };

  const handleDeveloperLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devEmail.trim() || !devPassword.trim()) {
      setErrorMsg('Please enter developer email and password.');
      return;
    }

    setErrorMsg(null);
    setDevLoading(true);

    try {
      const res = await developerService.devLogin(devEmail.trim(), devPassword);
      setDevLoading(false);

      if (res.success && res.token && res.developer) {
        setDeveloperToken(res.token, res.developer);
        showToast(`Welcome back, ${res.developer.name}! Developer command active.`);
        onClose();
        navigateTo('developer');
      } else {
        setErrorMsg(res.error || 'Developer authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setDevLoading(false);
      setErrorMsg(err.message || 'Network error occurred during developer authentication.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Glow Header Accent Bar */}
        <div
          className={`h-1.5 w-full transition-all duration-500 ${
            activeTab === 'admin'
              ? 'bg-gradient-to-r from-lime-500 via-emerald-400 to-lime-500'
              : 'bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500'
          }`}
        />

        <div className="p-6 sm:p-7 space-y-5">
          {/* Top Bar: Title & Close */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                PORTAL ACCESS GATEWAY
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close portal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Toggle Switch Buttons (Matching Design Reference) ── */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg(null);
                setOtpData(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded text-[11px] font-black uppercase tracking-[0.18em] transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-lime-400 border border-lime-500/60 shadow-[0_0_15px_rgba(163,230,53,0.18)]'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800/80'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'admin' ? 'text-lime-400' : 'text-slate-400'}`} />
              <span>Admin Console</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('developer');
                setErrorMsg(null);
                setOtpData(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded text-[11px] font-black uppercase tracking-[0.18em] transition-all cursor-pointer ${
                activeTab === 'developer'
                  ? 'bg-slate-900 text-sky-400 border border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.18)]'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800/80'
              }`}
            >
              <Code2 className={`w-4 h-4 ${activeTab === 'developer' ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>Developer Portal</span>
            </button>
          </div>

          {/* Subheader info */}
          <div className="text-center space-y-1 pt-1">
            <h3 className="text-lg font-black tracking-tight text-white uppercase font-sans">
              {activeTab === 'admin' ? 'Admin Authentication' : 'Developer Command Center'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {activeTab === 'admin'
                ? 'Sign in with administrator credentials to manage sections, media, team roles, and system settings.'
                : 'Sign in with assigned engineer credentials for attendance logs, project milestones, and API telemetry.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md flex items-center gap-2.5 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {/* ── ADMIN LOGIN FORM ── */}
          {activeTab === 'admin' && !otpData && (
            isAdmin ? (
              <div className="p-4 bg-lime-500/10 border border-lime-500/30 rounded-lg text-xs space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-lime-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Session Active</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  You are currently authenticated with administrator privileges.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigateTo('admin');
                  }}
                  className="w-full py-2.5 px-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black tracking-widest text-xs uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-lime-500/20 cursor-pointer"
                >
                  <span>Enter Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-lime-400" />
                    <span>Username or Admin Email</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin or info@azariahmg.com"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-lime-400" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={adminShowPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 pr-10 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowPassword(!adminShowPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {adminShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-3 px-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black tracking-widest text-xs uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-lime-500/20 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {adminLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Console</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )
          )}

          {/* ── ADMIN OTP 2FA STEP ── */}
          {activeTab === 'admin' && otpData && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 bg-lime-500/10 border border-lime-500/30 rounded-sm text-xs text-lime-300 space-y-1">
                <p className="font-bold">Two-Step Security Verification</p>
                <p className="text-[11px] text-slate-300">
                  A verification code has been dispatched to{' '}
                  <strong className="text-white">{otpData.emailMasked || otpData.email || 'your registered email'}</strong>.
                </p>
                {otpData.devOtpCode && (
                  <p className="text-[10px] font-mono text-lime-400 pt-1">
                    [Sandbox Code: {otpData.devOtpCode}]
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-lime-400" />
                  <span>Enter 6-Digit Code</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white rounded-sm text-lg font-mono text-center tracking-[0.5em] focus:border-lime-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length < 6}
                  className="flex-1 py-3 px-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black tracking-widest text-xs uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-lime-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {otpLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    'Verify & Enter Console'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpData(null);
                    setOtpCode('');
                  }}
                  className="px-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold"
                >
                  Back
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="text-[11px] font-bold text-slate-400 hover:text-lime-400 transition-colors disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Did not receive code? Resend'}
                </button>
              </div>
            </form>
          )}

          {/* ── DEVELOPER LOGIN FORM ── */}
          {activeTab === 'developer' && (
            getDeveloperToken() ? (
              <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg text-xs space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-sky-400 font-bold uppercase tracking-wider">
                  <Code2 className="w-4 h-4" />
                  <span>Developer Session Active</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  You are signed in as <strong className="text-white">{getSavedDeveloperUser()?.name || 'Engineer'}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigateTo('developer');
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-black tracking-widest text-xs uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/25 cursor-pointer"
                >
                  <span>Enter Developer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleDeveloperLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Developer Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    placeholder="engineer@azariahmg.com"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={devShowPassword ? 'text' : 'password'}
                      required
                      value={devPassword}
                      onChange={(e) => setDevPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 pr-10 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-sky-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setDevShowPassword(!devShowPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {devShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={devLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-black tracking-widest text-xs uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/25 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {devLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )
          )}

          {/* Modal Footer Note */}
          <div className="pt-2 text-center text-[10px] text-slate-500">
            Azariah Management Group • Encrypted Enterprise Gateway
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalAuthModal;
