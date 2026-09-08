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

export type LegalAutomationField = {
  id: string;
  label: string;
  question: string;
  required: boolean;
  sensitive?: boolean;
  placeholder?: string;
};

export type GovernmentIntegration = {
  id:
    | "income_tax_eri"
    | "gstn_gsp"
    | "digilocker_apisetu"
    | "ecourts_services"
    | "ecourts_efiling"
    | "ecourts_epay"
    | "edaakhil_ejagriti";
  name: string;
  owner: string;
  access: "official-api" | "partner-gated-api" | "portal-flow" | "reference-data";
  status: "implementable" | "requires-registration" | "requires-human-portal-step";
  baseUrl: string;
  sourceUrl: string;
  supports: string[];
  requirements: string[];
  implementationMode: "api-adapter" | "portal-assist" | "data-fetch";
};

export type LegalAutomationWorkflow = {
  id: "income_tax_return" | "consumer_complaint" | "legal_notice_reply" | "court_filing";
  name: string;
  forum: string;
  description: string;
  adapter: string;
  estimatedTime: string;
  requiredReview: string;
  integrationIds: GovernmentIntegration["id"][];
  fields: LegalAutomationField[];
};

export type LegalAutomationRequest = {
  message?: string;
  workflowId?: LegalAutomationWorkflow["id"];
  integrationId?: GovernmentIntegration["id"];
  collected?: Record<string, string>;
};

export type FilingSubmissionRequest = {
  workflowId?: LegalAutomationWorkflow["id"];
  integrationId?: GovernmentIntegration["id"];
  collected?: Record<string, string>;
  consent?: boolean;
};

export function badRequest(error: string, field?: string): ApiError {
  return { error, field };
}

