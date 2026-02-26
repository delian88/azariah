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
      // We pass the data as a JSON string to the PHP script via CLI
      const payload = JSON.stringify({ fullName, email, organization, details });
      const phpScriptPath = path.join(process.cwd(), "mailer.php");
      
      // Escape the payload for shell execution
      const escapedPayload = payload.replace(/"/g, '\\"');
      
      exec(`php -r '$data = json_decode("${escapedPayload}", true); $_SERVER["REQUEST_METHOD"] = "POST"; $json = json_encode($data); include "${phpScriptPath}";'`, (error, stdout) => {
        if (error) {
          console.error("PHP Execution Error:", error);
          return res.status(500).json({ error: "Failed to process email via PHP" });
        }
        
        try {
          // The PHP script outputs JSON, but might have some headers/whitespace
          // We look for the JSON part in the output
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
