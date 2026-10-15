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
  ShieldAlert,
  Search,
  Filter,
  Folder,
  Code,
  Layout,
  Globe,
  Compass,
  ArrowUpRight,
  Check,
  X,
  FileCode,
  Tv,
  Film,
  Menu,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Home
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';

export interface SectionMeta {
  key: string;
  category: 'header' | 'landing' | 'page' | 'footer';
  label: string;
  tag: string;
  description: string;
  route: string;
}

export const ALL_SECTIONS_CONFIG: SectionMeta[] = [
  // --- Header & Navigation ---
  {
    key: 'header',
    category: 'header',
    label: 'Header & Global Navigation',
    tag: 'NAV',
    description: 'Site-wide top navigation bar, logo styling, announcement notice, and primary navigation CTA button.',
    route: '#home',
  },

  // --- Landing Page Sections (12 sections) ---
  {
    key: 'hero',
    category: 'landing',
    label: '1. Hero Main Screen',
    tag: 'HERO',
    description: 'Dynamic 3-slide visual presentation, primary headline, mission tagline, and engagement CTA.',
    route: '#home',
  },
  {
    key: 'philosophy',
    category: 'landing',
    label: '2. Strategic Philosophy',
    tag: 'PHILOSOPHY',
    description: 'Core corporate doctrine, foundational pillars of intelligence, and narrative paragraphs.',
    route: '#philosophy',
  },
  {
    key: 'brand_spotlight',
    category: 'landing',
    label: '3. Brand Spotlight Showcase',
    tag: 'SPOTLIGHT',
    description: 'High-impact multimedia embed (CreAItube showcase), featured badge, and corporate spotlight narrative.',
    route: '#brand-spotlight',
  },
  {
    key: 'partners_section',
    category: 'landing',
    label: '4. Strategic Partners Grid',
    tag: 'PARTNERS',
    description: 'Global institutional alliances, corporate partners marquee, and joint-venture network narrative.',
    route: '#partners',
  },
  {
    key: 'services',
    category: 'landing',
    label: '5. Core Capabilities (What We Do)',
    tag: 'SERVICES',
    description: 'Strategic advisory, intelligence gathering, media impact, and technology consulting matrix.',
    route: '#services',
  },
  {
    key: 'about',
    category: 'landing',
    label: '6. Corporate Overview (About AMG)',
    tag: 'ABOUT',
    description: 'Institutional background, track record, organizational profile, and performance metrics.',
    route: '#about',
  },
  {
    key: 'programs_section',
    category: 'landing',
    label: '7. Programs & Initiatives',
    tag: 'PROGRAMS',
    description: 'Executive accelerator programs, media labs, and enterprise fellowship application banner.',
    route: '#programs',
  },
  {
    key: 'strategic_ai',
    category: 'landing',
    label: '8. Strategic AI Integration',
    tag: 'AI INTEL',
    description: 'Autonomous workflows, algorithmic market intelligence, and generative media architecture.',
    route: '#strategic-ai',
  },
  {
    key: 'creaitube_section',
    category: 'landing',
    label: '9. CreAItube Studio Highlight',
    tag: 'CREAITUBE',
    description: 'Automated video generation suite, digital creator pipeline, and media studio highlight.',
    route: '#creaitube',
  },
  {
    key: 'podore_section',
    category: 'landing',
    label: '10. PodOre Infrastructure',
    tag: 'PODORE',
    description: 'Critical raw materials, mineral commodities, ethical supply chains, and enterprise portal.',
    route: '#podore',
  },
  {
    key: 'careers_section',
    category: 'landing',
    label: '11. Careers & Global Talent',
    tag: 'CAREERS',
    description: 'Strategic hiring, elite talent acquisition, organizational culture, and career portal.',
    route: '#careers',
  },
  {
    key: 'contact',
    category: 'landing',
    label: '12. Global Inquiries & Engagement',
    tag: 'CONTACT',
    description: 'Corporate engagement intake, headquarters coordinates, inquiry routing, and consultation CTA.',
    route: '#contact',
  },

  // --- Dedicated Standalone Pages (15 pages) ---
  {
    key: 'services_page',
    category: 'page',
    label: 'Services & Capabilities Page',
    tag: 'PAGE',
    description: 'Dedicated capabilities portal, enterprise solutions directory, and bespoke consulting packages.',
    route: '#services-page',
  },
  {
    key: 'about_page',
    category: 'page',
    label: 'Corporate Profile & Leadership Page',
    tag: 'PAGE',
    description: 'Comprehensive corporate history, executive leadership bio, vision, and governance standards.',
    route: '#about-page',
  },
  {
    key: 'programs_page',
    category: 'page',
    label: 'Programs & Masterclasses Page',
    tag: 'PAGE',
    description: 'Complete directory of enterprise accelerators, executive cohorts, and specialized masterclasses.',
    route: '#programs-page',
  },
  {
    key: 'mentorship_page',
    category: 'page',
    label: 'Executive Mentorship & Fellowship',
    tag: 'PAGE',
    description: 'High-level advisory mentorship, 1-on-1 strategic guidance, and fellowship cohorts.',
    route: '#mentorship-page',
  },
  {
    key: 'studio_page',
    category: 'page',
    label: 'Studio AMG Creative Lab Page',
    tag: 'PAGE',
    description: 'State-of-the-art production studio, commercial film, audio mastering, and content labs.',
    route: '#studio-page',
  },
  {
    key: 'news_page',
    category: 'page',
    label: 'Intelligence & Insights Feed Page',
    tag: 'PAGE',
    description: 'Press releases, strategic intelligence briefs, geopolitical reports, and media appearances.',
    route: '#news-page',
  },
  {
    key: 'products_page',
    category: 'page',
    label: 'Technology & Media Products Page',
    tag: 'PAGE',
    description: 'Software platforms, proprietary analytical engines, and commercialized media products.',
    route: '#products-page',
  },
  {
    key: 'portfolio_page',
    category: 'page',
    label: 'Case Studies & Track Record Page',
    tag: 'PAGE',
    description: 'Documented client outcomes, strategic media campaigns, and advisory case studies.',
    route: '#portfolio-page',
  },
  {
    key: 'partners_page',
    category: 'page',
    label: 'Alliance Network & Co-Ventures Page',
    tag: 'PAGE',
    description: 'Global partner directory, joint venture frameworks, and international alliance opportunities.',
    route: '#partners-page',
  },
  {
    key: 'catalog_page',
    category: 'page',
    label: 'Corporate Publication & Catalog Page',
    tag: 'PAGE',
    description: 'Official corporate dossiers, downloadable strategic whitepapers, and product catalogs.',
    route: '#catalog-page',
  },
  {
    key: 'wallfeel_page',
    category: 'page',
    label: 'Wallfeel Luxury Brand Portal',
    tag: 'PAGE',
    description: 'Luxury acoustic wall coverings, bespoke interior architecture, and designer brand showcase.',
    route: '#wallfeel-page',
  },
  {
    key: 'wallfeel_catalog_page',
    category: 'page',
    label: 'Wallfeel Luxury Catalog & Swatches',
    tag: 'PAGE',
    description: 'Interactive swatch catalog, surface textures, material specs, and architectural order portal.',
    route: '#wallfeel-catalog-page',
  },
  {
    key: 'creaitube_page',
    category: 'page',
    label: 'CreAItube Autonomous Studio Page',
    tag: 'PAGE',
    description: 'Standalone portal for CreAItube AI video automation platform, creator tools, and API access.',
    route: '#creaitube-page',
  },
  {
    key: 'terms_page',
    category: 'page',
    label: 'Terms of Service & Compliance Page',
    tag: 'PAGE',
    description: 'Terms of engagement, client agreements, intellectual property governance, and legal notices.',
    route: '#terms-page',
  },
  {
    key: 'privacy_page',
    category: 'page',
    label: 'Global Privacy & Data Policy Page',
    tag: 'PAGE',
    description: 'Worldwide data protection policy, privacy compliance, cookie declarations, and rights.',
    route: '#privacy-page',
  },

  // --- Footer & Legal ---
  {
    key: 'footer',
    category: 'footer',
    label: 'Global Footer & Compliance Bar',
    tag: 'FOOTER',
    description: 'Site-wide footer, corporate legal tagline, accreditation badges, and copyright notice.',
    route: '#footer',
  },
];

