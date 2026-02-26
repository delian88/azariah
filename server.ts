import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // SMTP Configuration from User Request
  const smtpConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // false for 587
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

    try {
      // 1. Send confirmation email to the user
      await transporter.sendMail({
        from: `"Azariah Management Group" <${smtpConfig.auth.user}>`,
        to: email,
        subject: "Inquiry Received - Azariah Management Group",
        text: `Hello ${fullName},\n\nThank you for reaching out to Azariah Management Group. We have received your inquiry and our team will get back to you shortly.\n\nDetails provided:\nOrganization: ${organization || "N/A"}\nMessage: ${details}\n\nBest regards,\nThe AMG Team`,
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

      // 2. Send copy to info@azariahmg.com
      await transporter.sendMail({
        from: `"AMG Inquiry System" <${smtpConfig.auth.user}>`,
        to: "info@azariahmg.com",
        subject: `New Strategic Inquiry: ${fullName}`,
        text: `New inquiry received from ${fullName} (${email})\nOrganization: ${organization || "N/A"}\nDetails: ${details}`,
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

      res.json({ success: true, message: "Inquiry sent successfully" });
    } catch (error) {
      console.error("SMTP Error:", error);
      res.status(500).json({ error: "Failed to send email" });
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
