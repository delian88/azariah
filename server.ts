import express from "express";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // SMTP Configuration (Fallback for non-PHP environments like Preview)
  const smtpConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "taiwodele88@gmail.com",
      pass: process.env.SMTP_PASS || "ucbznlbhnbogwuer",
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  // API routes
  app.post("/api/inquiry", async (req, res) => {
    const { fullName, email, organization, details } = req.body;

    if (!fullName || !email || !details) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = JSON.stringify({ fullName, email, organization, details });
    const phpScriptPath = path.join(process.cwd(), "mailer.php");

    // Strategy: Try PHP first (for Namecheap), fallback to Nodemailer (for Preview/Local)
    const child = exec(`php "${phpScriptPath}"`, async (error, stdout) => {
      if (error) {
        console.warn("PHP not found or failed, falling back to Nodemailer. This is expected in the preview environment.");
        
        try {
          // Fallback to Nodemailer
          await transporter.sendMail({
            from: `"Azariah Management Group" <${smtpConfig.auth.user}>`,
            to: email,
            subject: "Inquiry Received - Azariah Management Group",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #111;">Inquiry Received</h2>
                <p>Hello <strong>${fullName}</strong>,</p>
                <p>Thank you for reaching out to <strong>Azariah Management Group</strong>. We have received your inquiry and our team will get back to you shortly.</p>
                <hr />
                <p><strong>Details provided:</strong></p>
                <p><strong>Organization:</strong> ${organization || "N/A"}</p>
                <p><strong>Message:</strong> ${details}</p>
                <hr />
                <p style="font-size: 12px; color: #777;">Best regards,<br />The AMG Team</p>
              </div>
            `,
          });

          await transporter.sendMail({
            from: `"AMG Inquiry System" <${smtpConfig.auth.user}>`,
            to: "info@azariahmg.com",
            subject: `New Strategic Inquiry: ${fullName}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #111;">New Strategic Inquiry</h2>
                <p><strong>From:</strong> ${fullName} (${email})</p>
                <p><strong>Organization:</strong> ${organization || "N/A"}</p>
                <p><strong>Details:</strong></p>
                <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${details}</p>
              </div>
            `,
          });

          return res.json({ success: true, message: "Inquiry sent successfully (via fallback)" });
        } catch (smtpError) {
          console.error("SMTP Fallback Error:", smtpError);
          return res.status(500).json({ error: "Failed to send email via both PHP and SMTP." });
        }
      }
      
      try {
        const jsonMatch = stdout.match(/\{.*\}/);
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { success: false };
        
        if (result.success) {
          res.json({ success: true, message: "Inquiry sent successfully via PHP" });
        } else {
          console.error("PHP Mailer Error:", result.error || "Unknown error");
          res.status(500).json({ error: result.error || "Failed to send email via PHP" });
        }
      } catch {
        console.error("PHP Output Parse Error:", stdout);
        res.status(500).json({ error: "Invalid response from mailer" });
      }
    });

    if (child.stdin) {
      child.stdin.write(payload);
      child.stdin.end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "dist" });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