interface AdminDashboardProps {
  onBackToHome: () => void;
  onNavigate?: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome, onNavigate }) => {
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
    showToast: globalToast,
    updateSettings,
    updateSection,
    uploadMedia,
    refreshContent
  } = useContent();

  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  // Mobile Navigation & Responsive Breadcrumb State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileTabPickerOpen, setMobileTabPickerOpen] = useState(false);
  const [mobileSectionPickerOpen, setMobileSectionPickerOpen] = useState(false);
  const [mobileSectionView, setMobileSectionView] = useState<'editor' | 'directory'>('editor');

  const currentSectionMeta = ALL_SECTIONS_CONFIG.find((s) => s.key === activeSectionKey) || {
    key: activeSectionKey,
    category: 'landing' as const,
    label: activeSectionKey.toUpperCase(),
    tag: 'CUSTOM',
    description: 'Custom content section',
    route: '#home',
  };

  // CMS Section Navigation & Search State
  const [sectionCategoryFilter, setSectionCategoryFilter] = useState<'all' | 'landing' | 'page' | 'header' | 'footer'>('all');
  const [sectionSearch, setSectionSearch] = useState<string>('');
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [advancedJsonOpen, setAdvancedJsonOpen] = useState(false);
  const [rawJsonText, setRawJsonText] = useState<string>('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);

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
      const dataObj = sec.parsedData || (sec.data ? (typeof sec.data === 'string' ? JSON.parse(sec.data) : sec.data) : {});
      setSectionForm({
        badge: sec.badge || '',
        title: sec.title || '',
        subtitle: sec.subtitle || '',
        content: sec.content || '',
        ctaText: sec.ctaText || '',
        ctaLink: sec.ctaLink || '',
        mediaUrl: sec.mediaUrl || '',
        parsedData: dataObj,
      });
      setRawJsonText(JSON.stringify(dataObj, null, 2));
      setJsonError(null);
    } else {
      setSectionForm({
        badge: '',
        title: '',
        subtitle: '',
        content: '',
        ctaText: '',
        ctaLink: '',
        mediaUrl: '',
        parsedData: {},
      });
      setRawJsonText('{}');
      setJsonError(null);
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type: type === 'info' ? 'success' : type });
    globalToast?.(message, type);
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
      showToast(res.error || 'Authentication failed. Please check credentials.', 'error');
    } else if (res.requiresOtp) {
      setOtpStep(true);
      setOtpEmail(res.emailMasked || res.email || username);
      setOtpReason(res.reason || 'Unrecognized device detected');
      setOtpDevCode(res.devOtpCode || '');
      setResendCountdown(30);
      showToast('Security verification code sent to ' + (res.emailMasked || res.email), 'info');
    } else {
      showToast('Welcome back, Administrator! Direct session activated.');
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

  const handlePreviewRoute = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.hash = route;
    }
    showToast(`Navigated to preview '${route}'. Admin session remains active.`, 'info');
  };

  const handleSaveSection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    let customData = sectionForm.parsedData;
    if (advancedJsonOpen && rawJsonText.trim()) {
      try {
        customData = JSON.parse(rawJsonText);
        setJsonError(null);
      } catch (err: any) {
        setJsonError(`Invalid JSON syntax: ${err.message}`);
        setIsSaving(false);
        showToast('Please fix JSON syntax errors before saving.', 'error');
        return;
      }
    }

    const res = await updateSection(activeSectionKey, {
      badge: sectionForm.badge,
      title: sectionForm.title,
      subtitle: sectionForm.subtitle,
      content: sectionForm.content,
      ctaText: sectionForm.ctaText,
      ctaLink: sectionForm.ctaLink,
      mediaUrl: sectionForm.mediaUrl,
      data: customData,
    });
    setIsSaving(false);
    if (res.success) {
      showToast(`Section '${activeSectionKey.toUpperCase()}' saved successfully!`);
    } else {
      showToast(res.error || 'Failed to update section', 'error');
    }
  };

  const handleSectionMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const res = await uploadMedia(file, false);
    setIsUploading(false);

    if (res.success && res.url) {
      setSectionForm((prev) => ({ ...prev, mediaUrl: res.url! }));
      showToast('Media asset uploaded and attached to section!');
      loadMedia();
    } else {
      showToast(res.error || 'Failed to upload media', 'error');
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
                    placeholder="Enter username or email"
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[250] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
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
      <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md px-3.5 sm:px-6 py-2.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Drawer Trigger + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-300 hover:text-lime-400 hover:bg-slate-800/80 rounded-sm transition-colors border border-slate-800 shrink-0"
              aria-label="Open navigation drawer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Logo variant="dark" className="h-5 sm:h-6 shrink-0" />
              <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] px-1.5 sm:px-2 py-0.5 bg-lime-500 text-slate-950 rounded-sm">
                  Live Admin
                </span>
                <span className="text-xs font-bold text-slate-300 hidden md:inline">
                  Enterprise Active
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                onBackToHome();
                showToast('Switched to live website view. Session remains active.', 'info');
              }}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="View Live Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden sm:inline">View Website</span>
              <span className="sm:hidden text-[11px]">Site</span>
            </button>
            <button
              onClick={async () => {
                await refreshContent();
                showToast('Content synchronized successfully.');
              }}
              className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-sm text-xs transition-colors border border-slate-700"
              title="Refresh and Synchronize Content"
              aria-label="Sync Content"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                logout();
                showToast('Logged out successfully. Session closed.', 'info');
              }}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-800/50 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Logout of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Breadcrumb Bar (Visible on Mobile & Tablets) */}
      <div className="lg:hidden sticky top-[45px] sm:top-[57px] z-40 bg-slate-900/95 border-b border-slate-800/90 backdrop-blur-md px-3 sm:px-4 py-2 shadow-md">
        <div className="flex items-center justify-between gap-1.5 text-xs">
          {/* Breadcrumb Path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
            {/* Step 1: Admin Home */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-lime-400 font-bold shrink-0 transition-colors"
              title="Open Navigation Menu"
            >
              <Home className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span className="text-[11px]">Admin</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

            {/* Step 2: Active Tab / Module */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMobileTabPickerOpen(!mobileTabPickerOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-white font-bold hover:bg-slate-700 border border-slate-700/60 transition-colors text-[11px]"
                title="Switch Module"
              >
                <span>
                  {activeTab === 'branding' && 'Logo & Brand'}
                  {activeTab === 'sections' && 'Sections Text'}
                  {activeTab === 'media' && 'Media Gallery'}
                  {activeTab === 'system' && 'Security'}
                </span>
                <ChevronDown className="w-3 h-3 text-lime-400" />
              </button>

              {/* Module Dropdown */}
              {mobileTabPickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setMobileTabPickerOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-52 bg-slate-900 border border-slate-700 rounded-sm shadow-2xl py-1 z-40 animate-in fade-in slide-in-from-top-1">
                    <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-800">
                      Jump to Module
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('branding');
                        setMobileTabPickerOpen(false);
                        showToast('Switched to Logo & Brand Identity.', 'info');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        activeTab === 'branding' ? 'bg-lime-500/20 text-lime-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Logo & Brand Identity
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('sections');
                        setMobileTabPickerOpen(false);
                        showToast('Switched to Sections Text & CMS.', 'info');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        activeTab === 'sections' ? 'bg-lime-500/20 text-lime-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Sections Text & CMS
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('media');
                        setMobileTabPickerOpen(false);
                        showToast('Switched to Media Gallery.', 'info');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        activeTab === 'media' ? 'bg-lime-500/20 text-lime-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" /> Media & Storage Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('system');
                        setMobileTabPickerOpen(false);
                        showToast('Switched to System Security & Devices.', 'info');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        activeTab === 'system' ? 'bg-lime-500/20 text-lime-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> System & Security
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Step 3 (if in Sections): Active Section */}
            {activeTab === 'sections' && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                <button
                  type="button"
                  onClick={() => setMobileSectionPickerOpen(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-lime-500/15 border border-lime-500/30 text-lime-300 font-bold truncate max-w-[130px] xs:max-w-[170px] transition-colors text-[11px]"
                  title="Switch Section"
                >
                  <span className="truncate">{currentSectionMeta.label}</span>
                  <ChevronDown className="w-3 h-3 text-lime-400 shrink-0" />
                </button>
              </>
            )}
          </nav>

          {/* Quick Section Arrows (if in Sections) */}
          {activeTab === 'sections' && (
            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = ALL_SECTIONS_CONFIG.findIndex((s) => s.key === activeSectionKey);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : ALL_SECTIONS_CONFIG.length - 1;
                  setActiveSectionKey(ALL_SECTIONS_CONFIG[prevIndex].key);
                  setMobileSectionView('editor');
                }}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60"
                title="Previous section"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentIndex = ALL_SECTIONS_CONFIG.findIndex((s) => s.key === activeSectionKey);
                  const nextIndex = currentIndex < ALL_SECTIONS_CONFIG.length - 1 ? currentIndex + 1 : 0;
                  setActiveSectionKey(ALL_SECTIONS_CONFIG[nextIndex].key);
                  setMobileSectionView('editor');
                }}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60"
                title="Next section"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[200]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] h-full bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Logo variant="dark" className="h-6" />
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-lime-500 text-slate-950 rounded-sm">
                    Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Modules */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2 pb-1">
                  Control Center
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('branding');
                    setMobileDrawerOpen(false);
                    showToast('Switched to Logo & Brand Identity configuration.', 'info');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                    activeTab === 'branding'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ImageIcon className="w-4 h-4" /> Logo & Brand
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('sections');
                    setMobileDrawerOpen(false);
                    showToast('Switched to Dynamic Sections Content editor.', 'info');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                    activeTab === 'sections'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-4 h-4" /> Sections Text
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${activeTab === 'sections' ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                    29 Items
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('media');
                    setMobileDrawerOpen(false);
                    showToast('Switched to Media & Asset Gallery.', 'info');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                    activeTab === 'media'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Upload className="w-4 h-4" /> Media Gallery
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('system');
                    setMobileDrawerOpen(false);
                    showToast('Switched to System Security & Devices.', 'info');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                    activeTab === 'system'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" /> System & Security
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Status Card in Drawer */}
              <div className="bg-slate-950 border border-slate-800 rounded-sm p-3.5 text-[11px] space-y-2 text-slate-400">
                <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                  System Status
                </div>
                <p>Environment: <strong className="text-white">Live Production</strong></p>
                <p>Services: <strong className="text-lime-400">Synchronized & Active</strong></p>
                <p>Admin: <strong className="text-slate-200">{adminUser?.username || 'Administrator'}</strong></p>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onBackToHome();
                  showToast('Switched to live website view.', 'info');
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-sm text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-lime-400" /> View Website
              </button>
              <button
                type="button"
                onClick={async () => {
                  setMobileDrawerOpen(false);
                  await refreshContent();
                  showToast('Content synchronized successfully.');
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync Content
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logout();
                  showToast('Logged out successfully.', 'info');
                }}
                className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 rounded-sm text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Section Picker Modal */}
      {mobileSectionPickerOpen && (
        <div className="fixed inset-0 z-[220] bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-t-xl sm:rounded-sm w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-lime-400" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Select Section to Edit
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    29 Website Sections & Dedicated Pages
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileSectionPickerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search inside picker */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/60">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sectionSearch}
                  onChange={(e) => setSectionSearch(e.target.value)}
                  placeholder="Filter 29 sections (e.g. hero, about, services, footer)..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none placeholder:text-slate-500"
                />
                {sectionSearch && (
                  <button
                    type="button"
                    onClick={() => setSectionSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Section List */}
            <div className="p-3 overflow-y-auto flex-1 space-y-1.5 custom-scrollbar">
              {ALL_SECTIONS_CONFIG
                .filter((s) => {
                  if (!sectionSearch.trim()) return true;
                  const q = sectionSearch.toLowerCase();
                  return s.label.toLowerCase().includes(q) || s.key.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
                })
                .map((sec) => {
                  const isSelected = activeSectionKey === sec.key;
                  return (
                    <button
                      key={sec.key}
                      type="button"
                      onClick={() => {
                        setActiveSectionKey(sec.key);
                        setMobileSectionPickerOpen(false);
                        setMobileSectionView('editor');
                        showToast(`Switched to '${sec.label}'.`, 'info');
                      }}
                      className={`w-full text-left p-2.5 rounded-sm border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-lime-500/15 border-lime-500/50 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-slate-800 text-lime-400 rounded-sm">
                            {sec.tag}
                          </span>
                          <span className="text-xs truncate font-bold text-white">
                            {sec.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {sec.description}
                        </p>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-lime-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-8 flex-1 grid lg:grid-cols-5 gap-6 sm:gap-8 overflow-hidden">
        {/* Navigation Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-3 pb-2 border-b border-slate-800">
              Control Center
            </p>

            <button
              onClick={() => {
                setActiveTab('branding');
                showToast('Switched to Logo & Brand Identity configuration.', 'info');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'branding'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Logo & Brand
            </button>

            <button
              onClick={() => {
                setActiveTab('sections');
                showToast('Switched to Dynamic Sections Content editor.', 'info');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'sections'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Sections Text
            </button>

            <button
              onClick={() => {
                setActiveTab('media');
                showToast('Switched to Media & Asset Gallery.', 'info');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'media'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" /> Media Gallery
            </button>

            <button
              onClick={() => {
                setActiveTab('system');
                showToast('Switched to System Security & Devices.', 'info');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all text-left ${
                activeTab === 'system'
                  ? 'bg-lime-500 text-slate-950 font-black shadow-lg shadow-lime-500/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> System & Security
            </button>
          </div>

          {/* System Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 text-[11px] space-y-2 text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
              System Status
            </div>
            <p>Environment: <strong className="text-white">Live Production</strong></p>
            <p>Services: <strong className="text-lime-400">Synchronized & Active</strong></p>
            <p>Admin: <strong className="text-slate-200">{adminUser?.username || 'Administrator'}</strong></p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-4 space-y-6">
          {/* TAB 1: LOGO & BRANDING */}
          {activeTab === 'branding' && (
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
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
                  className="px-4 sm:px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all shadow-md shadow-lime-500/20 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Changes'}
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
                      {isUploading ? 'Uploading file...' : 'Click or Drag Logo to Upload'}
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
                  className="px-4 sm:px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all shadow-md shadow-lime-500/20 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Brand Settings'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS TEXT & CMS */}
          {activeTab === 'sections' && (() => {
            const filteredSections = ALL_SECTIONS_CONFIG.filter((sec) => {
              const matchesCat = sectionCategoryFilter === 'all' || sec.category === sectionCategoryFilter;
              const matchesQuery =
                !sectionSearch.trim() ||
                sec.label.toLowerCase().includes(sectionSearch.toLowerCase()) ||
                sec.key.toLowerCase().includes(sectionSearch.toLowerCase()) ||
                sec.description.toLowerCase().includes(sectionSearch.toLowerCase()) ||
                sec.route.toLowerCase().includes(sectionSearch.toLowerCase());
              return matchesCat && matchesQuery;
            });

            const currentSectionMeta = ALL_SECTIONS_CONFIG.find((s) => s.key === activeSectionKey) || {
              key: activeSectionKey,
              category: 'landing' as const,
              label: activeSectionKey.toUpperCase(),
              tag: 'CUSTOM',
              description: 'Custom content section',
              route: '#home',
            };

            const wordCount = (sectionForm.content || '').trim() ? (sectionForm.content || '').trim().split(/\s+/).length : 0;
            const charCount = (sectionForm.content || '').length;

            return (
              <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 sm:p-6 md:p-8 space-y-6">
                {/* CMS Master Header */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-slate-800 pb-5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-lime-500/15 border border-lime-500/30 text-lime-400 text-[10px] font-black uppercase tracking-widest rounded-sm">
                        Content Management System
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        29 Pages & Sections Live & Synchronized
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <FileText className="w-6 h-6 text-lime-400" /> Website Sections & Pages Editor
                    </h2>
                    <p className="text-xs text-slate-400">
                      Organized section-by-section and page-by-page. Modify copy, headlines, media banners, and action links with instant live synchronization.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePreviewRoute(currentSectionMeta.route)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title={`Preview '${currentSectionMeta.label}' on website`}
                    >
                      <Eye className="w-3.5 h-3.5 text-lime-400" />
                      <span>Preview Live</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSection}
                      disabled={isSaving}
                      className="px-4 sm:px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all shadow-md shadow-lime-500/20 active:translate-y-0.5 shrink-0"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Section
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Category Navigation Pills & Quick Search */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'all', label: 'All Items', count: ALL_SECTIONS_CONFIG.length },
                      { key: 'landing', label: '🌟 Landing Page', count: ALL_SECTIONS_CONFIG.filter((s) => s.category === 'landing').length },
                      { key: 'page', label: '📄 Dedicated Pages', count: ALL_SECTIONS_CONFIG.filter((s) => s.category === 'page').length },
                      { key: 'header', label: '🔝 Header & Nav', count: ALL_SECTIONS_CONFIG.filter((s) => s.category === 'header').length },
                      { key: 'footer', label: '🔻 Footer & Legal', count: ALL_SECTIONS_CONFIG.filter((s) => s.category === 'footer').length },
                    ].map((cat) => (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setSectionCategoryFilter(cat.key as any)}
                        className={`px-3.5 py-1.5 rounded-sm text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                          sectionCategoryFilter === cat.key
                            ? 'bg-lime-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-sm ${
                          sectionCategoryFilter === cat.key ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={sectionSearch}
                      onChange={(e) => setSectionSearch(e.target.value)}
                      placeholder="Filter sections and pages by title, section key, or route (e.g. wallfeel, about, hero, header)..."
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none placeholder:text-slate-500 transition-colors"
                    />
                    {sectionSearch && (
                      <button
                        type="button"
                        onClick={() => setSectionSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile View Switcher (Editor vs Directory) */}
                <div className="lg:hidden flex items-center p-1 bg-slate-950 border border-slate-800 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setMobileSectionView('editor')}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                      mobileSectionView === 'editor'
                        ? 'bg-lime-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Edit: {currentSectionMeta.tag}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileSectionView('directory')}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                      mobileSectionView === 'directory'
                        ? 'bg-lime-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span>Directory ({filteredSections.length})</span>
                  </button>
                </div>

                {/* Master-Detail Split Grid */}
                <div className="grid lg:grid-cols-12 gap-6 pt-2">
                  {/* Left Column: Categorized Section Directory */}
                  <div className={`space-y-2 lg:col-span-4 ${mobileSectionView === 'directory' ? 'block' : 'hidden lg:block'}`}>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 pb-1">
                      <span>DIRECTORY ({filteredSections.length})</span>
                      <span className="text-[10px] text-slate-500 uppercase">Select to edit</span>
                    </div>

                    <div className="max-h-[740px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {filteredSections.length === 0 ? (
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-sm text-center text-xs text-slate-500">
                          No sections match the current search or category filter.
                        </div>
                      ) : (
                        filteredSections.map((sec) => {
                          const isSelected = activeSectionKey === sec.key;
                          const hasContent = !!(sections[sec.key]?.title || sections[sec.key]?.content);

                          const tagColor =
                            sec.category === 'header'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : sec.category === 'footer'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : sec.category === 'page'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30';

                          return (
                            <button
                              key={sec.key}
                              type="button"
                              onClick={() => {
                                setActiveSectionKey(sec.key);
                                setAdvancedJsonOpen(false);
                                setMobileSectionView('editor');
                                showToast(`Loaded '${sec.label}' into editor.`, 'info');
                              }}
                              className={`w-full text-left p-3.5 rounded-sm border transition-all flex flex-col gap-1.5 group ${
                                isSelected
                                  ? 'bg-slate-900 border-lime-500 shadow-lg shadow-lime-500/10'
                                  : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border ${tagColor}`}>
                                  {sec.tag}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300">
                                  {sec.route}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <p className={`text-xs font-black transition-colors ${
                                  isSelected ? 'text-lime-400' : 'text-white group-hover:text-lime-300'
                                }`}>
                                  {sec.label}
                                </p>
                                <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                                  {sec.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 border-t border-slate-900">
                                <span className="font-mono text-slate-400">key: {sec.key}</span>
                                {hasContent ? (
                                  <span className="text-lime-400 font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Synced
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Default</span>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Full Rich Form Editor */}
                  <div className={`lg:col-span-8 bg-slate-950 border border-slate-800 rounded-sm p-4 sm:p-6 space-y-6 overflow-hidden w-full max-w-full ${mobileSectionView === 'editor' ? 'block' : 'hidden lg:block'}`}>
                    {/* Active Section Banner */}
                    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-lime-500 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-sm">
                            Editing {currentSectionMeta.tag}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Key: <strong className="text-white">{currentSectionMeta.key}</strong>
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Route: <strong className="text-lime-400">{currentSectionMeta.route}</strong>
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">
                          {currentSectionMeta.label}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {currentSectionMeta.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePreviewRoute(currentSectionMeta.route)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5 text-lime-400" />
                          <span>View on Page</span>
                        </button>
                      </div>
                    </div>

                    {/* Section Edit Form */}
                    <form onSubmit={handleSaveSection} className="space-y-6">
                      {/* Eyebrow Badge & Main Title */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                            <span>Badge / Eyebrow Tagline</span>
                            <span className="text-[10px] text-slate-500 font-mono">badge</span>
                          </label>
                          <input
                            type="text"
                            value={sectionForm.badge}
                            onChange={(e) => setSectionForm({ ...sectionForm, badge: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                            placeholder="e.g. STRATEGIC INTELLIGENCE, CORE PHILOSOPHY, etc."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                            <span>Main Title / Headline</span>
                            <span className="text-[10px] text-slate-500 font-mono">title</span>
                          </label>
                          <input
                            type="text"
                            value={sectionForm.title}
                            onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none font-bold"
                            placeholder="Main Section or Page Headline"
                          />
                        </div>
                      </div>

                      {/* Subtitle / Framing sentence */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Subtitle / Supporting Statement</span>
                          <span className="text-[10px] text-slate-500 font-mono">subtitle</span>
                        </label>
                        <input
                          type="text"
                          value={sectionForm.subtitle}
                          onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                          placeholder="Supporting statement or framing thesis..."
                        />
                      </div>

                      {/* Main Narrative Content Textarea */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Narrative Content / Body Copy
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            {wordCount} words | {charCount} chars
                          </span>
                        </div>
                        <textarea
                          rows={6}
                          value={sectionForm.content}
                          onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs leading-relaxed focus:border-lime-500 focus:outline-none resize-y"
                          placeholder="Full narrative text for this section or page..."
                        />
                        <p className="text-[10px] text-slate-500">
                          Text will format automatically across responsive viewports with typography matching the brand design system.
                        </p>
                      </div>

                      {/* Call-to-Action Buttons */}
                      <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-sm">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={sectionForm.ctaText}
                            onChange={(e) => setSectionForm({ ...sectionForm, ctaText: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none"
                            placeholder="e.g. Explore Capabilities, Contact Team..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            CTA Button Link / Anchor Route
                          </label>
                          <input
                            type="text"
                            value={sectionForm.ctaLink}
                            onChange={(e) => setSectionForm({ ...sectionForm, ctaLink: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none font-mono"
                            placeholder="e.g. #contact, #services-page, https://..."
                          />
                        </div>
                      </div>

                      {/* Featured Media / Banner Image URL & Asset Selector */}
                      <div className="space-y-3 p-4 bg-slate-900/60 border border-slate-800/80 rounded-sm">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5 text-lime-400" />
                            <span>Section Media Banner / Embed URL</span>
                          </label>
                          <span className="text-[10px] text-slate-500 font-mono">mediaUrl</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={sectionForm.mediaUrl}
                            onChange={(e) => setSectionForm({ ...sectionForm, mediaUrl: e.target.value })}
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs focus:border-lime-500 focus:outline-none font-mono"
                            placeholder="https://... or /uploads/... (or YouTube embed URL)"
                          />
                          <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0">
                            <Upload className="w-3.5 h-3.5 text-lime-400" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSectionMediaUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              loadMedia();
                              setGalleryModalOpen(true);
                            }}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Folder className="w-3.5 h-3.5 text-lime-400" />
                            <span>From Gallery</span>
                          </button>
                          {sectionForm.mediaUrl && (
                            <button
                              type="button"
                              onClick={() => setSectionForm({ ...sectionForm, mediaUrl: '' })}
                              className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-sm text-xs font-bold transition-colors shrink-0"
                              title="Clear media URL"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Media Preview Box */}
                        {sectionForm.mediaUrl && (
                          <div className="p-3 bg-slate-950 rounded-sm border border-slate-800 flex items-center gap-4">
                            <div className="w-24 h-16 bg-slate-900 rounded-sm overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                              {sectionForm.mediaUrl.includes('youtube') || sectionForm.mediaUrl.includes('embed') ? (
                                <Tv className="w-6 h-6 text-lime-400" />
                              ) : (
                                <img
                                  src={sectionForm.mediaUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div className="text-xs space-y-0.5 overflow-hidden">
                              <p className="font-bold text-white truncate">{sectionForm.mediaUrl}</p>
                              <p className="text-[10px] text-slate-500 font-mono">Active media URL for this section</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Specialized Sub-Editors */}
                      {/* 1. Philosophy Sub-Editor */}
                      {activeSectionKey === 'philosophy' && (
                        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-sm space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-wider text-lime-400 flex items-center gap-2">
                            <Compass className="w-4 h-4" /> Philosophy Supporting Paragraphs
                          </h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase">Supporting Paragraph 1</label>
                              <textarea
                                rows={3}
                                value={sectionForm.parsedData?.paragraph1 || ''}
                                onChange={(e) =>
                                  setSectionForm({
                                    ...sectionForm,
                                    parsedData: { ...sectionForm.parsedData, paragraph1: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs leading-relaxed focus:border-lime-500 focus:outline-none"
                                placeholder="First supporting philosophy paragraph..."
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase">Supporting Paragraph 2</label>
                              <textarea
                                rows={3}
                                value={sectionForm.parsedData?.paragraph2 || ''}
                                onChange={(e) =>
                                  setSectionForm({
                                    ...sectionForm,
                                    parsedData: { ...sectionForm.parsedData, paragraph2: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs leading-relaxed focus:border-lime-500 focus:outline-none"
                                placeholder="Second supporting philosophy paragraph..."
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Hero Slides Sub-Editor */}
                      {activeSectionKey === 'hero' && sectionForm.parsedData?.slides && (
                        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-sm space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-wider text-lime-400 flex items-center gap-2">
                            <Film className="w-4 h-4" /> Hero Banner Presentation Slides (3 Dynamic Slides)
                          </h4>
                          <div className="space-y-4">
                            {sectionForm.parsedData.slides.map((slide: any, idx: number) => (
                              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-lime-400 px-2 py-0.5 bg-lime-500/10 border border-lime-500/20 rounded-sm">
                                    Slide {idx + 1}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500">Slide #{idx + 1}</span>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Slide Title</label>
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
                                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs"
                                      placeholder="e.g. Azariah."
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Slide Subtitle</label>
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
                                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs"
                                      placeholder="e.g. Media Impact."
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-slate-400">Slide Description Narrative</label>
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
                                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-sm text-xs leading-relaxed"
                                    placeholder="Slide narrative..."
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Header Sub-Editor */}
                      {activeSectionKey === 'header' && (
                        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-sm space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-wider text-lime-400 flex items-center gap-2">
                            <Layout className="w-4 h-4" /> Header Announcement & Navigation Banner
                          </h4>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Top Announcement Banner Notice</label>
                            <input
                              type="text"
                              value={sectionForm.parsedData?.notice || ''}
                              onChange={(e) =>
                                setSectionForm({
                                  ...sectionForm,
                                  parsedData: { ...sectionForm.parsedData, notice: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs"
                              placeholder="e.g. Global Operations & Strategic Media Advisory Active"
                            />
                          </div>
                        </div>
                      )}

                      {/* 4. Footer Sub-Editor */}
                      {activeSectionKey === 'footer' && (
                        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-sm space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-wider text-lime-400 flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Corporate Legal Notice & Copyright
                          </h4>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Copyright Statement</label>
                            <input
                              type="text"
                              value={sectionForm.parsedData?.copyright || ''}
                              onChange={(e) =>
                                setSectionForm({
                                  ...sectionForm,
                                  parsedData: { ...sectionForm.parsedData, copyright: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-sm text-xs"
                              placeholder="© 2026 Azariah Management Group LLC. All rights reserved."
                            />
                          </div>
                        </div>
                      )}

                      {/* Advanced JSON Structured Data Editor (Collapsible) */}
                      <div className="border border-slate-800/80 rounded-sm overflow-hidden bg-slate-900/40">
                        <button
                          type="button"
                          onClick={() => setAdvancedJsonOpen(!advancedJsonOpen)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-lime-400" />
                            <span className="text-xs font-black uppercase tracking-wider text-white">
                              Advanced Structured Properties (JSON)
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {advancedJsonOpen ? 'Hide Editor' : 'Click to View / Edit Extra Attributes'}
                            </span>
                          </div>
                          <span className="text-xs text-lime-400 font-mono">
                            {advancedJsonOpen ? '− Collapse' : '+ Expand'}
                          </span>
                        </button>

                        {advancedJsonOpen && (
                          <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] text-slate-400">
                                Directly view or edit custom parameters, slide arrays, or structured section metadata.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    const parsed = JSON.parse(rawJsonText);
                                    setRawJsonText(JSON.stringify(parsed, null, 2));
                                    setJsonError(null);
                                    showToast('JSON beautified successfully!');
                                  } catch (err: any) {
                                    setJsonError(`JSON Syntax Error: ${err.message}`);
                                  }
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-[10px] font-bold uppercase transition-colors"
                              >
                                Format JSON
                              </button>
                            </div>

                            <textarea
                              rows={8}
                              value={rawJsonText}
                              onChange={(e) => {
                                setRawJsonText(e.target.value);
                                try {
                                  JSON.parse(e.target.value);
                                  setJsonError(null);
                                } catch (err: any) {
                                  setJsonError(err.message);
                                }
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-lime-300 font-mono text-xs rounded-sm focus:border-lime-500 focus:outline-none"
                            />

                            {jsonError && (
                              <p className="text-[11px] text-red-400 font-mono flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Invalid JSON: {jsonError}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Sticky Save & Action Buttons Bar */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-4 border-t border-slate-800 w-full max-w-full">
                        <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                          <span className="truncate">All content changes published live across the website</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => {
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
                                showToast('Reset form to previously saved content.');
                              }
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-bold transition-colors"
                          >
                            Reset
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePreviewRoute(currentSectionMeta.route)}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5 text-lime-400" /> Preview Live
                          </button>

                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 sm:px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all shadow-md shadow-lime-500/20 active:translate-y-0.5 shrink-0 max-w-full justify-center"
                          >
                            {isSaving ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" /> Save {currentSectionMeta.tag} Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Gallery Picker Modal */}
                {galleryModalOpen && (
                  <div className="fixed inset-0 z-[210] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Folder className="w-5 h-5 text-lime-400" />
                          <h3 className="text-sm font-black uppercase tracking-wider text-white">
                            Select Asset from Media Gallery
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGalleryModalOpen(false)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-4 overflow-y-auto flex-1">
                        {mediaList.length === 0 ? (
                          <div className="p-12 text-center text-slate-500 text-xs">
                            No assets in media library yet. Use the Upload button to add images.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {mediaList.map((media) => (
                              <button
                                key={media.id}
                                type="button"
                                onClick={() => {
                                  setSectionForm((prev) => ({ ...prev, mediaUrl: media.url }));
                                  setGalleryModalOpen(false);
                                  showToast(`Asset '${media.originalName}' attached to ${currentSectionMeta.label}!`);
                                }}
                                className="p-2 bg-slate-950 border border-slate-800 hover:border-lime-500 rounded-sm flex flex-col gap-2 text-left group transition-all"
                              >
                                <div className="h-24 bg-slate-900 rounded-sm overflow-hidden flex items-center justify-center">
                                  <img
                                    src={media.url}
                                    alt={media.originalName}
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <p className="text-[11px] font-bold text-slate-300 truncate w-full" title={media.originalName}>
                                  {media.originalName}
                                </p>
                                <span className="text-[9px] text-lime-400 font-mono font-bold uppercase">
                                  Click to Select
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
                        <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-lime-400" />
                          <span>Upload New File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              await handleSectionMediaUpload(e);
                              setGalleryModalOpen(false);
                            }}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setGalleryModalOpen(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-sm text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 3: MEDIA GALLERY */}
          {activeTab === 'media' && (
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 sm:p-6 md:p-8 space-y-6">
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
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-lime-400" /> Security & Access Architecture
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage administrator credentials, device trust, and access control.
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
                    onClick={async () => {
                      await loadDevices();
                      showToast('Authorized devices reloaded.');
                    }}
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Security Architecture</span>
                    <p className="font-bold text-white">Two-Factor Authentication & Device Trust</p>
                    <p className="text-slate-400 text-[11px]">7-Day Authorization Protocol</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Content Synchronization</span>
                    <p className="font-bold text-white">Instant Multi-Section Publishing</p>
                    <p className="text-slate-400 text-[11px]">Real-Time View Revalidation</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Infrastructure</span>
                    <p className="font-bold text-white">High-Performance Enterprise Cluster</p>
                    <p className="text-slate-400 text-[11px]">Encrypted Transmission Protocol</p>
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
