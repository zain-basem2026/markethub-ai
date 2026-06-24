import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Brain,
  FileText,
  Search,
  Share2,
  Mail,
  Award,
  Compass,
  BarChart3,
  Users,
  RotateCcw,
  Zap,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Landmark,
  Coins,
  Cpu,
  RefreshCw,
  Plus,
  Trash2,
  ChevronRight,
  Database,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";

// Register metadata for the 12 specialized marketing agents
const AGENT_CATALOG = [
  {
    id: "strategy",
    name: "Strategy CMO Agent",
    description: "Formulates comprehensive high-level marketing strategies, target audience personas, and milestone timelines.",
    icon: Brain,
    type: "creative",
    defaultInput: {
      targetAudience: "Tech-savvy remote professionals and managers aged 25-45",
      brandVoice: "Empathetic, clear, professional, and productivity-focused",
      budget: 5000,
      timeline: "30 Days",
      coreValues: ["Transparency", "Focus", "Well-being"],
      goals: ["Boost newsletter signups by 30%", "Establish thought-leadership on LinkedIn"],
      channels: ["LinkedIn Organic", "Email Newsletter", "SEO Search Blog"],
    }
  },
  {
    id: "content",
    name: "Content Marketer Agent",
    description: "Drafts comprehensive blog articles, newsletter blueprints, case studies, and engaging video scripts.",
    icon: FileText,
    type: "creative",
    defaultInput: {
      contentType: "blog",
      topic: "How Deep Work Habits Outperform Standard 8-Hour Workdays in a Remote Setup",
      wordCount: 1000,
      keywords: ["deep work", "remote productivity", "cognitive strain", "time block"],
      tone: "Empathetic and Informative",
    }
  },
  {
    id: "seo",
    name: "SEO Specialist Agent",
    description: "Evaluates keyword competitiveness, outlines structured H1/H2 header recommendations, and drafts meta copies.",
    icon: Search,
    type: "analytics",
    defaultInput: {
      focusKeyword: "best remote focus methods",
      pageDescription: "A comprehensive guide analyzing deep focus protocols, time-blocking mechanisms, and ergonomic workspace items for distributed workers.",
      competitorUrls: ["https://competitor1.com/productivity", "https://competitor2.com/focus-guide"],
      searchIntent: "informational",
      targetCount: 1500,
    }
  },
  {
    id: "social",
    name: "Viral Social Agent",
    description: "Writes viral hooks, character-optimized social copies, and algorithm-friendly hashtag packages.",
    icon: Share2,
    type: "creative",
    defaultInput: {
      platform: "linkedin",
      topic: "The physical and mental toll of back-to-back Zoom meetings and the 5-minute transition cure",
      characterLimit: 400,
      callToAction: "Get our free 'No-Meeting Wednesday' calendar template",
      hashtagCount: 3,
    }
  },
  {
    id: "email",
    name: "Email Coordinator Agent",
    description: "Designs conversion-friendly onboarding templates, welcome cycles, newsletters, and promo copy.",
    icon: Mail,
    type: "creative",
    defaultInput: {
      campaignType: "welcome",
      subject: "Welcome to MarketHub AI: Your 12 CMO agents are ready to work!",
      mainOffer: "Enjoy 25% off our Team tier by registering today with code CMO25.",
      ctaLink: "https://markethub.ai/checkout?code=CMO25",
      audienceSegment: "trial_signup",
    }
  },
  {
    id: "ads",
    name: "PPC Ads Copywriter Agent",
    description: "Generates high-CTR primary ad copies, headlines, and calls to action optimized for Google or Meta Ads.",
    icon: Award,
    type: "creative",
    defaultInput: {
      platform: "meta",
      productName: "MarketHub Multi-Agent platform",
      primarySellingPoint: "Fire up 12 AI marketing agents in parallel to handle everything from strategy to copywriting in seconds.",
      cta: "Try Free Today",
      adFormat: "image_post",
    }
  },
  {
    id: "creative",
    name: "AI Creative Director Agent",
    description: "Translates marketing concepts into stunning art descriptions and descriptive prompt hooks for AI image generators.",
    icon: Compass,
    type: "creative",
    defaultInput: {
      visualPrompt: "A sleek workspace under a warm desk lamp with a digital calendar showing clean blocked slots, modern and highly cinematic",
      artDirection: "Minimalist Cinematic Cyber-Noir",
      aspectRatio: "16:9",
      colorPalette: ["#0B0F19", "#4F46E5", "#10B981"],
      includeLogo: false,
    }
  },
  {
    id: "analytics",
    name: "Web Analytics Agent",
    description: "Reviews visitor funnels, flags user conversion leaks, and recommends actionable ROI improvements.",
    icon: BarChart3,
    type: "analytics",
    defaultInput: {
      metrics: ["Conversion Rate", "Checkout Abandonment Rate", "Average Order Value", "LTV"],
      durationDays: 30,
      trafficSources: ["Google Ads", "Organic SEO", "Partner Referrals"],
      conversionGoal: "team_tier_upgrade",
    }
  },
  {
    id: "competitor",
    name: "Competitor Intel Agent",
    description: "Drafts comprehensive positioning grids, SWOT reports, and feature benchmarking matrices.",
    icon: Users,
    type: "analytics",
    defaultInput: {
      competitorNames: ["AutoMarketer.io", "SaaSGrowth AI", "CopyBots Ltd"],
      industryCategory: "AI Growth & Marketing Software",
      focusAreas: ["Pricing parity", "Supported channels", "Team collaboration workflows"],
    }
  },
  {
    id: "lifecycle",
    name: "Lifecycle Journey Agent",
    description: "Designs customer reactivation sequences, onboarding funnels, and CLV retention maps.",
    icon: RotateCcw,
    type: "analytics",
    defaultInput: {
      funnelStage: "MOFU",
      clvTarget: 500,
      churnRiskFactor: "medium",
      retentionFocus: "interactive tutorials and feature milestone congratulations",
    }
  },
  {
    id: "copywriting",
    name: "Copywriting Master Agent",
    description: "Constructs direct-response copy structured cleanly under target frameworks like AIDA or PAS.",
    icon: Zap,
    type: "creative",
    defaultInput: {
      framework: "AIDA",
      tone: "Persuasive and Direct",
      problemStatement: "Digital marketers suffer immense fatigue coordinating campaigns across disconnected software platforms.",
      solutionDescription: "MarketHub AI aggregates the knowledge of 12 hyper-specialized agents into a single unified workspace to design, write, and audit campaigns on autopilot.",
    }
  },
  {
    id: "research",
    name: "Market Research Agent",
    description: "Discovers target audience pain points, primary burning questions, and search intent trends.",
    icon: Search,
    type: "analytics",
    defaultInput: {
      marketNiche: "B2B AI team collaboration platforms",
      geographicTarget: "Global remote-heavy hubs",
      demographics: "Operations directors and agency founders aged 30-55",
      keyCompetitors: ["Slack", "ClickUp", "Notion"],
    }
  },
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "MarketHub",
    subtitle: "Multi-Agent Orchestrator v1.0.4",
    activeOrchestrator: "Orchestrator Active",
    estSpend: "Est. Spend",
    totalConsumption: "Total Consumption",
    efficiencyIndex: "Efficiency Index",
    tokens: "tokens",
    runs: "runs",
    singleExpertWorkspace: "Single-Agent Delegate",
    jointCampaignPipeline: "Sequential Pipeline Builder",
    jobActivityLogs: "Job Activity Logs",
    coreModel: "Core Model",
    specialtyAgents: "12 Specialty Marketing Agents",
    inputSpecs: "Input Specs",
    temp: "Temp",
    delegateTo: "Delegate to",
    executePipeline: "Execute Campaign Pipeline",
    pipelineConfig: "Pipeline Node Sequence Configuration",
    pipelinePredefined: "Pipeline nodes will use predefined expert contextual parameters automatically mapped for campaign efficiency.",
    sequenceActive: "Orchestrator Sequence in Progress",
    sequenceDesc: "Executing parallel tasks across 12 AI Agent models on the core engine. This process logs jobs and populates campaign content templates.",
    nodeOutput: "Node Output",
    copyText: "Copy Text",
    copied: "Copied!",
    execDuration: "Execution duration",
    tokensUsed: "Tokens used",
    total: "Total",
    prompt: "Prompt",
    completion: "Completion",
    errorHeader: "Agent Execution Error",
    errorDetails: "Please check inputs and connection status.",
    jointProtocol: "Multi-Agent Joint Sequence Protocol",
    jointDesc: "Design a serial-parallel campaign workflow. Output from one node can guide contextual generation of subsequent nodes.",
    appendNode: "+ Append Node",
    prismaLogs: "Prisma AgentJob Database Log Stream",
    retryRun: "Retry Run",
    dbConnected: "DB: Postgres (Connected)",
    jwt: "JWT: RSA-256",
    loc: "LOC: 4,120",
    stableVersion: "v1.2.0-stable",
    nodeVersion: "Node: 20.x",
    memory: "Memory",
    initializing: "Initializing AI Marketing Node...",
    validating: "Validating parameters against schema for",
    dbRecordInserted: "Database AgentJob record inserted (status: pending)...",
    securingConnection: "Securing connection proxy to LLM gateway...",
    feedingParams: "Feeding contextual parameters to 'gpt-4o-mini'...",
    analyzingTarget: "Analyzing target voice guidelines & keyword relevance...",
    streamingOutput: "Streaming output chunks and structuring response templates...",
    completedSuccessfully: "✔ AI Generation completed successfully!",
    accumulatedPrompt: "Accumulated prompt & completion tokens logged",
    prismaSaved: "Prisma GeneratedContent artifact saved as draft.",
    failedTitle: "❌ Generation Failed",
    runningLogs: "Orchestrator Sequence in Progress",
  },
  ar: {
    title: "ماركت هوب",
    subtitle: "منسق الوكلاء المتعددين v1.0.4",
    activeOrchestrator: "المنسق نشط",
    estSpend: "الإنفاق المقدر",
    totalConsumption: "إجمالي الاستهلاك",
    efficiencyIndex: "مؤشر الكفاءة",
    tokens: "رمزاً",
    runs: "تشغيلات",
    singleExpertWorkspace: "مساحة عمل الوكيل الفردي",
    jointCampaignPipeline: "مخطط العمليات المتسلسل",
    jobActivityLogs: "سجل العمليات والأنشطة",
    coreModel: "النموذج الأساسي",
    specialtyAgents: "١٢ وكيل تسويق متخصص",
    inputSpecs: "مواصفات مدخلات",
    temp: "الحرارة",
    delegateTo: "تفويض المهمة إلى",
    executePipeline: "تنفيذ خط الحملة المشترك",
    pipelineConfig: "إعداد تسلسل العقد للخط",
    pipelinePredefined: "ستستخدم عقد الخط معايير سياقية مسبقة التحديد تم تخطيطها تلقائيًا لرفع كفاءة الحملة.",
    sequenceActive: "سلسلة التنسيق قيد التنفيذ الآن",
    sequenceDesc: "جاري تنفيذ المهام المتوازية عبر ١٢ نموذج عميل ذكاء اصطناعي في المحرك الأساسي. تقوم هذه العملية بتسجيل الوظائف وتعبئة قوالب محتوى الحملة.",
    nodeOutput: "مخرجات العقدة",
    copyText: "نسخ النص",
    copied: "تم النسخ!",
    execDuration: "مدة التنفيذ",
    tokensUsed: "الرموز المستخدمة",
    total: "الإجمالي",
    prompt: "المدخلات (Prompt)",
    completion: "المخرجات (Completion)",
    errorHeader: "خطأ في تنفيذ الوكيل",
    errorDetails: "يرجى التحقق من المدخلات وحالة الاتصال.",
    jointProtocol: "بروتوكول التسلسل المشترك لعملاء متعددين",
    jointDesc: "صمم مسار عمل متسلسل للحملة التسويقية. يمكن لمخرجات إحدى العقد أن توجه الجيل السياقي للعقد التالية تلقائيًا.",
    appendNode: "+ إضافة عقدة",
    prismaLogs: "بث سجل قاعدة بيانات وظائف الوكلاء (Prisma)",
    retryRun: "إعادة التشغيل",
    dbConnected: "قاعدة البيانات: Postgres (متصل)",
    jwt: "التشفير: RSA-256",
    loc: "أسطر الكود: 4,120",
    stableVersion: "v1.2.0-مستقر",
    nodeVersion: "نود: 20.x",
    memory: "الذاكرة",
    initializing: "جاري تهيئة عقدة التسويق الذكي...",
    validating: "التحقق من صحة المعلمات والمواصفات لوكيل",
    dbRecordInserted: "تم إدراج سجل وظيفة الوكيل في قاعدة البيانات (الحالة: معلق)...",
    securingConnection: "تأمين اتصال الوكيل ببوابة نموذج الذكاء الاصطناعي...",
    feedingParams: "تغذية المعلمات السياقية إلى نموذج 'gpt-4o-mini'...",
    analyzingTarget: "تحليل إرشادات نبرة الصوت المستهدفة وملاءمة الكلمات المفتاحية...",
    streamingOutput: "بث مخرجات المحتوى وهيكلة قوالب الاستجابة المحددة...",
    completedSuccessfully: "✔ اكتمل توليد الذكاء الاصطناعي بنجاح!",
    accumulatedPrompt: "تم تسجيل استهلاك الرموز للمدخلات والمخرجات",
    prismaSaved: "تم حفظ عنصر المحتوى المولد كمسودة في قاعدة البيانات.",
    failedTitle: "❌ فشل التوليد",
    runningLogs: "سلسلة التنسيق قيد التنفيذ الآن",
  }
};

