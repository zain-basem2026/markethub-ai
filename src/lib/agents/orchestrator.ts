import { PrismaClient } from "@prisma/client";
import { generateCompletion } from "../openai";
import {
  AgentOutput,
  StrategyInputSchema,
  ContentInputSchema,
  SEOInputSchema,
  SocialInputSchema,
  EmailInputSchema,
  AdsInputSchema,
  CreativeInputSchema,
  AnalyticsInputSchema,
  CompetitorInputSchema,
  LifecycleInputSchema,
  CopywritingInputSchema,
  ResearchInputSchema,
} from "./types";

// Initialize Prisma client
export const prisma = new PrismaClient();

// In-memory fallback stores for local sandbox environments where database connection is not migrated
const mockJobs = new Map<string, any>();
const mockContent = new Map<string, any>();
const mockCampaigns = new Map<string, any>();

// Seed a default campaign to prevent referential integrity issues in local mock state
mockCampaigns.set("default-campaign-id", {
  id: "default-campaign-id",
  name: "Launch Campaign",
  description: "Product launch mock campaign for MarketHub AI",
  status: "active",
  organizationId: "org-default",
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Resilient DB Wrappers
async function safeCreateCampaign(campaignId: string, name: string, organizationId: string) {
  try {
    return await prisma.campaign.upsert({
      where: { id: campaignId },
      update: { name },
      create: { id: campaignId, name, organizationId },
    });
  } catch (err) {
    const campaign = { id: campaignId, name, description: "", status: "active", organizationId, createdAt: new Date(), updatedAt: new Date() };
    mockCampaigns.set(campaignId, campaign);
    return campaign;
  }
}

async function safeCreateJob(data: {
  organizationId: string;
  agentType: string;
  status: string;
  input: string;
  campaignId?: string;
}) {
  const jobId = `job_${Math.random().toString(36).substring(2, 11)}`;
  try {
    return await prisma.agentJob.create({
      data: {
        id: jobId,
        organizationId: data.organizationId,
        agentType: data.agentType,
        status: data.status,
        input: data.input,
        campaignId: data.campaignId || null,
      },
    });
  } catch (err) {
    const job = {
      id: jobId,
      organizationId: data.organizationId,
      agentType: data.agentType,
      status: data.status,
      input: data.input,
      output: null,
      error: null,
      campaignId: data.campaignId || null,
      createdAt: new Date(),
      completedAt: null,
    };
    mockJobs.set(jobId, job);
    return job;
  }
}

async function safeUpdateJob(jobId: string, updates: {
  status: string;
  output?: string;
  error?: string;
  completedAt?: Date;
}) {
  try {
    return await prisma.agentJob.update({
      where: { id: jobId },
      data: updates,
    });
  } catch (err) {
    const job = mockJobs.get(jobId);
    if (job) {
      const updated = { ...job, ...updates };
      mockJobs.set(jobId, updated);
      return updated;
    }
    return null;
  }
}

async function safeGetJob(jobId: string) {
  try {
    return await prisma.agentJob.findUnique({
      where: { id: jobId },
      include: { campaign: true },
    });
  } catch (err) {
    return mockJobs.get(jobId) || null;
  }
}

async function safeCreateContent(data: {
  organizationId: string;
  agentType: string;
  contentType: string;
  title: string;
  body: string;
  metadata?: string;
  status: string;
  campaignId?: string;
}) {
  const contentId = `content_${Math.random().toString(36).substring(2, 11)}`;
  try {
    return await prisma.generatedContent.create({
      data: {
        id: contentId,
        organizationId: data.organizationId,
        agentType: data.agentType,
        contentType: data.contentType,
        title: data.title,
        body: data.body,
        metadata: data.metadata || null,
        status: data.status,
        campaignId: data.campaignId || null,
      },
    });
  } catch (err) {
    const content = {
      id: contentId,
      ...data,
      metadata: data.metadata || null,
      campaignId: data.campaignId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockContent.set(contentId, content);
    return content;
  }
}

// Uniform agent execution result formatter
function formatAgentResult(result: any, startTime: number): AgentOutput {
  const duration = Date.now() - startTime;
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      processingTimeMs: duration,
    };
  }
  
  return {
    success: true,
    data: result.content,
    tokensUsed: {
      prompt: result.promptTokens,
      completion: result.completionTokens,
      total: result.promptTokens + result.completionTokens,
    },
    processingTimeMs: duration,
  };
}

// 1. Strategy Agent CMO
async function runStrategyAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = StrategyInputSchema.parse(input);
  
  const systemPrompt = "You are a professional Chief Marketing Officer (CMO) AI Agent. Your goal is to draft comprehensive, data-driven marketing strategies for organizations.";
  const userPrompt = `Develop a marketing strategy based on the following context:
- Target Audience: ${parsed.targetAudience}
- Brand Voice: ${parsed.brandVoice}
- Budget: $${parsed.budget}
- Timeline: ${parsed.timeline}
- Core Values: ${parsed.coreValues.join(", ") || "None"}
- Business Goals: ${parsed.goals.join(", ")}
- Distribution Channels: ${parsed.channels.join(", ")}

Provide a fully detailed output including: Executive Summary, Persona Breakdown, Channel-by-Channel Allocation Plan, Timeline & Milestone Schedule, and Key Performance Indicators (KPIs) tracker.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.5,
  });

  return formatAgentResult(result, startTime);
}

// 2. Content Agent
async function runContentAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = ContentInputSchema.parse(input);
  const systemPrompt = "You are an expert Content Marketer and copywriter AI Agent. You create high-value, highly engaging content layouts and draft articles.";
  const userPrompt = `Draft detailed content for:
- Content Type: ${parsed.contentType}
- Topic: ${parsed.topic}
- Target Word Count: ${parsed.wordCount}
- Keywords to include: ${parsed.keywords.join(", ") || "None"}
- Desired Tone: ${parsed.tone}

Provide a fully articulated copy, organized with markdown headers, including a catchy Title, an Introduction, detailed body sections incorporating keywords naturally, and a Call-To-Action (CTA).`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  return formatAgentResult(result, startTime);
}

// 3. SEO Agent
async function runSEOAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = SEOInputSchema.parse(input);
  const systemPrompt = "You are a professional SEO Specialist AI Agent. Your focus is optimizing content to rank number #1 on search engines.";
  const userPrompt = `Perform SEO analysis and optimization recommendation for:
- Focus Keyword: "${parsed.focusKeyword}"
- Page/Content Description: "${parsed.pageDescription}"
- Competitor Sites: ${parsed.competitorUrls.join(", ") || "None provided"}
- Search Intent Category: ${parsed.searchIntent}
- Target word count: ${parsed.targetCount}

Provide a complete SEO recommendation brief, including: SEO Title ideas, Meta Description draft, H1/H2/H3 header outlines, LSI/Semantic keyword suggestions, page-speed & technical checklist, and backlink/anchor text suggestions.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
  });

  return formatAgentResult(result, startTime);
}

