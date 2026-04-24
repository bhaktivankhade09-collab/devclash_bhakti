import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = 3000;

// MongoDB Setup
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ [MongoDB] Connected successfully"))
    .catch((err) => {
      console.error("❌ [MongoDB] Connection error details:");
      console.error(err.message);
      if (err.message.includes('bad auth')) {
        console.error("👉 RECOMMENDATION: Verification of 'MONGODB_URI' credentials required. Please ensure the username and password in the connection string are correct and URL-encoded if they contain special characters.");
      }
    });
} else {
  console.warn("⚠️ [MongoDB] MONGODB_URI not found. Persistence will be disabled for this session.");
}

const projectSchema = new mongoose.Schema({
  appName: String,
  description: String,
  prompt: String,
  readme: String,
  blueprint: Object,
  files: {
    'index.html': String,
    'style.css': String,
    'script.js': String,
  },
  explanation: Object,
  improvementSummary: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/save", async (req, res) => {
  try {
    const { id, ...data } = req.body;
    let project;
    
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
    } else {
      project = new Project(data);
      await project.save();
    }
    
    res.json(project);
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save project" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Proxy for OpenAI if needed (Optional)
app.post("/api/openai", async (req, res) => {
  const { prompt, model } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({ error: "OpenAI API key not configured" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("OpenAI proxy error:", error);
    res.status(500).json({ error: "OpenAI call failed" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
