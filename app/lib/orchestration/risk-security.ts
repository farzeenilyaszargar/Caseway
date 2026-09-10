type ActionPolicyInput = {
  action: "chat" | "extract" | "draft" | "fetch_data" | "submit";
  consent?: boolean;
  connectorId?: string;
  submissionMode?: string;
  missingFields?: string[];
};

export type PolicyDecision = {
  allowed: boolean;
  severity: "low" | "medium" | "high";
  reasons: string[];
  requiredApprovals: string[];
};

export function runActionPolicyCheck(input: ActionPolicyInput): PolicyDecision {
  const reasons: string[] = [];
  const requiredApprovals: string[] = [];

  if (input.missingFields?.length) {
    reasons.push(`Missing required fields: ${input.missingFields.join(", ")}`);
  }

  if (input.action === "fetch_data") {
    requiredApprovals.push("Explicit consent to fetch government or identity data");
  }

  if (input.action === "submit") {
    requiredApprovals.push("Final review", "Signature or e-verification", "Payment approval where applicable");
    if (!input.consent) {
      reasons.push("Final user consent is required before any submission or portal handoff.");
    }
    if (input.submissionMode !== "official_api_submit" && input.submissionMode !== "partner_api_submit") {
      reasons.push("This connector is not enabled for live API submission; prepare a portal handoff instead.");
    }
  }

  return {
    allowed: reasons.length === 0,
    severity: input.action === "submit" || input.action === "fetch_data" ? "high" : reasons.length ? "medium" : "low",
    reasons,
    requiredApprovals,
  };
}

export function createAuditEvent(action: string, actor = "caseway-system", metadata: Record<string, unknown> = {}) {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    action,
    actor,
    metadata: redactAuditMetadata(metadata),
    createdAt: new Date().toISOString(),
  };
}

function redactAuditMetadata(metadata: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      if (/aadhaar|pan|account|token|secret|password|otp/i.test(key)) {
        return [key, "[redacted]"];
      }
      return [key, value];
    }),
  );
}