// 4. Social Agent
async function runSocialAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = SocialInputSchema.parse(input);
  const systemPrompt = "You are a Viral Social Media Manager AI Agent. You specialize in driving high engagement, shares, and clicks across platforms.";
  const userPrompt = `Generate a social media post for:
- Platform: ${parsed.platform}
- Topic/Hook: ${parsed.topic}
- Character limit constraint: ${parsed.characterLimit}
- Call to Action: ${parsed.callToAction || "None specified"}
- Target hashtags count: ${parsed.hashtagCount}

Draft 3 distinct high-converting variations of the post (e.g., standard educational, provocative hook, conversational thread) optimized specifically for ${parsed.platform}'s algorithm.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  return formatAgentResult(result, startTime);
}

// 5. Email Agent
async function runEmailAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = EmailInputSchema.parse(input);
  const systemPrompt = "You are an Email Deliverability and Conversion Optimization expert AI Agent. You create high-converting email copy.";
  const userPrompt = `Generate an email campaign:
- Campaign Type: ${parsed.campaignType}
- Target Subject Idea: "${parsed.subject}"
- Main Offer / Promo: "${parsed.mainOffer}"
- Call to Action Link: ${parsed.ctaLink || "None"}
- Audience Segment: ${parsed.audienceSegment}

Provide a complete email design document including: 3 Subject Line alternatives, Preheader text, Body Copy formatted with placeholders (e.g., [First Name]), primary CTA button styling, and post-send analytics guidelines.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  return formatAgentResult(result, startTime);
}

