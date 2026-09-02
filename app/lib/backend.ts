import { caseFiles, categories, cities, intakeQuestions, lawyers, makeReply, services } from "../data";

export type ApiError = {
  error: string;
  field?: string;
};

export type ChatRequest = {
  message?: string;
  matterType?: string;
  conversation?: Array<{
    role: "assistant" | "user";
    text: string;
  }>;
};

export type ConsultationRequest = {
  lawyerId?: number;
  issueSummary?: string;
  preferredSlot?: string;
  contactMode?: "video" | "phone" | "office";
};

export type DocumentScanRequest = {
  fileName?: string;
  documentType?: string;
  sampleText?: string;
};

export type IntakeRequest = {
  matterType?: string;
  urgency?: string;
  city?: string;
  budget?: string;
  summary?: string;
};

export type PaymentRequest = {
  consultationId?: string;
  amount?: number;
  method?: "upi" | "card" | "netbanking";
};

export function badRequest(error: string, field?: string): ApiError {
  return { error, field };
}

export function getLawyerSearch(params: URLSearchParams) {
  const city = params.get("city") || "All cities";
  const category = params.get("category") || "All";
  const maxPrice = Number(params.get("maxPrice") || 2200);
  const urgentOnly = params.get("urgentOnly") === "true";

  const normalizedCity = cities.includes(city) ? city : "All cities";
  const normalizedCategory = categories.includes(category) ? category : "All";
  const normalizedMaxPrice = Number.isFinite(maxPrice)
    ? Math.min(Math.max(maxPrice, 700), 2200)
    : 2200;

  const results = lawyers.filter((lawyer) => {
    const matchesCategory = normalizedCategory === "All" || lawyer.specialty === normalizedCategory;
    const matchesCity = normalizedCity === "All cities" || lawyer.city === normalizedCity;
    const matchesBudget = lawyer.price <= normalizedMaxPrice;
    const matchesUrgent = !urgentOnly || lawyer.availability === "Today";
    return matchesCategory && matchesCity && matchesBudget && matchesUrgent;
  });

  return {
    filters: {
      city: normalizedCity,
      category: normalizedCategory,
      maxPrice: normalizedMaxPrice,
      urgentOnly,
    },
    count: results.length,
    results,
  };
}

export function createChatResponse(body: ChatRequest) {
  const message = body.message?.trim();
  if (!message) {
    return { ok: false as const, error: badRequest("Message is required.", "message") };
  }

  const matterType = body.matterType || inferMatterType(message);
  return {
    ok: true as const,
    data: {
      id: `chat_${Date.now()}`,
      reply: makeReply(message),
      matterType,
      confidence: matterType === "General" ? 0.62 : 0.84,
      nextSteps: makeNextSteps(matterType),
      recommendedTools: services
        .filter((service) => shouldRecommendTool(service.name, message, matterType))
        .map((service) => service.name),
      disclaimer:
        "This guidance is for Indian legal procedures and should be reviewed by a qualified advocate.",
      createdAt: new Date().toISOString(),
    },
  };
}