const getAgentName = (id: string, lang: "en" | "ar"): string => {
  const arNames: Record<string, string> = {
    strategy: "استراتيجية التسويق (CMO)",
    content: "تسويق المحتوى",
    seo: "متخصص سيو (SEO)",
    social: "انتشار وسائل التواصل",
    email: "تنسيق البريد الإلكتروني",
    ads: "كتابة إعلانات الدفع بالنقرة (PPC)",
    creative: "المدير الإبداعي للذكاء الاصطناعي",
    analytics: "تحليلات الويب",
    competitor: "استخبارات المنافسين",
    lifecycle: "رحلة حياة العميل",
    copywriting: "احتراف كتابة الإعلانات",
    research: "أبحاث السوق"
  };
  const defaultAgent = AGENT_CATALOG.find(a => a.id === id);
  if (lang === "ar") {
    return arNames[id] || defaultAgent?.name || id;
  }
  return defaultAgent?.name || id;
};

const getAgentDesc = (id: string, lang: "en" | "ar"): string => {
  const arDescs: Record<string, string> = {
    strategy: "يصيغ استراتيجيات تسويقية شاملة رفيعة المستوى، ويحدد شخصيات الجمهور المستهدف، والخطوط الزمنية للمراحل الرئيسية.",
    content: "يكتب مقالات مدونات شاملة، مخططات نشرات بريدية، دراسات حالة، وسيناريوهات فيديو جذابة.",
    seo: "يحلل تنافسية الكلمات المفتاحية، ويضع توصيات لهيكلة العناوين H1/H2، ويكتب وصف الميتا الصفحة.",
    social: "يكتب خطافات فيروسية، ومنشورات اجتماعية محسنة لعدد الأحرف، وحزم وسوم مناسبة للخوارزميات.",
    email: "يصمم قوالب تهيئة سهلة للتحويل، دورات ترحيبية، نشرات إخبارية، ونسخاً ترويجية.",
    ads: "ينشئ نصوص إعلانات رئيسية ذات نسبة نقر عالية (CTR)، وعناوين رئيسية، ودعوات لاتخاذ إجراء محسنة لإعلانات جوجل وميتا.",
    creative: "يترجم المفاهيم التسويقية إلى أوصاف فنية مذهلة وخطافات موجهة لمولدي الصور بالذكاء الاصطناعي.",
    analytics: "يراجع مسارات الزوار، ويحدد ثغرات تحويل المستخدمين، ويوصي بتحسينات قابلة للتنفيذ لعائد الاستثمار (ROI).",
    competitor: "يضع مخططات التموضع الشاملة، وتقارير SWOT، ومصفوفات مقارنة الميزات التنافسية.",
    lifecycle: "يصمم سلاسل إعادة تنشيط العملاء، مسارات تهيئة المستخدمين، وخرائط الاحتفاظ لزيادة القيمة الدائمة للعميل.",
    copywriting: "يبني نصوص استجابة مباشرة منظمة بنقاء تحت أطر العمل المستهدفة مثل AIDA أو PAS.",
    research: "يكتشف نقاط الألم لدى الجمهور المستهدف، الأسئلة الملحة الأساسية، واتجاهات نية البحث الأسبوعية."
  };
  const defaultAgent = AGENT_CATALOG.find(a => a.id === id);
  if (lang === "ar") {
    return arDescs[id] || defaultAgent?.description || "";
  }
  return defaultAgent?.description || "";
};