export const legalAutomationWorkflows: LegalAutomationWorkflow[] = [
  {
    id: "income_tax_return",
    name: "Income tax filing",
    forum: "Income Tax e-Filing Portal",
    description:
      "Collects ITR basics, income heads, deductions, tax paid, bank details, and prepares an e-filing payload.",
    adapter: "income-tax-efiling-adapter",
    estimatedTime: "8-12 min",
    requiredReview: "CA or tax professional review before final submission",
    integrationIds: ["income_tax_eri", "digilocker_apisetu"],
    fields: [
      {
        id: "assessmentYear",
        label: "Assessment year",
        question: "Which assessment year should I prepare the return for?",
        required: true,
        placeholder: "Example: AY 2026-27",
      },
      {
        id: "pan",
        label: "PAN",
        question: "What is the taxpayer PAN? You can enter a masked value for this prototype.",
        required: true,
        sensitive: true,
        placeholder: "ABCDE1234F",
      },
      {
        id: "incomeSources",
        label: "Income sources",
        question: "Which income sources should I include?",
        required: true,
        placeholder: "Salary, interest, capital gains, business income",
      },
      {
        id: "annualIncome",
        label: "Annual income",
        question: "What is the approximate annual income before deductions?",
        required: true,
        placeholder: "Example: Rs 12,50,000",
      },
      {
        id: "deductions",
        label: "Deductions",
        question: "Which deductions should I claim, if any?",
        required: true,
        placeholder: "80C, 80D, home loan interest, NPS",
      },
      {
        id: "taxPaid",
        label: "Tax paid",
        question: "What TDS or advance tax has already been paid?",
        required: true,
        placeholder: "Example: Rs 86,000 TDS",
      },
      {
        id: "bankAccount",
        label: "Refund bank account",
        question: "Which verified bank account should receive any refund?",
        required: true,
        sensitive: true,
        placeholder: "Masked account ending 1234",
      },
    ],
  },
  {
    id: "consumer_complaint",
    name: "Consumer complaint",
    forum: "District Consumer Commission / e-Daakhil",
    description:
      "Turns a grievance into a complaint draft, claim summary, evidence list, and e-Daakhil-style filing packet.",
    adapter: "edaakhil-complaint-adapter",
    estimatedTime: "10-15 min",
    requiredReview: "Advocate review recommended for high-value or complex claims",
    integrationIds: ["edaakhil_ejagriti", "digilocker_apisetu"],
    fields: [
      {
        id: "oppositeParty",
        label: "Opposite party",
        question: "Who is the seller, service provider, or company you want to complain against?",
        required: true,
      },
      {
        id: "purchaseDetails",
        label: "Purchase details",
        question: "What did you buy or pay for, and when?",
        required: true,
      },
      {
        id: "problem",
        label: "Problem summary",
        question: "What went wrong, and what proof do you have?",
        required: true,
      },
      {
        id: "relief",
        label: "Relief sought",
        question: "What outcome do you want: refund, replacement, compensation, apology, or something else?",
        required: true,
      },
      {
        id: "claimAmount",
        label: "Claim amount",
        question: "What is the approximate claim amount?",
        required: true,
      },
    ],
  },
  {
    id: "legal_notice_reply",
    name: "Legal notice reply",
    forum: "Advocate notice workflow",
    description:
      "Collects notice facts, deadlines, allegations, documents, and prepares a reply brief for advocate approval.",
    adapter: "notice-reply-drafting-adapter",
    estimatedTime: "6-10 min",
    requiredReview: "Enrolled advocate approval required before sending",
    integrationIds: ["digilocker_apisetu"],
    fields: [
      {
        id: "noticeDate",
        label: "Notice date",
        question: "What date is printed on the legal notice?",
        required: true,
      },
      {
        id: "sender",
        label: "Sender",
        question: "Who sent the notice?",
        required: true,
      },
      {
        id: "deadline",
        label: "Deadline",
        question: "Does the notice mention a reply or payment deadline?",
        required: true,
      },
      {
        id: "allegations",
        label: "Allegations",
        question: "What are the main allegations or demands?",
        required: true,
      },
      {
        id: "yourPosition",
        label: "Your position",
        question: "Which parts do you agree with, deny, or need more time to verify?",
        required: true,
      },
    ],
  },
  {
    id: "court_filing",
    name: "Court filing packet",
    forum: "eCourts / court filing desk",
    description:
      "Builds a structured filing packet with parties, jurisdiction, relief, facts, documents, and verification checklist.",
    adapter: "ecourts-filing-packet-adapter",
    estimatedTime: "12-18 min",
    requiredReview: "Advocate vetting required before filing",
    integrationIds: ["ecourts_efiling", "ecourts_epay", "ecourts_services", "digilocker_apisetu"],
    fields: [
      {
        id: "matterType",
        label: "Matter type",
        question: "What type of court matter is this?",
        required: true,
      },
      {
        id: "jurisdiction",
        label: "Jurisdiction",
        question: "Which city, court, or forum should handle it?",
        required: true,
      },
      {
        id: "parties",
        label: "Parties",
        question: "Who are the petitioner/applicant and respondent/opposite party?",
        required: true,
      },
      {
        id: "facts",
        label: "Facts",
        question: "Give me the key facts in date order.",
        required: true,
      },
      {
        id: "relief",
        label: "Relief",
        question: "What orders or relief do you want from the court?",
        required: true,
      },
      {
        id: "documents",
        label: "Documents",
        question: "Which documents or exhibits support this filing?",
        required: true,
      },
    ],
  },
];