export async function createOpenAIChatResponse(body: ChatRequest) {
  const message = body.message?.trim();
  if (!message) {
    return { ok: false as const, error: badRequest("Message is required.", "message") };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return createChatResponse(body);
  }

  const matterType = body.matterType || inferMatterType(message);
  const nextSteps = makeNextSteps(matterType);
  const model = process.env.OPENAI_MODEL || "gpt-5.6";
  const recentConversation = (body.conversation || [])
    .slice(-8)
    .map((item) => `${item.role === "user" ? "User" : "Legal Desk"}: ${item.text}`)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You are NyayLink Legal Desk, a careful Indian legal information assistant. Provide practical, concise guidance for Indian legal procedures. Do not claim to be a lawyer, do not draft final filings as legal advice, and always recommend review by an enrolled advocate for filings, notices, deadlines, criminal matters, or court strategy. Use plain English with occasional Hindi labels only when natural.",
      input: [
        recentConversation ? `Recent conversation:\n${recentConversation}` : "",
        `Current user message:\n${message}`,
        `Detected matter type: ${matterType}`,
        "Return a clear answer with: key issue, documents to collect, immediate next steps, and when to consult an advocate.",
      ]
        .filter(Boolean)
        .join("\n\n"),
      max_output_tokens: 700,
    }),
  });

  const data = (await response.json()) as {
    output_text?: string;
    error?: { message?: string };
    output?: Array<{
      content?: Array<{ text?: string; type?: string }>;
    }>;
  };

  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI request failed.");
  }

  const reply =
    data.output_text ||
    data.output
      ?.flatMap((item) => item.content || [])
      .map((content) => content.text)
      .filter(Boolean)
      .join("\n") ||
    makeReply(message);

  return {
    ok: true as const,
    data: {
      id: `chat_${Date.now()}`,
      reply,
      matterType,
      confidence: matterType === "General" ? 0.7 : 0.9,
      nextSteps,
      recommendedTools: services
        .filter((service) => shouldRecommendTool(service.name, message, matterType))
        .map((service) => service.name),
      disclaimer:
        "This guidance is for Indian legal procedures and should be reviewed by a qualified advocate.",
      model,
      provider: "openai",
      createdAt: new Date().toISOString(),
    },
  };
}

export function createConsultation(body: ConsultationRequest) {
  const lawyer = lawyers.find((item) => item.id === body.lawyerId);
  if (!lawyer) {
    return { ok: false as const, error: badRequest("A valid lawyerId is required.", "lawyerId") };
  }

  return {
    ok: true as const,
    data: {
      id: `consult_${lawyer.id}_${Date.now()}`,
      status: "pending_confirmation",
      lawyer,
      preferredSlot: body.preferredSlot || lawyer.availability,
      contactMode: body.contactMode || "video",
      issueSummary: body.issueSummary?.trim() || "Initial legal consultation requested.",
      estimatedFee: lawyer.price,
      createdAt: new Date().toISOString(),
    },
  };
}

export function listWorkflowTools() {
  return {
    tools: services.map((service) => ({
      ...service,
      status: "available",
      supportedInputs:
        service.name === "Document Scan"
          ? ["PDF", "JPG", "PNG", "typed summary"]
          : ["typed summary", "checklist answers"],
    })),
  };
}

export function createDocumentScan(body: DocumentScanRequest) {
  const fileName = body.fileName?.trim() || "sample-document.pdf";
  const documentType = body.documentType?.trim() || "General legal document";
  const sampleText =
    body.sampleText?.trim() ||
    "This document review checks deadlines, parties, clauses, monetary claims, and forum.";

  return {
    id: `scan_${Date.now()}`,
    fileName,
    documentType,
    status: "analysis_ready",
    extractedText: sampleText,
    flags: [
      "Verify party names and addresses before use.",
      "Check limitation period and response deadline.",
      "Ask an advocate to review jurisdiction and relief clauses.",
    ],
    suggestedMatterType: inferMatterType(`${documentType} ${sampleText}`),
    createdAt: new Date().toISOString(),
  };
}

export function getCaseDashboard() {
  const openCases = caseFiles.filter((file) => file.progress < 100);
  return {
    count: caseFiles.length,
    openCases: openCases.length,
    nextDeadline: "12 Sep 2026",
    cases: caseFiles,
  };
}

export function getIntakeSchema() {
  return {
    questions: intakeQuestions,
    supportedMatterTypes: categories.filter((category) => category !== "All"),
  };
}

