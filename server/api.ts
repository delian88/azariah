import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma, seedInitialData } from "./db";
import { generateToken, requireAuth, AuthenticatedRequest } from "./auth";
import { upload } from "./upload";

export const apiRouter = Router();

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// 1. Get all site settings as a key-value dictionary
apiRouter.get("/settings", async (_req, res: Response) => {
  try {
    const settingsList = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const item of settingsList) {
      settingsMap[item.key] = item.value;
    }
    res.json({ success: true, settings: settingsMap });
  } catch (err: any) {
    console.error("[API Error /settings]:", err);
    res.status(500).json({ success: false, error: "Failed to fetch settings" });
  }
});

// 2. Get all sections
apiRouter.get("/sections", async (_req, res: Response) => {
  try {
    const sectionsList = await prisma.sectionContent.findMany();
    const sectionsMap: Record<string, any> = {};
    for (const section of sectionsList) {
      let parsedData = null;
      if (section.data) {
        try {
          parsedData = JSON.parse(section.data);
        } catch {
          parsedData = section.data;
        }
      }
      sectionsMap[section.sectionKey] = {
        ...section,
        parsedData,
      };
    }
    res.json({ success: true, sections: sectionsMap });
  } catch (err: any) {
    console.error("[API Error /sections]:", err);
    res.status(500).json({ success: false, error: "Failed to fetch sections" });
  }
});

// 3. Get single section by key
apiRouter.get("/sections/:key", async (req, res: Response) => {
  try {
    const key = String(req.params.key);
    const section = await prisma.sectionContent.findUnique({
      where: { sectionKey: key },
    });
    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found" });
    }
    let parsedData = null;
    if (section.data) {
      try {
        parsedData = JSON.parse(section.data);
      } catch {
        parsedData = section.data;
      }
    }
    res.json({ success: true, section: { ...section, parsedData } });
  } catch (err: any) {
    console.error(`[API Error /sections/${req.params.key}]:`, err);
    res.status(500).json({ success: false, error: "Failed to fetch section" });
  }
});

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

// Admin Login
apiRouter.post("/admin/login", async (req, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password required" });
    }

    const cleanUsername = String(username).trim();
    const sanitizedEmail = cleanUsername.replace(",", ".");

    const user = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanUsername },
          { username: sanitizedEmail },
          { email: sanitizedEmail },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err: any) {
    console.error("[API Error /admin/login]:", err);
    res.status(500).json({ success: false, error: "Authentication failed" });
  }
});

// Verify Current Admin Token
apiRouter.get("/admin/me", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.user!.id },
      select: { id: true, username: true, email: true, name: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to verify session" });
  }
});

// Change Admin Password
apiRouter.post("/admin/change-password", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Both current and new password required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "New password must be at least 6 characters" });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: req.user!.id },
    });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ success: false, error: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    console.error("[API Error /admin/change-password]:", err);
    res.status(500).json({ success: false, error: "Failed to update password" });
  }
});

// ==========================================
// ADMIN CONTENT MANAGEMENT (PROTECTED)
// ==========================================

// Update Site Settings (single or batch)
apiRouter.put("/admin/settings", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { settings } = req.body; // e.g. { logo_url: "...", site_name: "..." }
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ success: false, error: "Invalid settings payload" });
    }

    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value ?? "") },
          create: {
            key,
            value: String(value ?? ""),
            type: key.includes("url") || key.includes("image") ? "image" : "text",
          },
        })
      );
    }

    await prisma.$transaction(updates);

    // Return updated settings
    const allSettings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const item of allSettings) {
      settingsMap[item.key] = item.value;
    }

    res.json({ success: true, message: "Settings updated successfully", settings: settingsMap });
  } catch (err: any) {
    console.error("[API Error PUT /admin/settings]:", err);
    res.status(500).json({ success: false, error: "Failed to update settings" });
  }
});

// Update Section Content
apiRouter.put("/admin/sections/:key", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const key = String(req.params.key);
    const { badge, title, subtitle, content, ctaText, ctaLink, mediaUrl, data } = req.body;

    const dataString = typeof data === "object" ? JSON.stringify(data) : typeof data === "string" ? data : undefined;

    const updatedSection = await prisma.sectionContent.upsert({
      where: { sectionKey: key },
      update: {
        badge,
        title,
        subtitle,
        content,
        ctaText,
        ctaLink,
        mediaUrl,
        ...(dataString !== undefined ? { data: dataString } : {}),
      },
      create: {
        sectionKey: key,
        badge,
        title,
        subtitle,
        content,
        ctaText,
        ctaLink,
        mediaUrl,
        data: dataString || null,
      },
    });

    let parsedData = null;
    if (updatedSection.data) {
      try {
        parsedData = JSON.parse(updatedSection.data);
      } catch {
        parsedData = updatedSection.data;
      }
    }

    res.json({
      success: true,
      message: `Section '${key}' updated successfully`,
      section: { ...updatedSection, parsedData },
    });
  } catch (err: any) {
    console.error(`[API Error PUT /admin/sections/${req.params.key}]:`, err);
    res.status(500).json({ success: false, error: "Failed to update section content" });
  }
});

// Upload File (Logo or Image)
apiRouter.post("/admin/upload", requireAuth, upload.single("file"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const publicUrl = `/uploads/${req.file.filename}`;

    const media = await prisma.uploadedMedia.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: publicUrl,
      },
    });

    // If 'setAsLogo' flag is true, automatically update the logo setting!
    if (req.body.setAsLogo === "true" || req.body.setAsLogo === true) {
      await prisma.siteSetting.upsert({
        where: { key: "logo_url" },
        update: { value: publicUrl },
        create: { key: "logo_url", value: publicUrl, type: "image", description: "Website Logo Image" },
      });
    }

    res.json({
      success: true,
      message: "File uploaded successfully",
      url: publicUrl,
      media,
    });
  } catch (err: any) {
    console.error("[API Error /admin/upload]:", err);
    res.status(500).json({ success: false, error: err.message || "File upload failed" });
  }
});

// Get List of Uploaded Media
apiRouter.get("/admin/media", requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const media = await prisma.uploadedMedia.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ success: true, media });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to fetch media" });
  }
});

// Reset Content to Defaults
apiRouter.post("/admin/reset-defaults", requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await seedInitialData();
    res.json({ success: true, message: "Default contents re-seeded successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to reset defaults" });
  }
});
