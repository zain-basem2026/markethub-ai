import express from "express";
import dotenv from "dotenv";
import { runAgent, runAgentSequence, getAgentStatus, retryFailedJob, getAgentJobsList } from "../src/lib/agents/orchestrator";
import { costTracker } from "../src/lib/openai";

dotenv.config();

const app = express();
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

app.get("/api/agents/jobs", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const jobs = await getAgentJobsList(limit);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch jobs list" });
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

export default app;