export function createIntake(body: IntakeRequest) {
  if (!body.summary?.trim()) {
    return { ok: false as const, error: badRequest("Issue summary is required.", "summary") };
  }

  const matterType = body.matterType || inferMatterType(body.summary);
  const recommendedLawyers = lawyers
    .filter((lawyer) => lawyer.specialty === matterType || matterType === "General")
    .slice(0, 3);

  return {
    ok: true as const,
    data: {
      id: `intake_${Date.now()}`,
      matterType,
      urgency: body.urgency || "This week",
      city: body.city || "Bengaluru",
      budget: body.budget || "Flexible",
      summary: body.summary.trim(),
      triageScore: matterType === "Criminal" || body.urgency === "Today" ? "High" : "Standard",
      requiredDocuments: makeRequiredDocuments(matterType),
      recommendedLawyers,
      createdAt: new Date().toISOString(),
    },
  };
}

export function createPaymentOrder(body: PaymentRequest) {
  const amount = Number(body.amount || 0);
  if (!body.consultationId?.trim()) {
    return { ok: false as const, error: badRequest("consultationId is required.", "consultationId") };
  }
  if (!Number.isFinite(amount) || amount < 100) {
    return { ok: false as const, error: badRequest("A valid amount is required.", "amount") };
  }

  return {
    ok: true as const,
    data: {
      id: `pay_${Date.now()}`,
      consultationId: body.consultationId,
      amount,
      currency: "INR",
      method: body.method || "upi",
      status: "created",
      upiIntent: `upi://pay?pa=nyaylink@upi&pn=NyayLink&am=${amount}&cu=INR`,
      createdAt: new Date().toISOString(),
    },
  };
}

function inferMatterType(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("consumer") || lower.includes("refund") || lower.includes("warranty")) return "Consumer";
  if (lower.includes("tax") || lower.includes("itr") || lower.includes("income")) return "Tax";
  if (lower.includes("property") || lower.includes("agreement") || lower.includes("sale deed")) return "Property";
  if (lower.includes("landlord") || lower.includes("rent") || lower.includes("tenant")) return "Property";
  if (lower.includes("divorce") || lower.includes("custody") || lower.includes("maintenance")) return "Family";
  if (lower.includes("fir") || lower.includes("bail") || lower.includes("police")) return "Criminal";
  if (lower.includes("salary") || lower.includes("termination") || lower.includes("employer")) return "Labour";
  return "General";
}

function makeNextSteps(matterType: string) {
  const common = ["Preserve documents and screenshots.", "Note every deadline in writing."];
  if (matterType === "Consumer") {
    return ["Collect invoice, warranty, and complaint proof.", "Send a written demand notice.", ...common];
  }
  if (matterType === "Tax") {
    return ["Identify notice section and assessment year.", "Collect AIS, Form 26AS, bank records, and prior ITR.", ...common];
  }
  if (matterType === "Property") {
    return ["Collect agreement, title records, tax receipts, and notices.", "Check registration and possession clauses.", ...common];
  }
  return ["Write a short fact summary.", "Identify parties, dates, documents, and requested relief.", ...common];
}

function makeRequiredDocuments(matterType: string) {
  if (matterType === "Consumer") return ["Invoice", "Warranty or service proof", "Complaint emails", "Demand notice"];
  if (matterType === "Tax") return ["Income tax notice", "AIS/TIS", "Form 26AS", "Bank statements", "Prior ITR"];
  if (matterType === "Property") return ["Agreement", "Title or ownership proof", "Tax receipts", "Legal notice"];
  if (matterType === "Family") return ["Identity proof", "Marriage or relation proof", "Income records", "Prior orders"];
  if (matterType === "Criminal") return ["FIR or complaint", "Bail/order papers", "ID proof", "Event timeline"];
  if (matterType === "Labour") return ["Offer letter", "Payslips", "Termination notice", "Employer communication"];
  return ["Identity proof", "Issue summary", "Relevant notices", "Supporting documents"];
}

function shouldRecommendTool(tool: string, message: string, matterType: string) {
  const lower = message.toLowerCase();
  if (tool === "Document Scan") return lower.includes("scan") || lower.includes("document") || matterType === "Property";
  if (tool === "Tax Filing") return matterType === "Tax";
  if (tool === "Legal Notice") return lower.includes("notice") || lower.includes("reply");
  if (tool === "Court Steps") return true;
  return false;
}
