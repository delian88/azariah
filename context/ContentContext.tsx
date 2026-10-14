import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SiteSettings {
  logo_url?: string;
  logo_text?: string;
  logo_subtext?: string;
  site_name?: string;
  tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  office_hours?: string;
  [key: string]: string | undefined;
}

export interface SectionContent {
  id?: number;
  sectionKey: string;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  mediaUrl?: string | null;
  data?: string | null;
  parsedData?: any;
  updatedAt?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  name?: string | null;
}

export interface LoginResult {
  success: boolean;
  requiresOtp?: boolean;
  email?: string;
  emailMasked?: string;
  reason?: string;
  devOtpCode?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface DeviceInfo {
  id: number;
  deviceToken: string;
  deviceName: string;
  ipAddress: string;
  trustedUntil: string;
  lastLoginAt: string;
  isTrusted: number | boolean;
}

interface ContentContextType {
  settings: SiteSettings;
  sections: Record<string, SectionContent>;
  loading: boolean;
  token: string | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  deviceToken: string;
  login: (username: string, password: string) => Promise<LoginResult>;
  verifyOtp: (username: string, otpCode: string) => Promise<VerifyOtpResult>;
  resendOtp: (username: string) => Promise<{ success: boolean; message?: string; devOtpCode?: string; error?: string }>;
  fetchDevices: () => Promise<DeviceInfo[]>;
  revokeDevice: (deviceId?: number, deviceToken?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
  updateSection: (sectionKey: string, data: Partial<SectionContent>) => Promise<{ success: boolean; error?: string }>;
  uploadMedia: (file: File, setAsLogo?: boolean) => Promise<{ success: boolean; url?: string; error?: string }>;
  refreshContent: () => Promise<void>;
  getSection: (key: string) => SectionContent | undefined;
}

const defaultSettings: SiteSettings = {
  logo_url: "",
  logo_text: "Azariah",
  logo_subtext: "MANAGEMENT GROUP",
  site_name: "Azariah Management Group",
  tagline: "Strategic Intelligence & Media Impact",
  contact_email: "info@azariahmg.com",
  contact_phone: "+1 (443) 222-0000",
  contact_address: "Baltimore, Maryland, USA",
  office_hours: "Mon - Fri: 8:00 AM - 6:00 PM EST",
};

export const getApiUrl = (endpoint: string): string => {
  const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  if ((import.meta as any).env?.VITE_API_BASE) {
    const base = (import.meta as any).env.VITE_API_BASE.replace(/\/+$/, '');
    return `${base}/${clean}`;
  }

  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.startsWith('/azariah')) {
      return `/azariah/${clean}`;
    }
  }

  return `/${clean}`;
};

