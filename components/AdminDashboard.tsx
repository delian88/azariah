import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Image as ImageIcon,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowLeft,
  Save,
  RefreshCw,
  Sliders,
  Database,
  ExternalLink,
  Eye,
  KeyRound,
  Layers,
  Sparkles,
  Smartphone,
  Laptop,
  Clock,
  Trash2,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const {
    settings,
    sections,
    isAdmin,
    adminUser,
    deviceToken,
    login,
    verifyOtp,
    resendOtp,
    fetchDevices,
    revokeDevice,
    logout,
    updateSettings,
    updateSection,
    uploadMedia,
    refreshContent
  } = useContent();

  // Auth State
  const [username, setUsername] = useState('info@azariahmg.com');
  const [password, setPassword] = useState('Admin@webmaster$1');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // 2FA OTP State
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpReason, setOtpReason] = useState('');
  const [otpDevCode, setOtpDevCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Devices Security State
  const [devicesList, setDevicesList] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'branding' | 'sections' | 'media' | 'system'>('branding');
  const [activeSectionKey, setActiveSectionKey] = useState<string>('hero');

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState({
    logo_url: settings.logo_url || '',
    logo_text: settings.logo_text || 'Azariah',
    logo_subtext: settings.logo_subtext || 'MANAGEMENT GROUP',
    site_name: settings.site_name || 'Azariah Management Group',
    tagline: settings.tagline || 'Strategic Intelligence & Media Impact',
    contact_email: settings.contact_email || 'info@azariahmg.com',
    contact_phone: settings.contact_phone || '240-813-0308',
    contact_address: settings.contact_address || 'Upper Marlboro, MD, 20772 USA',
    office_hours: settings.office_hours || 'Mon - Fri, 9:00 AM - 5:00 PM EST',
  });

  // Section Form State
  const [sectionForm, setSectionForm] = useState({
    badge: '',
    title: '',
    subtitle: '',
    content: '',
    ctaText: '',
    ctaLink: '',
    mediaUrl: '',
    parsedData: {} as any,
  });

  // Media List
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sync settings when loaded
  useEffect(() => {
    setBrandingForm({
      logo_url: settings.logo_url || '',
      logo_text: settings.logo_text || 'Azariah',
      logo_subtext: settings.logo_subtext || 'MANAGEMENT GROUP',
      site_name: settings.site_name || 'Azariah Management Group',
      tagline: settings.tagline || 'Strategic Intelligence & Media Impact',
      contact_email: settings.contact_email || 'info@azariahmg.com',
      contact_phone: settings.contact_phone || '240-813-0308',
      contact_address: settings.contact_address || 'Upper Marlboro, MD, 20772 USA',
      office_hours: settings.office_hours || 'Mon - Fri, 9:00 AM - 5:00 PM EST',
    });
  }, [settings]);

  // Sync section form when activeSectionKey or sections change
  useEffect(() => {
    const sec = sections[activeSectionKey];
    if (sec) {
      setSectionForm({
        badge: sec.badge || '',
        title: sec.title || '',
        subtitle: sec.subtitle || '',
        content: sec.content || '',
        ctaText: sec.ctaText || '',
        ctaLink: sec.ctaLink || '',
        mediaUrl: sec.mediaUrl || '',
        parsedData: sec.parsedData || {},
      });
    }
  }, [activeSectionKey, sections]);

  // Load uploaded media
  const loadMedia = async () => {
    const token = localStorage.getItem('amg_admin_token');
    if (!token) return;
    try {
      const res = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.media) {
        setMediaList(data.media);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadMedia();
    }
  }, [isAdmin]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const loadDevices = async () => {
    setLoadingDevices(true);
    const devs = await fetchDevices();
    setDevicesList(devs);
    setLoadingDevices(false);
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'system') {
      loadDevices();
    }
  }, [isAdmin, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const res = await login(username, password);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed');
    } else if (res.requiresOtp) {
      setOtpStep(true);
      setOtpEmail(res.emailMasked || res.email || username);
      setOtpReason(res.reason || 'Unrecognized device detected');
      setOtpDevCode(res.devOtpCode || '');
      setResendCountdown(30);
      showToast('Security verification code sent to ' + (res.emailMasked || res.email));
    } else {
      showToast('Welcome back, Administrator!');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setAuthError('Please enter the complete 6-digit verification code.');
      return;
    }

    setOtpLoading(true);
    setAuthError('');

    const res = await verifyOtp(username, otpCode.trim());
    setOtpLoading(false);

    if (res.success) {
      setOtpStep(false);
      setOtpCode('');
      showToast('Device verified & authorized! Trusted for 7 days.');
    } else {
      setAuthError(res.error || 'Verification code invalid or expired.');
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || resendLoading) return;
    setResendLoading(true);
    setAuthError('');

    const res = await resendOtp(username);
    setResendLoading(false);

    if (res.success) {
      setResendCountdown(30);
      if (res.devOtpCode) setOtpDevCode(res.devOtpCode);
      showToast(res.message || 'Fresh verification code dispatched to email.');
    } else {
      setAuthError(res.error || 'Failed to resend code');
    }
  };

  const handleRevokeDevice = async (deviceId: number, devToken: string) => {
    if (!confirm('Are you sure you want to revoke authorization for this device?')) return;
    const res = await revokeDevice(deviceId, devToken);
    if (res.success) {
      showToast('Device authorization revoked.');
      loadDevices();
    } else {
      showToast(res.error || 'Failed to revoke device', 'error');
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateSettings(brandingForm);
    setIsSaving(false);
    if (res.success) {
      showToast('Brand settings & logo updated successfully!');
    } else {
      showToast(res.error || 'Failed to update settings', 'error');
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateSection(activeSectionKey, {
      badge: sectionForm.badge,
      title: sectionForm.title,
      subtitle: sectionForm.subtitle,
      content: sectionForm.content,
      ctaText: sectionForm.ctaText,
      ctaLink: sectionForm.ctaLink,
      mediaUrl: sectionForm.mediaUrl,
      data: sectionForm.parsedData,
    });
    setIsSaving(false);
    if (res.success) {
      showToast(`Section '${activeSectionKey.toUpperCase()}' updated successfully!`);
    } else {
      showToast(res.error || 'Failed to update section', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setAsLogo = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const res = await uploadMedia(file, setAsLogo);
    setIsUploading(false);

    if (res.success && res.url) {
      if (setAsLogo) {
        setBrandingForm((prev) => ({ ...prev, logo_url: res.url! }));
        showToast('Logo image uploaded and applied successfully!');
      } else {
        showToast('Media uploaded successfully!');
      }
      loadMedia();
    } else {
      showToast(res.error || 'Failed to upload media', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    const token = localStorage.getItem('amg_admin_token');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.error || 'Failed to change password', 'error');
      }
    } catch {
      showToast('Network error while changing password', 'error');
    }
  };

  // If not logged in, show Login Screen OR 2FA OTP Verification Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onBackToHome}
          className="absolute top-8 left-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Website
        </button>

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-8 md:p-10 rounded-sm shadow-2xl relative z-10 space-y-6 backdrop-blur-xl">
          {otpStep ? (
            /* ========================================== */
            /* 2FA OTP VERIFICATION SCREEN               */
            /* ========================================== */
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-lime-400" />
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[10px] font-black uppercase tracking-widest rounded-sm">
                  Two-Factor Authorization
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                  Verify Security Code
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A 6-digit one-time code has been sent via HTML email to{' '}
                  <strong className="text-white font-mono">{otpEmail || username}</strong>.
                </p>
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-sm text-[11px] text-slate-400 flex items-center justify-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>{otpReason || 'Unrecognized device detected'}</span>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm flex items-center gap-3 text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {otpDevCode && (
                <div className="p-3 bg-blue-950/50 border border-blue-500/40 rounded-sm flex items-center justify-between text-xs text-blue-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>
                      Local Code: <strong className="font-mono text-lime-400 text-sm tracking-wider">{otpDevCode}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(otpDevCode)}
                    className="px-2.5 py-1 bg-lime-500 hover:bg-lime-400 text-slate-950 text-[10px] font-black uppercase rounded-sm transition-colors"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block">
                    Enter 6-Digit One-Time Password
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center text-3xl font-mono tracking-[0.4em] py-4 px-4 bg-slate-950 border border-slate-700 text-lime-400 rounded-sm focus:border-lime-400 focus:outline-none transition-colors"
                    autoFocus
                  />
                  <p className="text-[10px] text-slate-500 text-center">
                    ✓ Authorizes and trusts this device for 7 days
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length < 6}
                  className="w-full py-4 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-slate-950 font-black tracking-widest text-sm uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-lime-500/20 active:translate-y-0.5"
                >
                  {otpLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Code...
                    </>
                  ) : (
                    <>
                      Verify & Authorize Device <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || resendLoading}
                  className="text-slate-400 hover:text-lime-400 disabled:opacity-50 transition-colors font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                  {resendCountdown > 0 ? `Resend Code in ${resendCountdown}s` : 'Resend Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtpCode('');
                    setAuthError('');
                  }}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  Back to Password
                </button>
              </div>
            </div>
          ) : (
            /* ========================================== */
            /* STANDARD USERNAME & PASSWORD FORM          */
            /* ========================================== */
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="flex justify-center mb-4">
                  <Logo variant="dark" className="h-8" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[10px] font-black uppercase tracking-widest rounded-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Content Management Console
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                  Admin Authentication
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Log in to manage live section content, branding, and media.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm flex items-center gap-3 text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-lime-400" /> Username or Email
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none transition-colors"
                    placeholder="admin"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-lime-400" /> Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white rounded-sm text-sm focus:border-lime-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-sm text-[11px] text-slate-400">
                  <span className="font-bold text-lime-400">Admin Credentials:</span> Email: <code className="text-white">info@azariahmg.com</code> / Password: <code className="text-white">Admin@webmaster$1</code>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black tracking-widest text-sm uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-lime-500/20 active:translate-y-0.5"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      Access Console <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-sm shadow-2xl flex items-center gap-3 border ${
              toast.type === 'success'
                ? 'bg-slate-900 border-lime-500 text-white'
                : 'bg-slate-900 border-red-500 text-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-xs font-bold leading-relaxed">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo variant="dark" className="h-6" />
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-lime-500 text-slate-950 rounded-sm">
                Live Admin
              </span>
              <span className="text-xs font-bold text-slate-300 hidden md:inline">
                MySQL Backend Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-sm text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-lime-400" /> View Website
            </button>
            <button
              onClick={refreshContent}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs transition-colors border border-slate-700"
              title="Refresh Data from MySQL"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 grid lg:grid-cols-5 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-3 pb-2 border-b border-slate-800">
              Control Center
            </p>

            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'branding'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Logo & Brand
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'sections'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Sections Text
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'media'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" /> Media Gallery
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'system'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" /> System & Security
            </button>
          </div>

          {/* Database Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 text-[11px] space-y-2 text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
              Database Status
            </div>
            <p>Database: <strong className="text-white">MySQL (azariah_db)</strong></p>
            <p>Host: <strong className="text-white">localhost:3306</strong></p>
            <p>Admin: <strong className="text-lime-400">{adminUser?.username || 'admin'}</strong></p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-4 space-y-6">
          {/* TAB 1: LOGO & BRANDING */}
          {activeTab === 'branding' && (
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 md:p-8 space-y-8">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-lime-400" /> Logo & Brand Identity
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload a custom logo image or customize brand typography rendered throughout the site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveBranding}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {/* Logo Preview Section */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Live Logo Preview
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Dark Mode Preview */}
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-sm flex flex-col items-center justify-center space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Dark Background (Navbar / Hero / Footer)
                    </span>
                    <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-sm">
                      <Logo variant="dark" className="h-9" />
                    </div>
                  </div>

                  {/* Light Mode Preview */}
                  <div className="p-6 bg-slate-100 border border-slate-200 rounded-sm flex flex-col items-center justify-center space-y-3 text-slate-900">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Light Background (Content Sections)
                    </span>
                    <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-sm">
                      <Logo variant="light" className="h-9" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload New Logo */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-lime-400" /> Upload Custom Logo Image
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Upload PNG, SVG, WebP, or JPG. Recommended height: 48px to 120px with transparent background.
                  </p>
                  <label className="border-2 border-dashed border-slate-700 hover:border-lime-500 p-6 rounded-sm flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-200">
                      {isUploading ? 'Uploading to MySQL/Server...' : 'Click or Drag Logo to Upload'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      Max size: 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Or Direct Logo Image URL
                    </label>
                    <input
                      type="text"
                      value={brandingForm.logo_url}
                      onChange={(e) => setBrandingForm({ ...brandingForm, logo_url: e.target.value })}
                      placeholder="/uploads/logo.png or https://example.com/logo.png"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs font-mono focus:border-lime-500 focus:outline-none"
                    />
                    <div className="flex gap-2 pt-1">
                      {brandingForm.logo_url && (
                        <button
                          type="button"
                          onClick={() => setBrandingForm({ ...brandingForm, logo_url: '' })}
                          className="text-[10px] font-bold text-red-400 hover:underline"
                        >
                          Reset to Official Geometric SVG Globe Logo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                        Primary Logo Text
                      </label>
                      <input
                        type="text"
                        value={brandingForm.logo_text}
                        onChange={(e) => setBrandingForm({ ...brandingForm, logo_text: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                        placeholder="AZARIAH"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                        Secondary Subtext
                      </label>
                      <input
                        type="text"
                        value={brandingForm.logo_subtext}
                        onChange={(e) => setBrandingForm({ ...brandingForm, logo_subtext: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                        placeholder="MANAGEMENT GROUP"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand & Organization Information */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Corporate Information & Global Coordinates
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={brandingForm.site_name}
                      onChange={(e) => setBrandingForm({ ...brandingForm, site_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={brandingForm.tagline}
                      onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={brandingForm.contact_email}
                      onChange={(e) => setBrandingForm({ ...brandingForm, contact_email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={brandingForm.contact_phone}
                      onChange={(e) => setBrandingForm({ ...brandingForm, contact_phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Corporate Headquarters Location
                    </label>
                    <input
                      type="text"
                      value={brandingForm.contact_address}
                      onChange={(e) => setBrandingForm({ ...brandingForm, contact_address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveBranding}
                  disabled={isSaving}
                  className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-lg shadow-lime-500/20"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Brand Settings'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS TEXT */}
          {activeTab === 'sections' && (
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <FileText className="w-6 h-6 text-lime-400" /> Website Sections Text Editor
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a section to edit its headlines, narrative text, call-to-actions, and badges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSection}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Section'}
                </button>
              </div>

              {/* Section Selector Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { key: 'hero', label: '1. Hero Banner' },
                  { key: 'philosophy', label: '2. Philosophy' },
                  { key: 'about', label: '3. About AMG' },
                  { key: 'services', label: '4. What We Do' },
                  { key: 'strategic_ai', label: '5. Strategic AI' },
                  { key: 'contact', label: '6. Contact Section' },
                  { key: 'footer', label: '7. Footer Statement' },
                ].map((sec) => (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => setActiveSectionKey(sec.key)}
                    className={`px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider transition-all ${
                      activeSectionKey === sec.key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {/* Section Form */}
              <form onSubmit={handleSaveSection} className="space-y-6 pt-4 border-t border-slate-800">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Section Badge / Tagline
                    </label>
                    <input
                      type="text"
                      value={sectionForm.badge}
                      onChange={(e) => setSectionForm({ ...sectionForm, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                      placeholder="e.g. CORE PHILOSOPHY"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Main Title / Headline
                    </label>
                    <input
                      type="text"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                      placeholder="Section Headline"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Subtitle / Supporting Tagline
                  </label>
                  <input
                    type="text"
                    value={sectionForm.subtitle}
                    onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                    placeholder="Subtitle or framing sentence"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Main Narrative / Content Text
                  </label>
                  <textarea
                    rows={6}
                    value={sectionForm.content}
                    onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs leading-relaxed focus:border-lime-500 focus:outline-none resize-y"
                    placeholder="Full descriptive narrative for this section..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Call To Action Button Text
                    </label>
                    <input
                      type="text"
                      value={sectionForm.ctaText}
                      onChange={(e) => setSectionForm({ ...sectionForm, ctaText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                      placeholder="e.g. Start Your Journey"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      CTA Button Link / Anchor
                    </label>
                    <input
                      type="text"
                      value={sectionForm.ctaLink}
                      onChange={(e) => setSectionForm({ ...sectionForm, ctaLink: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                      placeholder="e.g. #contact or #services-page"
                    />
                  </div>
                </div>

                {/* Specific custom fields per section */}
                {activeSectionKey === 'philosophy' && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-lime-400">
                      Philosophy Pillar Paragraphs
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Supporting Paragraph 1</label>
                        <textarea
                          rows={3}
                          value={sectionForm.parsedData?.paragraph1 || ''}
                          onChange={(e) =>
                            setSectionForm({
                              ...sectionForm,
                              parsedData: { ...sectionForm.parsedData, paragraph1: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Supporting Paragraph 2</label>
                        <textarea
                          rows={3}
                          value={sectionForm.parsedData?.paragraph2 || ''}
                          onChange={(e) =>
                            setSectionForm({
                              ...sectionForm,
                              parsedData: { ...sectionForm.parsedData, paragraph2: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSectionKey === 'hero' && sectionForm.parsedData?.slides && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-lime-400">
                      Hero Banner Slides (3 Active Video/Image Slides)
                    </h4>
                    <div className="space-y-4">
                      {sectionForm.parsedData.slides.map((slide: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-sm space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Slide {idx + 1}
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={slide.title || ''}
                              onChange={(e) => {
                                const newSlides = [...sectionForm.parsedData.slides];
                                newSlides[idx] = { ...slide, title: e.target.value };
                                setSectionForm({
                                  ...sectionForm,
                                  parsedData: { ...sectionForm.parsedData, slides: newSlides },
                                });
                              }}
                              className="px-2 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs"
                              placeholder="Slide Title (e.g. Azariah.)"
                            />
                            <input
                              type="text"
                              value={slide.subtitle || ''}
                              onChange={(e) => {
                                const newSlides = [...sectionForm.parsedData.slides];
                                newSlides[idx] = { ...slide, subtitle: e.target.value };
                                setSectionForm({
                                  ...sectionForm,
                                  parsedData: { ...sectionForm.parsedData, slides: newSlides },
                                });
                              }}
                              className="px-2 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs"
                              placeholder="Slide Subtitle"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={slide.description || ''}
                            onChange={(e) => {
                              const newSlides = [...sectionForm.parsedData.slides];
                              newSlides[idx] = { ...slide, description: e.target.value };
                              setSectionForm({
                                ...sectionForm,
                                  parsedData: { ...sectionForm.parsedData, slides: newSlides },
                              });
                            }}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs"
                            placeholder="Slide Description Narrative"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-lg shadow-lime-500/20"
                  >
                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : `Save ${activeSectionKey.toUpperCase()} Changes`}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MEDIA GALLERY */}
          {activeTab === 'media' && (
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Upload className="w-6 h-6 text-lime-400" /> Media & Logo Asset Storage
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload images to server storage and copy direct URLs to use anywhere on the website.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-700 hover:border-lime-500 p-8 rounded-sm flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm font-bold text-white">
                  {isUploading ? 'Uploading file...' : 'Choose file to upload to /uploads'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, WebP, SVG, GIF (Up to 10MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              {/* Uploaded Items Grid */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Uploaded Assets ({mediaList.length})
                </h3>

                {mediaList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-bold border border-slate-800/60 rounded-sm">
                    No custom media uploaded yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaList.map((media) => (
                      <div
                        key={media.id}
                        className="bg-slate-950 border border-slate-800 rounded-sm overflow-hidden p-3 flex flex-col justify-between space-y-3 group hover:border-slate-700 transition-colors"
                      >
                        <div className="h-28 bg-slate-900 rounded-sm flex items-center justify-center overflow-hidden">
                          <img
                            src={media.url}
                            alt={media.originalName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-200 truncate" title={media.originalName}>
                            {media.originalName}
                          </p>
                          <p className="text-[9px] text-slate-500 font-mono">
                            {(media.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(media.url);
                              showToast('Copied URL to clipboard!');
                            }}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors text-center"
                          >
                            Copy URL
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              setBrandingForm((prev) => ({ ...prev, logo_url: media.url }));
                              await updateSettings({ logo_url: media.url });
                              showToast('Applied as site logo!');
                            }}
                            className="px-2.5 py-1.5 bg-lime-500 hover:bg-lime-400 text-slate-950 text-[10px] font-black uppercase rounded-sm transition-colors"
                            title="Set as Logo"
                          >
                            Set Logo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM & SECURITY */}
          {activeTab === 'system' && (
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 md:p-8 space-y-8">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Database className="w-6 h-6 text-lime-400" /> Database & Security Architecture
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage administrator credentials and inspect database connectivity.
                </p>
              </div>

              {/* Change Password Form */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-sm space-y-4 max-w-lg">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-lime-400" /> Update Administrator Password
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-sm transition-all"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Authorized Devices & 7-Day Trust Window */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-lime-400" /> Recognized Devices & 7-Day Trust
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Devices recognized by the system bypass 2FA OTP for 7 days. After 7 days, a one-time email OTP is required.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadDevices}
                    disabled={loadingDevices}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-sm text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingDevices ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {loadingDevices ? (
                  <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-lime-400" /> Loading authorized devices...
                  </div>
                ) : devicesList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 border border-slate-900 rounded-sm">
                    No recognized devices registered yet. Devices will appear here upon successful OTP verification.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {devicesList.map((dev) => {
                      const isCurrent = dev.deviceToken === deviceToken;
                      const trustedUntilDate = new Date(dev.trustedUntil);
                      const isTrustedNow = trustedUntilDate.getTime() > Date.now();
                      const daysRemaining = Math.max(0, Math.ceil((trustedUntilDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

                      return (
                        <div
                          key={dev.id}
                          className={`p-4 rounded-sm border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            isCurrent
                              ? 'bg-slate-900/80 border-lime-500/40'
                              : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={`p-2.5 rounded-sm border shrink-0 ${
                              isCurrent
                                ? 'bg-lime-500/10 border-lime-500/30 text-lime-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}>
                              <Laptop className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-white text-xs">
                                  {dev.deviceName || 'Web Browser'}
                                </span>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 bg-lime-500/20 border border-lime-500/40 text-lime-300 text-[9px] font-black uppercase tracking-wider rounded-sm">
                                    Current Device
                                  </span>
                                )}
                                {isTrustedNow ? (
                                  <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[9px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> Trusted ({daysRemaining}d left)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1">
                                    <ShieldAlert className="w-2.5 h-2.5" /> OTP Required (7d expired)
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                                <span>IP: <strong className="text-slate-300 font-mono">{dev.ipAddress || 'Unknown'}</strong></span>
                                <span>Last Login: <strong className="text-slate-300">{dev.lastLoginAt ? new Date(dev.lastLoginAt).toLocaleString() : 'N/A'}</strong></span>
                                <span>Trusted Until: <strong className="text-slate-300">{trustedUntilDate.toLocaleDateString()}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-auto">
                            <button
                              type="button"
                              onClick={() => handleRevokeDevice(dev.id, dev.deviceToken)}
                              className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 hover:border-red-500/60 rounded-sm text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                              title="Revoke device authorization (forces OTP verification on next login)"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Revoke Trust
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* System Specs */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Technical Architecture
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Database Engine</span>
                    <p className="font-bold text-white">MySQL 9.1 / MariaDB</p>
                    <p className="text-slate-400 text-[11px]">Database: azariah_db</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ORM & Migration Tool</span>
                    <p className="font-bold text-white">Prisma 7 with MariaDB Driver</p>
                    <p className="text-slate-400 text-[11px]">Automatic Schema Synchronization</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Backend Server</span>
                    <p className="font-bold text-white">Node.js Express + TSX Watch</p>
                    <p className="text-slate-400 text-[11px]">Port: 3000 (Vite SSR/SPA Middleware)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
