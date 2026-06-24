import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { runAgent, runAgentSequence, getAgentStatus, retryFailedJob } from "./src/lib/agents/orchestrator";
import { costTracker } from "./src/lib/openai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory counters to complement database logs
  const stats = {
    totalJobsTriggered: 0,
    completedJobs: 0,
    failedJobs: 0,
  };

  // API Routes
  app.post("/api/agents/run", async (req, res) => {
    try {
      const { agentType, input, organizationId } = req.body;
      if (!agentType || !input || !organizationId) {
        return res.status(400).json({ error: "Missing required fields (agentType, input, organizationId)" });
      }

      stats.totalJobsTriggered++;
      console.log(`[API] Triggering agent ${agentType} for Org ${organizationId}`);
      
      const result = await runAgent(agentType, input, organizationId);
      
      if (result.success) {
        stats.completedJobs++;
      } else {
        stats.failedJobs++;
      }

      res.json(result);
    } catch (error: any) {
      stats.failedJobs++;
      res.status(500).json({ error: error.message || "Failed to execute agent" });
    }
  });

  app.post("/api/agents/sequence", async (req, res) => {
    try {
      const { tasks, organizationId } = req.body;
      if (!tasks || !Array.isArray(tasks) || !organizationId) {
        return res.status(400).json({ error: "Missing required fields (tasks, organizationId)" });
      }

      stats.totalJobsTriggered += tasks.length;
      console.log(`[API] Triggering sequence of ${tasks.length} agents for Org ${organizationId}`);

      const results = await runAgentSequence(tasks, organizationId);
      
      Object.values(results).forEach((res) => {
        if (res.success) {
          stats.completedJobs++;
        } else {
          stats.failedJobs++;
        }
      });

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to execute sequence" });
    }
  });

  app.get("/api/agents/jobs/:id", async (req, res) => {
    try {
      const job = await getAgentStatus(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch job" });
    }
  });

  app.post("/api/agents/jobs/:id/retry", async (req, res) => {
    try {
      console.log(`[API] Retrying failed job ${req.params.id}`);
      const result = await retryFailedJob(req.params.id);
      if (result.success) {
        stats.completedJobs++;
        if (stats.failedJobs > 0) stats.failedJobs--;
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to retry job" });
    }
  });

  app.get("/api/metrics", (req, res) => {
    res.json({
      totalJobsTriggered: stats.totalJobsTriggered,
      completedJobs: stats.completedJobs,
      failedJobs: stats.failedJobs,
      promptTokens: costTracker.promptTokens,
      completionTokens: costTracker.completionTokens,
      totalTokens: costTracker.promptTokens + costTracker.completionTokens,
      totalCostUSD: costTracker.totalCostEstimateUSD,
    });
  });

  // Serve static assets in production, or mount Vite middleware in development
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
    console.log(`[Server] MarketHub AI running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