export const getAssetUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = url.startsWith('/') ? url.slice(1) : url;
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/azariah')) {
    return `/azariah/${clean}`;
  }
  return `/${clean}`;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [sections, setSections] = useState<Record<string, SectionContent>>({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("amg_admin_token"));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem("amg_admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Persistent Device Token in localStorage for device recognition & 7-day trust
  const [deviceToken] = useState<string>(() => {
    let dev = localStorage.getItem("amg_device_token");
    if (!dev) {
      dev = "amg_dev_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem("amg_device_token", dev);
    }
    return dev;
  });

  const fetchContent = useCallback(async () => {
    try {
      const [settingsRes, sectionsRes] = await Promise.all([
        fetch(getApiUrl("api/settings")).then((r) => r.json()).catch(() => null),
        fetch(getApiUrl("api/sections")).then((r) => r.json()).catch(() => null),
      ]);

      if (settingsRes && settingsRes.success && settingsRes.settings) {
        setSettings((prev) => ({ ...prev, ...settingsRes.settings }));
      }

      if (sectionsRes && sectionsRes.success && sectionsRes.sections) {
        setSections(sectionsRes.sections);
      }
    } catch (err) {
      console.warn("Failed to fetch dynamic content from API, using cached/defaults:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Keep admin logged in across landing page & reloads; only clear on explicit logout or verified token rejection
  useEffect(() => {
    if (!token) return;

    fetch(getApiUrl("api/admin/me"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          setAdminUser(data.user);
          localStorage.setItem("amg_admin_user", JSON.stringify(data.user));
        } else if (data.error && (data.error.includes("expired") || data.error.includes("Invalid token") || data.error.includes("Unauthorized"))) {
          // Server explicitly rejected token
          logout();
        }
      })
      .catch((err) => {
        // Network offline or deferred - DO NOT sign out!
        console.warn("Session check deferred, keeping local session active:", err);
      });
  }, [token]);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      const isWin = typeof navigator !== "undefined" && navigator.userAgent.includes("Windows");
      const isMac = typeof navigator !== "undefined" && navigator.userAgent.includes("Macintosh");
      const deviceName = `${isWin ? "Windows PC" : isMac ? "Mac" : "Mobile / Web"} Browser`;

      const res = await fetch(getApiUrl("api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, deviceToken, deviceName }),
      });
      const data = await res.json();

      if (data.requiresOtp) {
        return {
          success: true,
          requiresOtp: true,
          email: data.email,
          emailMasked: data.emailMasked || data.email,
          reason: data.reason,
          devOtpCode: data.devOtpCode,
        };
      }

      if (data.success && data.token) {
        setToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem("amg_admin_token", data.token);
        localStorage.setItem("amg_admin_user", JSON.stringify(data.user));
        return { success: true, requiresOtp: false };
      } else {
        return { success: false, error: data.error || "Invalid username or password" };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Login request failed" };
    }
  };

  const verifyOtp = async (username: string, otpCode: string): Promise<VerifyOtpResult> => {
    try {
      const isWin = typeof navigator !== "undefined" && navigator.userAgent.includes("Windows");
      const isMac = typeof navigator !== "undefined" && navigator.userAgent.includes("Macintosh");
      const deviceName = `${isWin ? "Windows PC" : isMac ? "Mac" : "Mobile / Web"} Browser`;

      const res = await fetch(getApiUrl("api/admin/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otpCode, deviceToken, deviceName }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem("amg_admin_token", data.token);
        localStorage.setItem("amg_admin_user", JSON.stringify(data.user));
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || "Invalid or expired verification code" };
    } catch (err: any) {
      return { success: false, error: err.message || "Verification request failed" };
    }
  };

  const resendOtp = async (username: string) => {
    try {
      const isWin = typeof navigator !== "undefined" && navigator.userAgent.includes("Windows");
      const isMac = typeof navigator !== "undefined" && navigator.userAgent.includes("Macintosh");
      const deviceName = `${isWin ? "Windows PC" : isMac ? "Mac" : "Mobile / Web"} Browser`;

      const res = await fetch(getApiUrl("api/admin/resend-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, deviceToken, deviceName }),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, message: data.message, devOtpCode: data.devOtpCode };
      }
      return { success: false, error: data.error || "Failed to resend code" };
    } catch (err: any) {
      return { success: false, error: err.message || "Resend request failed" };
    }
  };

  const fetchDevices = async (): Promise<DeviceInfo[]> => {
    if (!token) return [];
    try {
      const res = await fetch(getApiUrl("api/admin/devices"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data.success && Array.isArray(data.devices) ? data.devices : [];
    } catch {
      return [];
    }
  };

  const revokeDevice = async (deviceId?: number, devToken?: string) => {
    if (!token) return { success: false, error: "Authentication required" };
    try {
      const res = await fetch(getApiUrl("api/admin/revoke-device"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceId, deviceToken: devToken }),
      });
      const data = await res.json();
      return { success: !!data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem("amg_admin_token");
    localStorage.removeItem("amg_admin_user");
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    if (!token) return { success: false, error: "Authentication required" };

    try {
      const res = await fetch(getApiUrl("api/admin/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: newSettings }),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
        return { success: true };
      }
      return { success: false, error: data.error || "Update failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update settings" };
    }
  };

  const updateSection = async (sectionKey: string, sectionData: Partial<SectionContent>) => {
    if (!token) return { success: false, error: "Authentication required" };

    try {
      const res = await fetch(getApiUrl(`api/admin/sections/${sectionKey}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sectionData),
      });
      const data = await res.json();
      if (data.success && data.section) {
        setSections((prev) => ({
          ...prev,
          [sectionKey]: data.section,
        }));
        return { success: true };
      }
      return { success: false, error: data.error || "Section update failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update section" };
    }
  };

  const uploadMedia = async (file: File, setAsLogo = false) => {
    if (!token) return { success: false, error: "Authentication required" };

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (setAsLogo) {
        formData.append("setAsLogo", "true");
      }

      const res = await fetch(getApiUrl("api/admin/upload"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (setAsLogo) {
          setSettings((prev) => ({ ...prev, logo_url: data.url }));
        }
        return { success: true, url: data.url };
      }
      return { success: false, error: data.error || "Upload failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Upload request failed" };
    }
  };

  const getSection = (key: string): SectionContent | undefined => {
    return sections[key];
  };

  return (
    <ContentContext.Provider
      value={{
        settings,
        sections,
        loading,
        token,
        adminUser,
        isAdmin: !!token && !!adminUser,
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
        refreshContent: fetchContent,
        getSection,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
