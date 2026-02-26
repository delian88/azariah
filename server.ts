import express from "express";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.post("/api/inquiry", async (req, res) => {
    const { fullName, email, organization, details } = req.body;

    if (!fullName || !email || !details) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Use PHP bridge for Namecheap server compatibility
      const payload = JSON.stringify({ fullName, email, organization, details });
      const phpScriptPath = path.join(process.cwd(), "mailer.php");
      
      const child = exec(`php "${phpScriptPath}"`, (error, stdout) => {
        if (error) {
          console.error("PHP Execution Error:", error);
          // If PHP is not available in this environment, it will fail here.
          // On Namecheap, it should work.
          return res.status(500).json({ error: "Failed to process email via PHP. Ensure PHP is installed." });
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

    } catch (error) {
      console.error("Bridge Error:", error);
      res.status(500).json({ error: "Internal server error" });
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