export const governmentIntegrations: GovernmentIntegration[] = [
  {
    id: "income_tax_eri",
    name: "Income Tax ERI APIs",
    owner: "Income Tax Department",
    access: "partner-gated-api",
    status: "requires-registration",
    baseUrl: "https://www.incometax.gov.in/iec/foportal/api-specifications",
    sourceUrl: "https://www.incometax.gov.in/iec/foportal/api-specifications",
    supports: [
      "ERI login session",
      "Add or activate taxpayer client with consent",
      "Fetch prefill data",
      "Validate and submit ITR",
      "e-Verify return",
      "Fetch acknowledgement",
    ],
    requirements: [
      "Registered ERI account",
      "Taxpayer PAN and OTP/e-verification consent",
      "Secure handling of tax records",
      "Return schema mapping and validation",
    ],
    implementationMode: "api-adapter",
  },
  {
    id: "gstn_gsp",
    name: "GSTN through GSP/ASP",
    owner: "Goods and Services Tax Network",
    access: "partner-gated-api",
    status: "requires-registration",
    baseUrl: "https://www.gstn.org.in/",
    sourceUrl: "https://www.gstn.org.in/",
    supports: [
      "GST return preparation",
      "Invoice upload and reconciliation",
      "Ledger and filing status access",
      "GSP-secured submission flows",
    ],
    requirements: [
      "Licensed GST Suvidha Provider or ASP partnership",
      "GSTIN authorization",
      "OTP/e-sign or portal verification depending on flow",
      "GST schema validation",
    ],
    implementationMode: "api-adapter",
  },
  {
    id: "digilocker_apisetu",
    name: "DigiLocker / API Setu",
    owner: "MeitY / Digital India",
    access: "official-api",
    status: "implementable",
    baseUrl: "https://apisetu.gov.in/",
    sourceUrl: "https://apisetu.gov.in/",
    supports: [
      "Consent-based document retrieval",
      "PAN and issued document verification where available",
      "API discovery through API Setu",
      "Requester and issuer integrations",
    ],
    requirements: [
      "Requester onboarding",
      "User consent",
      "Secure callback and token handling",
      "Purpose limitation for fetched documents",
    ],
    implementationMode: "data-fetch",
  },
  {
    id: "ecourts_services",
    name: "eCourts Services",
    owner: "eCommittee, Supreme Court of India / NIC",
    access: "reference-data",
    status: "implementable",
    baseUrl: "https://ecourts.gov.in/ecourts2.0/",
    sourceUrl: "https://ecourts.gov.in/",
    supports: [
      "Case status lookup",
      "Cause lists",
      "Orders and judgments links",
      "CNR-based case tracking",
    ],
    requirements: [
      "CNR number or court-specific case identifiers",
      "Respect court service terms and rate limits",
      "Avoid scraping protected pages without permission",
    ],
    implementationMode: "data-fetch",
  },
  {
    id: "ecourts_efiling",
    name: "eCourts eFiling",
    owner: "eCommittee, Supreme Court of India",
    access: "portal-flow",
    status: "requires-human-portal-step",
    baseUrl: "https://filing.ecourts.gov.in/",
    sourceUrl: "https://ecourts.gov.in/",
    supports: [
      "Online case filing",
      "Filing packet upload",
      "Advocate/litigant portal workflow",
      "Portal status tracking",
    ],
    requirements: [
      "Portal user login",
      "Court-specific filing rules",
      "Signed pleadings and annexures",
      "Human review before upload and final submit",
    ],
    implementationMode: "portal-assist",
  },
  {
    id: "ecourts_epay",
    name: "eCourts ePay",
    owner: "eCommittee, Supreme Court of India",
    access: "portal-flow",
    status: "requires-human-portal-step",
    baseUrl: "https://pay.ecourts.gov.in/",
    sourceUrl: "https://ecourts.gov.in/",
    supports: ["Court fee payment", "Fine and judicial deposit payment", "Payment acknowledgement"],
    requirements: [
      "Court payment identifiers",
      "User approval for payment",
      "Payment gateway handoff",
      "Receipt capture",
    ],
    implementationMode: "portal-assist",
  },
  {
    id: "edaakhil_ejagriti",
    name: "e-Daakhil / e-Jagriti consumer filing",
    owner: "Department of Consumer Affairs / Consumer Commissions",
    access: "portal-flow",
    status: "requires-human-portal-step",
    baseUrl: "https://edaakhil.nic.in/",
    sourceUrl: "https://www.india.gov.in/",
    supports: [
      "Consumer complaint filing",
      "Fee payment",
      "Complaint status workflow",
      "Document upload through consumer portal",
    ],
    requirements: [
      "Consumer portal registration",
      "Complainant details and jurisdiction",
      "Signed complaint and annexures",
      "User confirmation before payment/submission",
    ],
    implementationMode: "portal-assist",
  },
];

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
  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";
  const serviceTier = process.env.OPENAI_SERVICE_TIER || "flex";
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
      service_tier: serviceTier,
      instructions:
        "You are Caseway Legal Desk, a careful Indian legal information assistant. Provide practical, concise guidance for Indian legal procedures. Do not claim to be a lawyer, do not draft final filings as legal advice, and always recommend review by an enrolled advocate for filings, notices, deadlines, criminal matters, or court strategy. Use plain English with occasional Hindi labels only when natural.",
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