// 6. Ads Agent
async function runAdsAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = AdsInputSchema.parse(input);
  const systemPrompt = "You are a Paid Acquisition Specialist and Copywriter AI Agent. You generate high CTR ad scripts and copy.";
  const userPrompt = `Generate ad copy specs for:
- Target Platform: ${parsed.platform}
- Product/Service: ${parsed.productName}
- Unique Selling Point: "${parsed.primarySellingPoint}"
- Call to Action: "${parsed.cta}"
- Format Type: ${parsed.adFormat}

Provide: 3 Headline variations, 3 Primary text variants, description fields (if applicable), and clear visual recommendations for ad creative design.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  return formatAgentResult(result, startTime);
}

// 7. Creative Agent
async function runCreativeAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = CreativeInputSchema.parse(input);
  const systemPrompt = "You are an AI Creative Director and Visual Strategist Agent. You translate marketing topics into beautiful visual concepts and image generation prompts.";
  const userPrompt = `Draft an artistic brief and image generator prompts:
- Core Visual Concept/Theme: "${parsed.visualPrompt}"
- Art Direction style: ${parsed.artDirection}
- Layout Aspect Ratio: ${parsed.aspectRatio}
- Color Palette: ${parsed.colorPalette.join(", ")}
- Include Brand Logo: ${parsed.includeLogo ? "Yes" : "No"}

Provide: A detailed Art Direction narrative, 3 high-quality, highly descriptive image generator prompts (optimized for DALL-E 3 or Midjourney), typography pairing suggestions, and styling moods.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  return formatAgentResult(result, startTime);
}

// 8. Analytics Agent
async function runAnalyticsAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = AnalyticsInputSchema.parse(input);
  const systemPrompt = "You are a Senior Web Analytics and Business Intelligence AI Agent. You identify drop-off bottlenecks and marketing ROI optimizations.";
  const userPrompt = `Analyze marketing performance parameters:
- Metrics to assess: ${parsed.metrics.join(", ")}
- Duration of report: ${parsed.durationDays} Days
- Main Traffic Sources: ${parsed.trafficSources.join(", ")}
- Target Conversion Goal: ${parsed.conversionGoal}

Provide: A comprehensive analytics insights report, including: Funnel Leak identification, Traffic Source Quality evaluation, ROI projection, and 3 specific actionable Recommendations to improve conversions.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
  });

  return formatAgentResult(result, startTime);
}

// 9. Competitor Agent
async function runCompetitorAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = CompetitorInputSchema.parse(input);
  const systemPrompt = "You are a Competitive Intelligence and Market Analyst AI Agent. You evaluate opponent strategies and locate market gaps.";
  const userPrompt = `Perform competitor benchmarking:
- Competitor Brands: ${parsed.competitorNames.join(", ")}
- Industry Category: ${parsed.industryCategory}
- Focus Evaluation Areas: ${parsed.focusAreas.join(", ")}
- Custom Benchmark Context: ${parsed.benchmarks ? JSON.stringify(parsed.benchmarks) : "Standard metrics"}

Provide a comprehensive Competitive Intel Report, including: Competitor Positioning Matrix, Core Strengths & Weaknesses (SWOT) per competitor, Pricing & Feature Parity Analysis, and 3 tactics to out-position them.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
  });

  return formatAgentResult(result, startTime);
}

// 10. Lifecycle Agent
async function runLifecycleAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = LifecycleInputSchema.parse(input);
  const systemPrompt = "You are a Customer Success and Customer Lifecycle Marketing AI Agent. Your focus is user activation, retention, and LTV amplification.";
  const userPrompt = `Perform customer journey evaluation:
- Target Funnel Stage: ${parsed.funnelStage}
- Target Customer Lifetime Value (CLV): ${parsed.clvTarget ? `$${parsed.clvTarget}` : "Standard"}
- Churn Risk Category: ${parsed.churnRiskFactor}
- Retention Focus Theme: ${parsed.retentionFocus}

Provide: A detailed Customer Lifecycle Blueprint, including: Funnel Obstacle mapping, User Activation/Onboarding step recommendations, Churn Prevention action items, and Loyalty/Referral program expansion ideas.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
  });

  return formatAgentResult(result, startTime);
}

// 11. Copywriting Agent
async function runCopywritingAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = CopywritingInputSchema.parse(input);
  const systemPrompt = "You are a professional Copywriting Master AI Agent. You draft persuasive, high-conversion landing page and promotional content.";
  const userPrompt = `Draft direct-response marketing copy:
