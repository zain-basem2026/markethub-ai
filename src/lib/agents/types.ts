import { z } from "zod";

// Base schemas
export const AgentInputSchema = z.object({
  campaignId: z.string().optional(),
});
export type AgentInput = z.infer<typeof AgentInputSchema>;

export interface AgentOutput<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  processingTimeMs: number;
}

// 1. Strategy Agent
export const StrategyInputSchema = AgentInputSchema.extend({
  targetAudience: z.string(),
  brandVoice: z.string().default("Professional"),
  budget: z.number().positive(),
  timeline: z.string().default("30 Days"),
  coreValues: z.array(z.string()).default([]),
  goals: z.array(z.string()).min(1),
  channels: z.array(z.string()).default(["SEO", "Social Media", "Email"]),
});
export type StrategyInput = z.infer<typeof StrategyInputSchema>;

// 2. Content Agent
export const ContentInputSchema = AgentInputSchema.extend({
  contentType: z.enum(["blog", "newsletter", "press_release", "case_study", "video_script"]),
  topic: z.string(),
  wordCount: z.number().int().positive().default(1000),
  keywords: z.array(z.string()).default([]),
  tone: z.string().default("Informative"),
});
export type ContentInput = z.infer<typeof ContentInputSchema>;

// 3. SEO Agent
export const SEOInputSchema = AgentInputSchema.extend({
  focusKeyword: z.string(),
  pageDescription: z.string(),
  competitorUrls: z.array(z.string().url()).default([]),
  searchIntent: z.enum(["informational", "transactional", "commercial", "navigational"]),
  targetCount: z.number().optional().default(1500),
});
export type SEOInput = z.infer<typeof SEOInputSchema>;

// 4. Social Agent
export const SocialInputSchema = AgentInputSchema.extend({
  platform: z.enum(["twitter", "linkedin", "instagram", "facebook", "tiktok"]),
  topic: z.string(),
  characterLimit: z.number().int().positive().default(280),
  callToAction: z.string().optional(),
  hashtagCount: z.number().int().min(0).default(3),
});
export type SocialInput = z.infer<typeof SocialInputSchema>;

// 5. Email Agent
export const EmailInputSchema = AgentInputSchema.extend({
  campaignType: z.enum(["welcome", "newsletter", "promo", "reengagement"]),
  subject: z.string(),
  mainOffer: z.string(),
  ctaLink: z.string().url().optional(),
  audienceSegment: z.string().default("all"),
});
export type EmailInput = z.infer<typeof EmailInputSchema>;

// 6. Ads Agent
export const AdsInputSchema = AgentInputSchema.extend({
  platform: z.enum(["google", "meta", "linkedin", "twitter"]),
  productName: z.string(),
  primarySellingPoint: z.string(),
  cta: z.string().default("Learn More"),
  adFormat: z.enum(["text", "image_post", "carousel", "video_ad"]).default("text"),
});
export type AdsInput = z.infer<typeof AdsInputSchema>;

// 7. Creative Agent
export const CreativeInputSchema = AgentInputSchema.extend({
  visualPrompt: z.string(),
  artDirection: z.string().default("Minimalist & Modern"),
  aspectRatio: z.enum(["1:1", "16:9", "4:3", "9:16"]).default("1:1"),
  colorPalette: z.array(z.string()).default(["#FFFFFF", "#000000"]),
  includeLogo: z.boolean().default(false),
});
export type CreativeInput = z.infer<typeof CreativeInputSchema>;

// 8. Analytics Agent
export const AnalyticsInputSchema = AgentInputSchema.extend({
  metrics: z.array(z.string()).min(1),
  durationDays: z.number().int().positive().default(30),
  trafficSources: z.array(z.string()).default(["Organic Search", "Direct"]),
  conversionGoal: z.string().default("signups"),
});
export type AnalyticsInput = z.infer<typeof AnalyticsInputSchema>;

// 9. Competitor Agent
export const CompetitorInputSchema = AgentInputSchema.extend({
  competitorNames: z.array(z.string()).min(1),
  industryCategory: z.string(),
  focusAreas: z.array(z.string()).default(["Pricing", "Product features", "Marketing"]),
  benchmarks: z.record(z.string(), z.any()).optional(),
});
export type CompetitorInput = z.infer<typeof CompetitorInputSchema>;

// 10. Lifecycle Agent
export const LifecycleInputSchema = AgentInputSchema.extend({
  funnelStage: z.enum(["TOFU", "MOFU", "BOFU"]),
  clvTarget: z.number().positive().optional(),
  churnRiskFactor: z.enum(["low", "medium", "high"]).default("low"),
  retentionFocus: z.string().default("onboarding"),
});
export type LifecycleInput = z.infer<typeof LifecycleInputSchema>;

// 11. Copywriting Agent
export const CopywritingInputSchema = AgentInputSchema.extend({
  framework: z.enum(["AIDA", "PAS", "BAB", "FAB"]),
  tone: z.string().default("Persuasive"),
  charLimit: z.number().optional(),
  problemStatement: z.string(),
  solutionDescription: z.string(),
});
export type CopywritingInput = z.infer<typeof CopywritingInputSchema>;

// 12. Research Agent
export const ResearchInputSchema = AgentInputSchema.extend({
  marketNiche: z.string(),
  geographicTarget: z.string().default("Global"),
  demographics: z.string().default("Adults 18-45"),
  keyCompetitors: z.array(z.string()).default([]),
});
export type ResearchInput = z.infer<typeof ResearchInputSchema>;