export function getLegalAutomationWorkflows() {
  return {
    integrations: governmentIntegrations,
    workflows: legalAutomationWorkflows.map((workflow) => ({
      ...withoutFields(workflow),
      requiredFieldCount: workflow.fields.filter((field) => field.required).length,
      integrations: workflow.integrationIds
        .map((id) => governmentIntegrations.find((integration) => integration.id === id))
        .filter(Boolean),
    })),
  };
}

export function createLegalAutomationTurn(body: LegalAutomationRequest) {
  const message = body.message?.trim() || "";
  const workflow = resolveAutomationWorkflow(body.workflowId, message);
  const integration = resolveIntegration(body.integrationId, workflow);
  const collected = normalizeCollectedFields(body.collected || {}, workflow, message);
  const missingFields = workflow.fields.filter((field) => field.required && !collected[field.id]?.trim());
  const completion = Math.round(
    ((workflow.fields.length - missingFields.length) / workflow.fields.length) * 100,
  );
  const nextField = missingFields[0] || null;
  const readyToReview = missingFields.length === 0;

  return {
    ok: true as const,
    data: {
      id: `agent_${Date.now()}`,
      workflow: {
        ...workflow,
        integrations: workflow.integrationIds
          .map((id) => governmentIntegrations.find((item) => item.id === id))
          .filter(Boolean),
      },
      integration,
      collected,
      missingFields,
      nextQuestion: nextField?.question || "I have enough information to prepare the filing packet for your review.",
      completion,
      readyToReview,
      draftPacket: readyToReview ? buildFilingPacket(workflow, collected) : null,
      actions: readyToReview
        ? makeIntegrationActions(integration)
        : ["Answer the next question", "Upload or paste supporting details", "Review before any submission"],
      guardrails: makeAutomationGuardrails(workflow, integration),
      createdAt: new Date().toISOString(),
    },
  };
}