- Target Framework: ${parsed.framework}
- Copywriting Tone: ${parsed.tone}
- Main Problem Statement: "${parsed.problemStatement}"
- Solution / Offer Description: "${parsed.solutionDescription}"
- Length limit: ${parsed.charLimit ? `${parsed.charLimit} characters` : "None"}

Provide copy strictly structured using the requested framework:
- If AIDA: Attention, Interest, Desire, Action sections
- If PAS: Problem, Agitate, Solve sections
- If BAB: Before, After, Bridge sections
- If FAB: Features, Advantages, Benefits sections`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  return formatAgentResult(result, startTime);
}

// 12. Research Agent
async function runResearchAgent(input: any, organizationId: string): Promise<AgentOutput> {
  const startTime = Date.now();
  const parsed = ResearchInputSchema.parse(input);
  const systemPrompt = "You are a Market Research and Customer Insights AI Agent. You search for customer pain points, search queries, and general demographic data.";
  const userPrompt = `Perform market and audience research:
- Target Niche: "${parsed.marketNiche}"
- Geographic Scope: "${parsed.geographicTarget}"
- Demographics Target: "${parsed.demographics}"
- Key Competitors to benchmark: ${parsed.keyCompetitors.join(", ") || "None"}

Provide a rich Market Research Dossier, including: Core Audience Pain Points, Top 5 Burning Questions they ask, Search Intent Trends, Demographic behavioral patterns, and market entry recommendations.`;

  const result = await generateCompletion({
    organizationId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
  });

  return formatAgentResult(result, startTime);
}

// Agent registry mapping types to execution functions
export const agentRegistry: Record<string, (input: any, orgId: string) => Promise<AgentOutput>> = {
  strategy: runStrategyAgent,
  content: runContentAgent,
  seo: runSEOAgent,
  social: runSocialAgent,
  email: runEmailAgent,
  ads: runAdsAgent,
  creative: runCreativeAgent,
  analytics: runAnalyticsAgent,
  competitor: runCompetitorAgent,
  lifecycle: runLifecycleAgent,
  copywriting: runCopywritingAgent,
  research: runResearchAgent,
};

/**
 * Runs a specified AI Marketing agent by registered type, logs the job in PostgreSQL (with robust mock state fallback),
 * and creates GeneratedContent records for user-facing outputs.
 */
export async function runAgent(
  agentType: string,
  input: any,
  organizationId: string
): Promise<AgentOutput> {
  const lowercaseType = agentType.toLowerCase();
  const executor = agentRegistry[lowercaseType];
  
  if (!executor) {
    return {
      success: false,
      error: `Agent of type '${agentType}' is not registered. Available agents: ${Object.keys(agentRegistry).join(", ")}`,
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      processingTimeMs: 0,
    };
  }

  // Auto-upsert target campaign if passed to avoid referential integrity constraints
  const campaignId = input.campaignId || null;
  if (campaignId) {
    await safeCreateCampaign(campaignId, `Campaign ${campaignId}`, organizationId);
  }

  // 1. Create agent job with pending state
  const job = await safeCreateJob({
    organizationId,
    agentType: lowercaseType,
    status: "pending",
    input: JSON.stringify(input),
    campaignId: campaignId || undefined,
  });

  try {
    // 2. Execute agent
    const result = await executor(input, organizationId);

    if (result.success) {
      // 3a. Update job to completed
      await safeUpdateJob(job.id, {
        status: "completed",
        output: JSON.stringify(result.data),
        completedAt: new Date(),
      });

      // 3b. Save GeneratedContent if the agent generated content
      const contentAgentTypes = ["content", "email", "copywriting", "ads", "social"];
      if (contentAgentTypes.includes(lowercaseType) && result.data) {
        let title = `${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Generated Output`;
        const firstLine = String(result.data).split("\n").find(line => line.startsWith("#") || line.toLowerCase().includes("title:"));
        if (firstLine) {
          title = firstLine.replace(/^#+\s*/, "").replace(/title:\s*/i, "").trim();
        }
        
        await safeCreateContent({
          organizationId,
          agentType: lowercaseType,
          contentType: lowercaseType,
          title: title.slice(0, 100),
          body: String(result.data),
          metadata: JSON.stringify({ tokensUsed: result.tokensUsed }),
          status: "draft",
          campaignId: campaignId || undefined,
        });
      }
    } else {
      // 4. Update job to failed
      await safeUpdateJob(job.id, {
        status: "failed",
        error: result.error || "Unknown agent execution failure",
        completedAt: new Date(),
      });
    }

    return result;
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    await safeUpdateJob(job.id, {
      status: "failed",
      error: errorMsg,
      completedAt: new Date(),
    });

    return {
      success: false,
      error: `Agent run crashed: ${errorMsg}`,
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      processingTimeMs: 0,
    };
  }
}

interface AgentTask {
  agentType: string;
  input: any;
}

/**
 * Runs a sequence of agents in parallel and collects their respective inputs and outputs.
 */
export async function runAgentSequence(
  tasks: AgentTask[],
  organizationId: string
): Promise<Record<string, AgentOutput>> {
  const results: Record<string, AgentOutput> = {};

  const promises = tasks.map(async (task) => {
    try {
      const res = await runAgent(task.agentType, task.input, organizationId);
      results[task.agentType] = res;
    } catch (err: any) {
      results[task.agentType] = {
        success: false,
        error: err.message || String(err),
        tokensUsed: { prompt: 0, completion: 0, total: 0 },
        processingTimeMs: 0,
      };
    }
  });

  await Promise.all(promises);
  return results;
}

/**
 * Retrieves the current execution status and payload of a logged job.
 */
export async function getAgentStatus(jobId: string) {
  return await safeGetJob(jobId);
}

/**
 * Retrieves the list of recent agent jobs, sorted by creation date.
 */
export async function getAgentJobsList(limit: number = 20) {
  try {
    const dbJobs = await prisma.agentJob.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { campaign: true },
    });
    return dbJobs;
  } catch (err) {
    return Array.from(mockJobs.values())
      .sort((a, b) => {
        const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return timeB - timeA;
      })
      .slice(0, limit);
  }
}

/**
 * Retries a failed job by resetting its status and invoking the corresponding agent execution block once more.
 */
export async function retryFailedJob(jobId: string): Promise<AgentOutput> {
  const originalJob = await safeGetJob(jobId);
  if (!originalJob) {
    throw new Error(`Job with ID ${jobId} not found`);
  }

  if (originalJob.status !== "failed") {
    throw new Error(`Job with ID ${jobId} is not in a failed state (current: ${originalJob.status})`);
  }

  // Parse input from previous run
  let input: any;
  try {
    input = JSON.parse(originalJob.input);
  } catch (err) {
    input = originalJob.input;
  }

  // Reset status to pending
  await safeUpdateJob(jobId, {
    status: "pending",
    error: undefined,
  });

  const lowercaseType = originalJob.agentType.toLowerCase();
  const executor = agentRegistry[lowercaseType];
  const startTime = Date.now();

  if (!executor) {
    const errResult = {
      success: false,
      error: `Agent of type '${originalJob.agentType}' is not registered`,
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      processingTimeMs: 0,
    };
    await safeUpdateJob(jobId, {
      status: "failed",
      error: errResult.error,
      completedAt: new Date(),
    });
    return errResult;
  }

  try {
    const result = await executor(input, originalJob.organizationId);

    if (result.success) {
      await safeUpdateJob(jobId, {
        status: "completed",
        output: JSON.stringify(result.data),
        completedAt: new Date(),
      });
    } else {
      await safeUpdateJob(jobId, {
        status: "failed",
        error: result.error || "Retry failed",
        completedAt: new Date(),
      });
    }

    return result;
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    await safeUpdateJob(jobId, {
      status: "failed",
      error: errorMsg,
      completedAt: new Date(),
    });

    return {
      success: false,
      error: `Retry crashed: ${errorMsg}`,
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      processingTimeMs: 0,
    };
  }
}