const getLabelTranslation = (key: string, lang: "en" | "ar"): string => {
  if (lang === "en") {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  }
  const translations: Record<string, string> = {
    targetAudience: "الجمهور المستهدف",
    brandVoice: "نبرة صوت العلامة التجارية",
    budget: "الميزانية الكلية ($)",
    timeline: "الجدول الزمني للحملة",
    coreValues: "القيم الأساسية",
    goals: "الأهداف التسويقية",
    channels: "القنوات المحددة",
    contentType: "نوع المحتوى",
    topic: "موضوع المحتوى",
    wordCount: "عدد الكلمات المستهدف",
    keywords: "الكلمات المفتاحية المستهدفة",
    tone: "النبرة والأسلوب",
    focusKeyword: "الكلمة المفتاحية البؤرية",
    pageDescription: "وصف الصفحة الموصى به",
    competitorUrls: "عناوين مواقع المنافسين",
    searchIntent: "نية البحث المقصودة",
    targetCount: "العدد المستهدف",
    platform: "منصة النشر",
    characterLimit: "الحد الأقصى للأحرف",
    callToAction: "دعوة لاتخاذ إجراء (CTA)",
    hashtagCount: "عدد الهاشتاجات",
    campaignType: "نوع حملة البريد",
    subject: "عنوان الرسالة",
    mainOffer: "العرض الأساسي",
    ctaLink: "رابط زر التحويل",
    audienceSegment: "شريحة الجمهور",
    productName: "اسم المنتج",
    primarySellingPoint: "نقطة البيع الأساسية",
    cta: "نص الدعوة لاتخاذ إجراء",
    adFormat: "شكل الإعلان",
    visualPrompt: "التوجيه البصري الفني",
    artDirection: "الاتجاه الفني والأسلوب",
    aspectRatio: "نسبة العرض إلى الارتفاع",
    colorPalette: "لوحة الألوان المفضلة",
    includeLogo: "تضمين الشعار الفني",
    metrics: "المقاييس الأساسية للمراجعة",
    durationDays: "المدة بالأيام",
    trafficSources: "مصادر الزوار والقنوات",
    conversionGoal: "هدف التحويل المطلوب",
    competitorNames: "أسماء المنافسين للمقارنة",
    industryCategory: "فئة الصناعة والمجال",
    focusAreas: "مجالات التركيز الرئيسية",
    funnelStage: "مرحلة مسار المبيعات",
    clvTarget: "القيمة المستهدفة للعميل (CLV)",
    churnRiskFactor: "عامل خطر إلغاء الاشتراك",
    retentionFocus: "تركيز استراتيجية الاحتفاظ بالعميل",
    framework: "إطار عمل كتابة الإعلانات",
    problemStatement: "بيان المشكلة الحقيقية",
    solutionDescription: "وصف الحل المقترح",
    marketNiche: "تخصص ومجال السوق",
    geographicTarget: "النطاق الجغرافي المستهدف",
    demographics: "التركيبة الديموغرافية للجمهور",
    keyCompetitors: "المنافسون الرئيسيون"
  };
  return translations[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
};

const getStatusTranslation = (status: string, lang: "en" | "ar"): string => {
  if (lang === "en") return status;
  const trans: Record<string, string> = {
    completed: "مكتمل",
    failed: "فشل",
    pending: "قيد الانتظار"
  };
  return trans[status] || status;
};

export default function App() {
  const [lang, setLang] = useState<"en" | "ar">(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved === "en" || saved === "ar") ? saved : "ar";
  });

  const handleSetLang = (newLang: "en" | "ar") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const [activeTab, setActiveTab] = useState<"single" | "pipeline" | "history">("single");
  const [selectedAgentId, setSelectedAgentId] = useState("strategy");
  
  // Single Agent state
  const [formInputs, setFormInputs] = useState<any>({});
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [agentOutput, setAgentOutput] = useState<any>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  
  // Pipeline State
  const [pipelineTasks, setPipelineTasks] = useState<string[]>(["strategy", "seo", "content"]);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineOutputs, setPipelineOutputs] = useState<Record<string, any>>({});
  const [selectedPipelineResultTab, setSelectedPipelineResultTab] = useState<string>("");

  // System Metrics
  const [metrics, setMetrics] = useState({
    totalJobsTriggered: 0,
    completedJobs: 0,
    failedJobs: 0,
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    totalCostUSD: 0,
  });

  // Jobs history state
  const [jobsHistory, setJobsHistory] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize input state on mount or active agent selection change
  useEffect(() => {
    const agent = AGENT_CATALOG.find((a) => a.id === selectedAgentId);
    if (agent) {
      setFormInputs(agent.defaultInput);
    }
    setAgentOutput(null);
    setExecutionLogs([]);
  }, [selectedAgentId]);

  // Sync metrics & history regularly
  const fetchMetricsAndHistory = async () => {
    try {
      const resMetrics = await fetch("/api/metrics");
      if (resMetrics.ok) {
        const data = await resMetrics.json();
        setMetrics(data);
      }

      const resJobs = await fetch("/api/agents/jobs?limit=30");
      if (resJobs.ok) {
        const jobs = await resJobs.json();
        const formattedJobs = jobs.map((job: any) => {
          let estimatedTokens = 0;
          if (job.output) {
            const outLen = job.output.length;
            const inLen = job.input ? job.input.length : 0;
            estimatedTokens = Math.ceil((outLen + inLen) / 3.8);
          }
          return {
            ...job,
            completedAt: job.completedAt 
              ? new Date(job.completedAt).toLocaleTimeString() 
              : new Date(job.createdAt).toLocaleTimeString(),
            tokensUsed: { total: estimatedTokens || 0 }
          };
        });
        setJobsHistory(formattedJobs);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchMetricsAndHistory();
    const interval = setInterval(fetchMetricsAndHistory, 8000);
    return () => clearInterval(interval);
  }, [lang]);

  // Update dynamic input field value
  const handleInputChange = (field: string, value: any) => {
    setFormInputs((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Run a single agent
  const executeSingleAgent = async () => {
    setIsRunningAgent(true);
    setAgentOutput(null);
    setExecutionLogs(lang === "ar" ? [
      "جاري تهيئة عقدة التسويق الذكي...",
      `التحقق من صحة المعلمات والمواصفات لوكيل ${getAgentName(selectedAgentId, "ar")}...`,
      "تم إدراج سجل وظيفة الوكيل في قاعدة البيانات (الحالة: معلق)..."
    ] : [
      "Initializing AI Marketing Node...",
      `Validating parameters against schema for ${selectedAgentId.toUpperCase()} Agent...`,
      "Database AgentJob record inserted (status: pending)..."
    ]);

    const simulateLogs = lang === "ar" ? [
      "تأمين اتصال الوكيل ببوابة نموذج الذكاء الاصطناعي...",
      "تغذية المعلمات السياقية إلى نموذج 'gpt-4o-mini'...",
      "تحليل إرشادات نبرة الصوت المستهدفة وملاءمة الكلمات المفتاحية...",
      "بث مخرجات المحتوى وهيكلة قوالب الاستجابة المحددة..."
    ] : [
      "Securing connection proxy to LLM gateway...",
      "Feeding contextual parameters to 'gpt-4o-mini'...",
      "Analyzing target voice guidelines & keyword relevance...",
      "Streaming output chunks and structuring response templates..."
    ];

    // Simulate progressive processing logging
    simulateLogs.forEach((log, index) => {
      setTimeout(() => {
        setExecutionLogs((prev) => [...prev, log]);
      }, (index + 1) * 800);
    });

    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: selectedAgentId,
          input: formInputs,
          organizationId: "org-default",
        }),
      });

      const data = await res.json();
      
      // Update logs on finish
      setTimeout(() => {
        if (data.success) {
          setExecutionLogs((prev) => [
            ...prev,
            lang === "ar" ? "✔ اكتمل توليد الذكاء الاصطناعي بنجاح!" : "✔ AI Generation completed successfully!",
            lang === "ar" ? `تم تسجيل استهلاك الرموز للمدخلات والمخرجات: ${data.tokensUsed?.total || 0}` : `Accumulated prompt & completion tokens logged: ${data.tokensUsed?.total || 0}`,
            lang === "ar" ? "تم حفظ عنصر المحتوى المولد كمسودة في قاعدة البيانات." : "Prisma GeneratedContent artifact saved as draft."
          ]);
          setAgentOutput(data);
          
          // Append to client-side history mock
          setJobsHistory((prev) => [
            {
              id: `job_${Math.random().toString(36).substring(2, 9)}`,
              agentType: selectedAgentId,
              status: "completed",
              input: JSON.stringify(formInputs),
              output: JSON.stringify(data.data),
              completedAt: new Date().toLocaleTimeString(),
              tokensUsed: data.tokensUsed,
              processingTimeMs: data.processingTimeMs,
            },
            ...prev,
          ]);
        } else {
          setExecutionLogs((prev) => [
            ...prev,
            lang === "ar" ? `❌ فشل التوليد: ${data.error || "خطأ غير معروف في الخادم"}` : `❌ Generation Failed: ${data.error || "Unknown server failure"}`
          ]);
          setAgentOutput(data);

          setJobsHistory((prev) => [
            {
              id: `job_${Math.random().toString(36).substring(2, 9)}`,
              agentType: selectedAgentId,
              status: "failed",
              input: JSON.stringify(formInputs),
              error: data.error,
              completedAt: new Date().toLocaleTimeString(),
              tokensUsed: { total: 0 },
              processingTimeMs: 0,
            },
            ...prev,
          ]);
        }
        setIsRunningAgent(false);
        fetchMetricsAndHistory();
      }, 3500);

    } catch (err: any) {
      setTimeout(() => {
        setExecutionLogs((prev) => [...prev, lang === "ar" ? `❌ خطأ في الاتصال بالخادم: ${err.message}` : `❌ Error calling backend: ${err.message}`]);
        setAgentOutput({ success: false, error: err.message });
        setIsRunningAgent(false);
      }, 3500);
    }
  };

  // Run multi-agent pipeline
  const executePipelineSequence = async () => {
    setIsPipelineRunning(true);
    setPipelineOutputs({});
    setSelectedPipelineResultTab("");

    try {
      // Build sequence tasks using default inputs
      const tasks = pipelineTasks.map((agentId) => {
        const metadata = AGENT_CATALOG.find((a) => a.id === agentId);
        return {
          agentType: agentId,
          input: metadata?.defaultInput || {},
        };
      });

      const res = await fetch("/api/agents/sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          organizationId: "org-default",
        }),
      });

      const data = await res.json();
      setPipelineOutputs(data);
      
      // Auto-select the first finished agent tab
      const firstAgentId = Object.keys(data)[0];
      if (firstAgentId) {
        setSelectedPipelineResultTab(firstAgentId);
      }

      // Add each run to local history logs
      Object.entries(data).forEach(([agentType, result]: [string, any]) => {
        setJobsHistory((prev) => [
          {
            id: `job_${Math.random().toString(36).substring(2, 9)}`,
            agentType,
            status: result.success ? "completed" : "failed",
            input: JSON.stringify(AGENT_CATALOG.find(a => a.id === agentType)?.defaultInput),
            output: result.success ? JSON.stringify(result.data) : null,
            error: result.success ? null : result.error,
            completedAt: new Date().toLocaleTimeString(),
            tokensUsed: result.tokensUsed || { total: 0 },
            processingTimeMs: result.processingTimeMs || 0,
          },
          ...prev,
        ]);
      });

    } catch (err: any) {
      console.error(err);
    } finally {
      setIsPipelineRunning(false);
      fetchMetricsAndHistory();
    }
  };

  const handleRetryJob = async (job: any, index: number) => {
    // Optimistic status update
    const updatedHistory = [...jobsHistory];
    updatedHistory[index].status = "pending";
    setJobsHistory(updatedHistory);

    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: job.agentType,
          input: JSON.parse(job.input),
          organizationId: "org-default",
        }),
      });
      const data = await res.json();
      
      const nextHistory = [...jobsHistory];
      if (data.success) {
        nextHistory[index] = {
          ...nextHistory[index],
          status: "completed",
          output: JSON.stringify(data.data),
          tokensUsed: data.tokensUsed,
          processingTimeMs: data.processingTimeMs,
        };
      } else {
        nextHistory[index] = {
          ...nextHistory[index],
          status: "failed",
          error: data.error,
        };
      }
      setJobsHistory(nextHistory);
      fetchMetricsAndHistory();
    } catch (err: any) {
      const nextHistory = [...jobsHistory];
      nextHistory[index].status = "failed";
      nextHistory[index].error = err.message;
      setJobsHistory(nextHistory);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const activeAgentMetadata = AGENT_CATALOG.find((a) => a.id === selectedAgentId);

  return (
    <div 
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#8F7E4F]/30 selection:text-white antialiased flex flex-col"
    >
      {/* Sleek Top Status Bar */}
      <header className="h-20 border-b border-white/10 bg-[#0a0a0a] px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#8F7E4F] rounded-sm flex items-center justify-center font-serif text-2xl text-black font-bold">M</div>
          <div>
            <h1 className="text-xl font-serif tracking-tight font-light text-slate-100">
              {TRANSLATIONS[lang].title} <span className="text-[#8F7E4F] italic">AI</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 text-slate-400">
              {TRANSLATIONS[lang].subtitle}
            </p>
          </div>
        </div>

        {/* Live accumulated costs & tokens metrics */}
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="hidden md:block text-end">
            <p className="text-[10px] uppercase tracking-widest opacity-40 text-slate-400">{TRANSLATIONS[lang].estSpend}</p>
            <p className="font-mono text-sm text-[#8F7E4F] font-semibold">${metrics.totalCostUSD.toFixed(5)}</p>
          </div>
          <div className="hidden md:block text-end">
            <p className="text-[10px] uppercase tracking-widest opacity-40 text-slate-400">{TRANSLATIONS[lang].totalConsumption}</p>
            <p className="font-mono text-sm text-slate-200">{metrics.totalTokens.toLocaleString()} <span className="opacity-30">{TRANSLATIONS[lang].tokens}</span></p>
          </div>
          <div className="hidden lg:block text-end">
            <p className="text-[10px] uppercase tracking-widest opacity-40 text-slate-400">{TRANSLATIONS[lang].efficiencyIndex}</p>
            <p className="font-mono text-sm text-[#8F7E4F]">{metrics.totalJobsTriggered} <span className="opacity-30">{TRANSLATIONS[lang].runs}</span></p>
          </div>

          {/* Bilingual Language Switcher */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-sm">
            <button
              onClick={() => handleSetLang("ar")}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all cursor-pointer ${
                lang === "ar" ? "bg-[#8F7E4F] text-black" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => handleSetLang("en")}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all cursor-pointer ${
                lang === "en" ? "bg-[#8F7E4F] text-black" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
          </div>

          <div className="flex items-center bg-white/5 px-4 py-2 rounded-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 rtl:mr-0 rtl:ml-2"></div>
            <span className="text-[10px] font-mono uppercase tracking-tighter text-slate-300">{TRANSLATIONS[lang].activeOrchestrator}</span>
          </div>
        </div>
      </header>

      {/* Navigation Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 md:px-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex gap-1.5 bg-white/5 p-1 rounded-sm border border-white/10">
            <button
              onClick={() => setActiveTab("single")}
              className={`px-4 py-2 text-xs font-serif font-medium tracking-wide rounded-sm transition-all duration-200 cursor-pointer ${
                activeTab === "single"
                  ? "bg-[#8F7E4F] text-black shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {TRANSLATIONS[lang].singleExpertWorkspace}
            </button>
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`px-4 py-2 text-xs font-serif font-medium tracking-wide rounded-sm transition-all duration-200 cursor-pointer ${
                activeTab === "pipeline"
                  ? "bg-[#8F7E4F] text-black shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {TRANSLATIONS[lang].jointCampaignPipeline}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 text-xs font-serif font-medium tracking-wide rounded-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "history"
                  ? "bg-[#8F7E4F] text-black shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="h-3 w-3" />
              <span>{TRANSLATIONS[lang].jobActivityLogs}</span>
              {jobsHistory.length > 0 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "history" ? "bg-black/20 text-black" : "bg-white/10 text-slate-300"
                }`}>
                  {jobsHistory.length}
                </span>
              )}
            </button>
          </div>
          <div className="hidden sm:block text-[11px] font-mono text-slate-500">
            {TRANSLATIONS[lang].coreModel}: <span className="text-slate-300 font-bold">gpt-4o-mini</span>
          </div>
        </div>

        {/* Tab 1: Single Agent Workspace */}
        {activeTab === "single" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - 12 Agents Selector */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#8F7E4F] pl-1 mb-2 rtl:pl-0 rtl:pr-1">
                {TRANSLATIONS[lang].specialtyAgents}
              </div>
              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {AGENT_CATALOG.map((agent) => {
                  const Icon = agent.icon;
                  const isSelected = selectedAgentId === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`w-full text-left p-3 rounded-sm border transition-all duration-200 flex items-start space-x-3 group ${
                        isSelected
                          ? "bg-[#111111] border-[#8F7E4F]/50 ring-1 ring-[#8F7E4F]/20 shadow-[0_0_12px_rgba(143,126,79,0.1)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-sm transition-colors duration-200 ${
                          isSelected
                            ? "bg-[#8F7E4F] text-black"
                            : "bg-white/5 text-slate-400 group-hover:text-slate-200"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-serif font-medium tracking-tight ${isSelected ? "text-[#8F7E4F]" : "text-slate-200"}`}>
                            {agent.name}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm font-mono ${
                              agent.type === "creative"
                                ? "bg-white/5 text-[#8F7E4F] border border-[#8F7E4F]/20"
                                : "bg-white/5 text-slate-400 border border-white/10"
                            }`}
                          >
                            {agent.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal mt-1 line-clamp-2">
                          {agent.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Parameter Form & Results */}
            <div className="lg:col-span-8 space-y-6">
              {activeAgentMetadata && (
                <div className="bg-[#0c0c0c] border border-white/10 rounded-sm p-6 shadow-xl">
                  {/* Title & Prompt specs */}
                  <div className="border-b border-white/10 pb-5 mb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#8F7E4F]/10 border border-[#8F7E4F]/20 rounded-sm text-[#8F7E4F]">
                          <Brain className="h-4 w-4" />
                        </span>
                        <h2 className="text-base font-serif font-medium text-slate-100 tracking-tight">
                          {TRANSLATIONS[lang].inputSpecs} ({getAgentName(activeAgentMetadata.id, lang)})
                        </h2>
                      </div>
                      <div className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-sm font-mono text-[#8F7E4F]">
                        {TRANSLATIONS[lang].temp}: {activeAgentMetadata.type === "creative" ? "0.7" : "0.3"}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mt-2">
                      {getAgentDesc(activeAgentMetadata.id, lang)}
                    </p>
                  </div>

                  {/* Render Fields Dynamically based on Agent specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formInputs).map(([key, value]) => {
                      // Formatting Labels
                      const label = getLabelTranslation(key, lang);
                      
                      if (Array.isArray(value)) {
                        return (
                          <div key={key} className="md:col-span-2 space-y-1.5">
                            <label className="block text-[11px] font-semibold text-[#8F7E4F] font-mono tracking-wider uppercase">
                              {label} {lang === "ar" ? "(مفصولة بفاصلة)" : "(Comma separated)"}
                            </label>
                            <input
                              type="text"
                              value={value.join(", ")}
                              onChange={(e) =>
                                handleInputChange(
                                  key,
                                  e.target.value.split(",").map((s) => s.trim())
                                )
                              }
                              className="w-full text-xs bg-white/5 border border-white/10 rounded-sm px-3 py-2.5 text-slate-200 placeholder-white/20 focus:outline-none focus:border-[#8F7E4F] focus:ring-1 focus:ring-[#8F7E4F]/25"
                            />
                          </div>
                        );
                      }

                      if (typeof value === "number") {
                        return (
                          <div key={key} className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-[#8F7E4F] font-mono tracking-wider uppercase">{label}</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleInputChange(key, Number(e.target.value))}
                              className="w-full text-xs bg-white/5 border border-white/10 rounded-sm px-3 py-2.5 text-slate-200 placeholder-white/20 focus:outline-none focus:border-[#8F7E4F] focus:ring-1 focus:ring-[#8F7E4F]/25"
                            />
                          </div>
                        );
                      }

                      if (typeof value === "boolean") {
                        return (
                          <div key={key} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-sm border border-white/10 mt-5">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleInputChange(key, e.target.checked)}
                              className="h-4 w-4 bg-transparent border-white/10 rounded-sm focus:ring-0 checked:bg-[#8F7E4F] checked:border-[#8F7E4F]"
                            />
                            <label className="text-[11px] font-semibold text-slate-300 font-mono tracking-wider uppercase cursor-pointer">{label}</label>
                          </div>
                        );
                      }

                      // Render large textarea for descriptive inputs
                      if (typeof value === "string" && value.length > 50) {
                        return (
                          <div key={key} className="md:col-span-2 space-y-1.5">
                            <label className="block text-[11px] font-semibold text-[#8F7E4F] font-mono tracking-wider uppercase">{label}</label>
                            <textarea
                              rows={3}
                              value={value}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full text-xs bg-white/5 border border-white/10 rounded-sm px-3 py-2.5 text-slate-200 placeholder-white/20 focus:outline-none focus:border-[#8F7E4F] focus:ring-1 focus:ring-[#8F7E4F]/25 leading-relaxed"
                            />
                          </div>
                        );
                      }

                      return (
                        <div key={key} className="space-y-1.5">
                          <label className="block text-[11px] font-semibold text-[#8F7E4F] font-mono tracking-wider uppercase">{label}</label>
                          <input
                            type="text"
                            value={value as string}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="w-full text-xs bg-white/5 border border-white/10 rounded-sm px-3 py-2.5 text-slate-200 placeholder-white/20 focus:outline-none focus:border-[#8F7E4F] focus:ring-1 focus:ring-[#8F7E4F]/25"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Execute trigger */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex justify-end">
                    <button
                      onClick={executeSingleAgent}
                      disabled={isRunningAgent}
                      className="px-5 py-2.5 bg-[#8F7E4F] hover:bg-[#8F7E4F]/95 text-black disabled:opacity-40 text-xs font-serif font-semibold tracking-wider uppercase rounded-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      {isRunningAgent ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>{lang === "ar" ? "جاري البث والتحليل..." : "Streaming Result..."}</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-black" />
                          <span>{TRANSLATIONS[lang].delegateTo} {getAgentName(activeAgentMetadata.id, lang).split(" ")[0]}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Execution Progress logs */}
              {isRunningAgent && (
                <div className="bg-[#0c0c0c] border border-white/10 rounded-sm p-5 font-mono text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-[#8F7E4F] font-bold border-b border-white/5 pb-2 mb-3 uppercase tracking-wider">
                    <Cpu className="h-3.5 w-3.5 animate-spin" />
                    <span>{TRANSLATIONS[lang].runningLogs}</span>
                  </div>
                  <div className="space-y-1 max-h-[160px] overflow-y-auto">
                    {executionLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-400">
                        <span className="text-[#8F7E4F]/70">{">"}</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent Generated Output Panel */}
              {agentOutput && (
                <div className="bg-[#080808] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                  {/* Tab header */}
                  <div className="bg-[#0c0c0c] px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono text-[#8F7E4F] uppercase tracking-wider">
                        {getAgentName(selectedAgentId, lang)} - {TRANSLATIONS[lang].nodeOutput}
                      </span>
                    </div>

                    {/* Copy content button */}
                    {agentOutput.success && (
                      <button
                        onClick={() => copyToClipboard(agentOutput.data)}
                        className="px-3 py-1.5 hover:bg-white/5 rounded-sm border border-white/10 text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">{TRANSLATIONS[lang].copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-[#8F7E4F]" />
                            <span className="text-[10px] font-mono">{TRANSLATIONS[lang].copyText}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    {agentOutput.success ? (
                      <div className="space-y-6">
                        {/* Render parsed structured Markdown Output */}
                        <div className="bg-[#111111] border border-white/5 rounded-sm p-5">
                          <MarkdownPreview content={agentOutput.data} />
                        </div>

                        {/* Usage summary footer */}
                        <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono text-slate-500 gap-4">
                          <div>
                            {TRANSLATIONS[lang].execDuration}:{" "}
                            <span className="text-slate-300 font-bold">
                              {(agentOutput.processingTimeMs / 1000).toFixed(2)}{lang === "ar" ? " ثانية" : "s"}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              {TRANSLATIONS[lang].prompt}:{" "}
                              <span className="text-slate-300 font-bold">{agentOutput.tokensUsed?.prompt}</span>
                            </div>
                            <div>
                              {TRANSLATIONS[lang].completion}:{" "}
                              <span className="text-slate-300 font-bold">
                                {agentOutput.tokensUsed?.completion}
                              </span>
                            </div>
                            <div>
                              {TRANSLATIONS[lang].total}:{" "}
                              <span className="text-[#8F7E4F] font-bold">
                                {agentOutput.tokensUsed?.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 bg-red-950/20 border border-red-900/40 p-4 rounded-sm">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-red-300 font-mono">{TRANSLATIONS[lang].errorHeader}</h4>
                          <p className="text-xs text-red-400 mt-1 leading-normal">
                            {agentOutput.error || TRANSLATIONS[lang].errorDetails}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Sequential Pipeline Workspace */}
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            {/* Explanatory banner */}
            <div className="bg-[#0c0c0c] border border-white/10 p-5 rounded-sm flex items-start gap-3.5 shadow-sm">
              <Sparkles className="h-5.5 w-5.5 text-[#8F7E4F] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-serif font-medium text-slate-200 tracking-wide uppercase">
                  {TRANSLATIONS[lang].jointProtocol}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {TRANSLATIONS[lang].jointDesc}
                </p>
              </div>
            </div>

            {/* Selector Grid */}
            <div className="bg-[#0c0c0c] border border-white/10 rounded-sm p-6 shadow-xl">
              <h3 className="text-xs font-serif font-medium text-slate-400 tracking-wider uppercase mb-4">
                {TRANSLATIONS[lang].pipelineConfig}
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                {pipelineTasks.map((agentId, index) => {
                  const metadata = AGENT_CATALOG.find((a) => a.id === agentId);
                  const Icon = metadata?.icon || Brain;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="bg-[#111111] border border-white/5 px-4 py-3 rounded-sm flex items-center gap-3 shadow-md">
                        <span className="text-xs font-bold text-[#8F7E4F] font-mono">#{index + 1}</span>
                        <div className="p-1.5 bg-white/5 text-[#8F7E4F] border border-white/10 rounded-sm">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold font-serif text-slate-200">
                            {getAgentName(agentId, lang).split(" ")[0]}
                          </div>
                          <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider font-mono">
                            {metadata?.type}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setPipelineTasks((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="text-slate-600 hover:text-red-400 transition-all ml-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {index < pipelineTasks.length - 1 && (
                        <div className="px-2">
                          <ArrowRight className="h-4 w-4 text-slate-600 rtl:rotate-180" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {pipelineTasks.length < 4 && (
                  <div className="flex items-center">
                    {pipelineTasks.length > 0 && <div className="px-2"><ArrowRight className="h-4 w-4 text-slate-600 opacity-40 rtl:rotate-180" /></div>}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setPipelineTasks((prev) => [...prev, e.target.value]);
                          e.target.value = "";
                        }
                      }}
                      className="bg-[#111111] border border-white/10 text-slate-300 hover:text-slate-100 px-3 py-2.5 rounded-sm text-xs font-serif font-medium focus:outline-none focus:border-[#8F7E4F] cursor-pointer"
                    >
                      <option value="">{lang === "ar" ? " + إضافة عقدة" : "+ Append Node"}</option>
                      {AGENT_CATALOG.filter((a) => !pipelineTasks.includes(a.id)).map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {getAgentName(agent.id, lang).split(" ")[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Action trigger */}
              <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-mono text-slate-500 max-w-md">
                  {TRANSLATIONS[lang].pipelinePredefined}
                </p>
                <button
                  onClick={executePipelineSequence}
                  disabled={isPipelineRunning || pipelineTasks.length === 0}
                  className="px-6 py-2.5 bg-[#8F7E4F] hover:bg-[#8F7E4F]/95 text-black disabled:opacity-40 text-xs font-serif font-semibold tracking-wider uppercase rounded-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isPipelineRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{lang === "ar" ? "جاري تشغيل السلسلة..." : "Running Sequence..."}</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-black" />
                      <span>{TRANSLATIONS[lang].executePipeline}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Pipeline Results Console */}
            {isPipelineRunning && (
              <div className="bg-[#0c0c0c] border border-white/10 rounded-sm p-5 text-center py-12">
                <Cpu className="h-10 w-10 text-[#8F7E4F] animate-spin mx-auto mb-4" />
                <h4 className="text-xs font-serif font-semibold text-[#8F7E4F] tracking-wider uppercase">
                  {TRANSLATIONS[lang].sequenceActive}
                </h4>
                <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  {TRANSLATIONS[lang].sequenceDesc}
                </p>
              </div>
            )}

            {Object.keys(pipelineOutputs).length > 0 && (
              <div className="bg-[#080808] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                {/* Result header navigation tabs */}
                <div className="bg-[#0c0c0c] border-b border-white/10 px-6 py-2 flex items-center justify-between">
                  <div className="flex gap-2 overflow-x-auto">
                    {Object.entries(pipelineOutputs).map(([agentId, res]: [string, any]) => {
                      const isSelected = selectedPipelineResultTab === agentId;
                      return (
                        <button
                          key={agentId}
                          onClick={() => setSelectedPipelineResultTab(agentId)}
                          className={`px-4 py-3 text-xs font-serif font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "border-[#8F7E4F] text-[#8F7E4F]"
                              : "border-transparent text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {getAgentName(agentId, lang).split(" ")[0]} {res.success ? "✔" : "❌"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected tab outcome content */}
                <div className="p-6">
                  {(() => {
                    const activeResult = pipelineOutputs[selectedPipelineResultTab];
                    if (!activeResult) return null;
                    return activeResult.success ? (
                      <div className="space-y-6 animate-fade-in">
                        <div className="bg-[#111111] border border-white/5 rounded-sm p-5">
                          <MarkdownPreview content={activeResult.data} />
                        </div>
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono text-slate-500 gap-4">
                          <div>
                            {lang === "ar" ? "مدة معالجة التشغيل: " : "Run Processing Duration: "}{" "}
                            <span className="text-slate-300 font-bold">
                              {(activeResult.processingTimeMs / 1000).toFixed(2)}{lang === "ar" ? " ثانية" : "s"}
                            </span>
                          </div>
                          <div>
                            {TRANSLATIONS[lang].tokensUsed}:{" "}
                            <span className="text-[#8F7E4F] font-bold">
                              {activeResult.tokensUsed?.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 bg-red-950/20 border border-red-900/40 p-4 rounded-sm">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-red-300 font-mono">
                            {lang === "ar" ? "فشل الوكيل في مسار الحلقة" : "Agent failure on loop"}
                          </h4>
                          <p className="text-xs text-red-400 mt-1 leading-normal">
                            {activeResult.error}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Historical logs */}
        {activeTab === "history" && (
          <div className="bg-[#080808] border border-white/10 rounded-sm overflow-hidden shadow-xl">
            <div className="bg-[#0c0c0c] px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-[#8F7E4F] animate-pulse" />
                <h3 className="text-xs font-serif font-medium tracking-wider uppercase text-slate-200">
                  {TRANSLATIONS[lang].prismaLogs}
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {lang === "ar" ? "تم تمكين المزامنة الاحتياطية في الذاكرة" : "In-Memory FALLBACK sync enabled"}
              </span>
            </div>

            <div className="p-6">
              {jobsHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Database className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                    {lang === "ar" ? "لم يتم تسجيل أي عمليات وكيل حتى الآن" : "No Agent Actions Logged Yet"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {lang === "ar" ? "تفضل بتشغيل أحد وكلاء التسويق لتسجيل السجلات في قاعدة البيانات للجلسة الحالية." : "Go ahead and trigger a marketing agent to seed database logs in the local runtime session."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobsHistory.map((job, index) => {
                    const isSuccess = job.status === "completed";
                    const isFailed = job.status === "failed";

                    return (
                      <div
                        key={job.id}
                        className="bg-[#111111] border border-white/5 rounded-sm p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4 transition-all hover:bg-[#111111]/80"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-serif font-semibold text-[#8F7E4F] uppercase">
                              {getAgentName(job.agentType, lang)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">({job.id})</span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase font-mono ${
                                isSuccess
                                  ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/20"
                                  : isFailed
                                  ? "bg-red-950/40 text-red-300 border border-red-800/20"
                                  : "bg-blue-950/40 text-blue-300 border border-blue-800/20 animate-pulse"
                              }`}
                            >
                              {getStatusTranslation(job.status, lang)}
                            </span>
                          </div>

                          {/* Render prompt info */}
                          <div className="text-xs text-slate-400 bg-black/40 border border-white/5 p-2.5 rounded-sm font-mono max-w-2xl overflow-hidden text-ellipsis line-clamp-1">
                            {job.input}
                          </div>

                          {isFailed && job.error && (
                            <p className="text-xs text-red-400 font-mono">{lang === "ar" ? "الخطأ: " : "Error: "} {job.error}</p>
                          )}

                          {isSuccess && job.output && (
                            <div className="mt-3 bg-[#0a0a0a] border border-white/5 p-4 rounded-sm text-slate-300 leading-normal max-h-[160px] overflow-y-auto custom-scrollbar">
                              <MarkdownPreview content={JSON.parse(job.output)} />
                            </div>
                          )}
                        </div>

                        {/* Metrics and Retry action */}
                        <div className="flex flex-row md:flex-col md:items-end justify-between items-center text-xs font-mono text-slate-500 gap-3 min-w-[150px]">
                          <div className="text-end md:space-y-1">
                            <div className="text-[11px] text-slate-400">{lang === "ar" ? "الوقت: " : "Time: "} {job.completedAt}</div>
                            <div className="text-[10px] text-slate-500">
                              {lang === "ar" ? "الرموز: " : "Tokens: "} <span className="text-[#8F7E4F] font-bold">{job.tokensUsed?.total || 0}</span>
                            </div>
                          </div>

                          {isFailed && (
                            <button
                              onClick={() => handleRetryJob(job, index)}
                              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/30 rounded-sm text-red-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="h-3.5 w-3.5 animate-spin-reverse" />
                              <span className="font-bold">{TRANSLATIONS[lang].retryRun}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-10 border-t border-white/10 bg-[#0a0a0a] flex items-center justify-between px-8 text-[10px] font-mono opacity-60 uppercase mt-auto gap-4">
        <div className="flex gap-6 text-slate-400">
          <span>{TRANSLATIONS[lang].dbConnected}</span>
          <span>{TRANSLATIONS[lang].jwt}</span>
          <span>{TRANSLATIONS[lang].loc}</span>
        </div>
        <div className="flex gap-6 text-slate-400">
          <span className="text-[#8F7E4F]">{TRANSLATIONS[lang].stableVersion}</span>
          <span>{TRANSLATIONS[lang].nodeVersion}</span>
          <span>{TRANSLATIONS[lang].memory}: 142MB / 512MB</span>
        </div>
      </footer>
    </div>
  );
}

// Markdown Formatter helper
function MarkdownPreview({ content }: { content: string }) {
  if (!content) return null;
  const lines = content.split("\n");

  return (
    <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        
        // Headers parsing
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={index} className="text-sm sm:text-base font-serif font-medium italic text-[#8F7E4F] mt-6 mb-2 tracking-tight">
              {trimmed.replace(/^###\s*/, "")}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={index} className="text-base sm:text-lg font-serif font-light text-slate-100 mt-8 mb-3 border-b border-white/10 pb-1.5 tracking-tight">
              {trimmed.replace(/^##\s*/, "")}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={index} className="text-lg sm:text-xl font-serif font-light text-[#8F7E4F] mt-10 mb-4 tracking-tight">
              {trimmed.replace(/^#\s*/, "")}
            </h2>
          );
        }

        const inlineFormatter = (text: string) => {
          const boldParts = text.split("**");
          return boldParts.map((p, idx) => (idx % 2 === 1 ? <strong key={idx} className="text-[#8F7E4F] font-semibold">{p}</strong> : p));
        };

        // Bullet points
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          return (
            <li key={index} className="ml-5 list-disc text-slate-300 leading-normal my-1">
              {inlineFormatter(trimmed.replace(/^[-*]\s*/, ""))}
            </li>
          );
        }

        // Ordered numbered lists
        const matchNum = trimmed.match(/^(\d+)\.\s(.*)/);
        if (matchNum) {
          return (
            <li key={index} className="ml-5 list-decimal text-slate-300 leading-normal my-1">
              {inlineFormatter(matchNum[2])}
            </li>
          );
        }

        // Horizontal Rule
        if (trimmed === "---") {
          return <hr key={index} className="border-white/10 my-6" />;
        }

        // Blockquotes
        if (trimmed.startsWith(">")) {
          return (
            <blockquote key={index} className="border-l-4 border-[#8F7E4F] pl-4 py-1.5 bg-white/5 text-slate-400 rounded-sm my-4 italic">
              {inlineFormatter(trimmed.replace(/^>\s*/, ""))}
            </blockquote>
          );
        }

        // Spacing lines
        if (trimmed === "") {
          return <div key={index} className="h-1.5" />;
        }

        // Standard text lines
        return <p key={index} className="leading-relaxed">{inlineFormatter(line)}</p>;
      })}
    </div>
  );
}