export async function createOpenAILegalAutomationTurn(body: LegalAutomationRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const message = body.message?.trim() || "";
  if (!apiKey || !message) {
    return createLegalAutomationTurn(body);
  }

  const workflow = resolveAutomationWorkflow(body.workflowId, message);
  if (isWorkflowIntentOnly(message, workflow)) {
    return createLegalAutomationTurn(body);
  }

  const current = body.collected || {};
  const missingFields = workflow.fields.filter((field) => field.required && !current[field.id]?.trim());
  if (missingFields.length === 0) {
    return createLegalAutomationTurn(body);
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";
  const serviceTier = process.env.OPENAI_SERVICE_TIER || "flex";
  const extractionPrompt = [
    "Extract filing intake values from the user's message for this Indian legal workflow.",
    "Return only a JSON object. Use field ids as keys. Include only values that are explicitly stated or clearly implied. Do not invent missing information.",
    `Workflow: ${workflow.name}`,
    `Forum: ${workflow.forum}`,
    `Fields: ${workflow.fields.map((field) => `${field.id} (${field.label}): ${field.question}`).join("; ")}`,
    `User message: ${message}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      service_tier: serviceTier,
      instructions:
        "You are Caseway's filing intake extractor for Indian legal and government workflows. Extract user-provided facts into the requested schema with high precision. Return JSON only.",
      input: extractionPrompt,
      max_output_tokens: 500,
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
    throw new Error(data.error?.message || "OpenAI extraction failed.");
  }

  const outputText =
    data.output_text ||
    data.output
      ?.flatMap((item) => item.content || [])
      .map((content) => content.text)
      .filter(Boolean)
      .join("\n") ||
    "{}";
  const extracted = parseExtractedFields(outputText, workflow);
  const merged = { ...current, ...extracted };

  if (Object.keys(extracted).length === 0) {
    return createLegalAutomationTurn(body);
  }

  return createLegalAutomationTurn({
    ...body,
    message: "",
    workflowId: workflow.id,
    collected: merged,
  });
}

function withoutFields(workflow: LegalAutomationWorkflow) {
  return {
    id: workflow.id,
    name: workflow.name,
    forum: workflow.forum,
    description: workflow.description,
    adapter: workflow.adapter,
    estimatedTime: workflow.estimatedTime,
    requiredReview: workflow.requiredReview,
    integrationIds: workflow.integrationIds,
  };
}

export function submitLegalFiling(body: FilingSubmissionRequest) {
  const workflow = legalAutomationWorkflows.find((item) => item.id === body.workflowId);
  if (!workflow) {
    return { ok: false as const, error: badRequest("A valid workflowId is required.", "workflowId") };
  }
  const integration = resolveIntegration(body.integrationId, workflow);
  if (!body.consent) {
    return { ok: false as const, error: badRequest("User consent is required before submission.", "consent") };
  }

  const collected = body.collected || {};
  const missingField = workflow.fields.find((field) => field.required && !collected[field.id]?.trim());
  if (missingField) {
    return { ok: false as const, error: badRequest(`${missingField.label} is required.`, missingField.id) };
  }

  return {
    ok: true as const,
    data: {
      id: `filing_${workflow.id}_${Date.now()}`,
      workflowId: workflow.id,
      integrationId: integration.id,
      status:
        integration.implementationMode === "api-adapter"
          ? "ready_for_partner_api_submission"
          : integration.implementationMode === "data-fetch"
            ? "ready_for_consent_data_fetch"
            : "ready_for_guided_portal_handoff",
      adapter: integration.id,
      forum: integration.name,
      packet: buildFilingPacket(workflow, collected),
      auditTrail: makeSubmissionAuditTrail(integration),
      nextStep: makeIntegrationNextStep(integration),
      createdAt: new Date().toISOString(),
    },
  };
}

function resolveIntegration(
  integrationId: GovernmentIntegration["id"] | undefined,
  workflow: LegalAutomationWorkflow,
) {
  const requested = governmentIntegrations.find(
    (integration) => integration.id === integrationId && workflow.integrationIds.includes(integration.id),
  );
  if (requested) return requested;

  return (
    governmentIntegrations.find((integration) => integration.id === workflow.integrationIds[0]) ||
    governmentIntegrations[0]
  );
}

function resolveAutomationWorkflow(
  workflowId: LegalAutomationWorkflow["id"] | undefined,
  message: string,
) {
  const explicit = legalAutomationWorkflows.find((workflow) => workflow.id === workflowId);
  if (explicit) return explicit;

  const lower = message.toLowerCase();
  if (lower.includes("tax") || lower.includes("itr") || lower.includes("income return")) {
    return legalAutomationWorkflows[0];
  }
  if (lower.includes("consumer") || lower.includes("refund") || lower.includes("warranty")) {
    return legalAutomationWorkflows[1];
  }
  if (lower.includes("notice") || lower.includes("reply")) {
    return legalAutomationWorkflows[2];
  }
  if (lower.includes("court") || lower.includes("petition") || lower.includes("file")) {
    return legalAutomationWorkflows[3];
  }
  return legalAutomationWorkflows[0];
}

function normalizeCollectedFields(
  current: Record<string, string>,
  workflow: LegalAutomationWorkflow,
  message: string,
) {
  const collected = { ...current };
  const trimmed = message.trim();
  if (!trimmed) return collected;
  if (Object.keys(collected).length === 0 && isWorkflowIntentOnly(trimmed, workflow)) {
    return collected;
  }

  const missingField = workflow.fields.find((field) => field.required && !collected[field.id]?.trim());
  if (missingField) {
    collected[missingField.id] = trimmed;
  }
  return collected;
}

function parseExtractedFields(outputText: string, workflow: LegalAutomationWorkflow) {
  const jsonMatch = outputText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return {};

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    const fieldIds = new Set(workflow.fields.map((field) => field.id));
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([key, value]) => fieldIds.has(key) && typeof value === "string" && value.trim().length > 0)
        .map(([key, value]) => [key, String(value).trim()]),
    );
  } catch {
    return {};
  }
}

function isWorkflowIntentOnly(message: string, workflow: LegalAutomationWorkflow) {
  const lower = message.toLowerCase();
  if (workflow.id === "income_tax_return") {
    return (
      (lower.includes("file") || lower.includes("prepare")) &&
      (lower.includes("tax") || lower.includes("itr") || lower.includes("return")) &&
      !/\b(ay|fy|20\d{2}|[a-z]{5}\d{4}[a-z])\b/i.test(message)
    );
  }
  if (workflow.id === "consumer_complaint") {
    return lower.includes("consumer") && (lower.includes("complaint") || lower.includes("refund"));
  }
  if (workflow.id === "legal_notice_reply") {
    return lower.includes("notice") && lower.includes("reply");
  }
  if (workflow.id === "court_filing") {
    return lower.includes("court") || lower.includes("filing packet");
  }
  return false;
}

function buildFilingPacket(workflow: LegalAutomationWorkflow, collected: Record<string, string>) {
  const fields = workflow.fields.map((field) => ({
    id: field.id,
    label: field.label,
    value: collected[field.id] || "",
    sensitive: Boolean(field.sensitive),
  }));

  return {
    title: `${workflow.name} packet`,
    forum: workflow.forum,
    adapter: workflow.adapter,
    mode: "draft_before_submission",
    fields,
    declaration:
      "The user must verify every detail, attach supporting documents, complete identity/signature requirements, and approve final submission.",
    payloadPreview: Object.fromEntries(fields.map((field) => [field.id, field.value])),
  };
}

function makeIntegrationActions(integration: GovernmentIntegration) {
  if (integration.implementationMode === "api-adapter") {
    return ["Review generated packet", "Confirm consent", "Submit through registered partner API"];
  }
  if (integration.implementationMode === "data-fetch") {
    return ["Review data request", "Confirm consent", "Fetch documents through API"];
  }
  return ["Review generated packet", "Open portal handoff", "Complete final authenticated portal step"];
}

function makeAutomationGuardrails(
  workflow: LegalAutomationWorkflow,
  integration: GovernmentIntegration,
) {
  return [
    "The agent can collect facts, prepare forms, and queue a filing payload, but cannot provide final legal advice.",
    workflow.requiredReview,
    `${integration.name} access mode: ${integration.access}.`,
    "Real submission must require explicit user consent, authentication, audit logging, and portal/API authorization.",
    "Sensitive identifiers should be encrypted in storage and masked in UI logs.",
  ];
}

function makeSubmissionAuditTrail(integration: GovernmentIntegration) {
  const base = [
    "User completed guided chat intake.",
    "System generated structured filing payload.",
    "User consent recorded for selected integration route.",
  ];

  if (integration.implementationMode === "api-adapter") {
    return [...base, "Packet prepared for registered partner API submission."];
  }
  if (integration.implementationMode === "data-fetch") {
    return [...base, "Consent-based government data fetch prepared."];
  }
  return [...base, "Portal handoff prepared for final human-authenticated step."];
}

function makeIntegrationNextStep(integration: GovernmentIntegration) {
  if (integration.implementationMode === "api-adapter") {
    return "Add registered credentials, schema validation, OTP/e-verification, and acknowledgement capture before live API submission.";
  }
  if (integration.implementationMode === "data-fetch") {
    return "Connect the API Setu/DigiLocker consent flow, callback, token exchange, and document storage before fetching live data.";
  }
  return "Open the official portal with the generated packet, then let the user complete login, upload, payment, signature, and final submit.";
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
      upiIntent: `upi://pay?pa=caseway@upi&pn=Caseway&am=${amount}&cu=INR`,
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
  if (
    lower.includes("fir") ||
    lower.includes("bail") ||
    lower.includes("police") ||
    lower.includes("ipc") ||
    lower.includes("bns") ||
    lower.includes("indian penal code") ||
    lower.includes("bharatiya nyaya sanhita")
  ) return "Criminal";
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
  if (matterType === "Criminal") {
    return ["Identify FIR/complaint number, sections, police station, and court.", "Collect timeline, witnesses, notices, orders, and ID proof.", ...common];
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
