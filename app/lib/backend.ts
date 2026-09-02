import { categories, cities, lawyers, makeReply, services } from "../data";

export type ApiError = {
  error: string;
  field?: string;
};

export type ChatRequest = {
  message?: string;
  matterType?: string;
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
        "This is general legal information for an Indian-law prototype, not legal advice.",
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
      status: "prototype",
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
    "This sample prototype scan checks deadlines, parties, clauses, monetary claims, and forum.";

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

function shouldRecommendTool(tool: string, message: string, matterType: string) {
  const lower = message.toLowerCase();
  if (tool === "Document Scan") return lower.includes("scan") || lower.includes("document") || matterType === "Property";
  if (tool === "Tax Filing") return matterType === "Tax";
  if (tool === "Legal Notice") return lower.includes("notice") || lower.includes("reply");
  if (tool === "Court Steps") return true;
  return false;
}
