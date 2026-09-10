export type VaultClaim = {
  key: string;
  value: string;
  source: "user_chat" | "uploaded_document" | "government_connector" | "derived";
  confidence: number;
  verificationState: "unverified" | "self_attested" | "verified" | "conflict";
  purpose: string;
  retention: "workflow_only" | "until_expiry" | "user_profile";
  sensitive: boolean;
  capturedAt: string;
};

export function extractVaultClaims(
  collected: Record<string, string>,
  sensitiveFields: Set<string>,
  purpose: string,
) {
  return Object.entries(collected)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]): VaultClaim => ({
      key,
      value: sensitiveFields.has(key) ? maskValue(value) : value,
      source: "user_chat",
      confidence: 0.74,
      verificationState: "self_attested",
      purpose,
      retention: "workflow_only",
      sensitive: sensitiveFields.has(key),
      capturedAt: new Date().toISOString(),
    }));
}

export function createWorkflowRunSnapshot(input: {
  workflowId: string;
  connectorId: string;
  collected: Record<string, string>;
  missingFields: string[];
}) {
  return {
    id: `run_${input.workflowId}_${Date.now()}`,
    workflowId: input.workflowId,
    connectorId: input.connectorId,
    status: input.missingFields.length ? "collecting_information" : "ready_for_review",
    collectedFieldCount: Object.values(input.collected).filter((value) => value.trim().length > 0).length,
    missingFields: input.missingFields,
    consentState: "not_requested",
    retention: "delete workflow-only data after abandonment or user deletion request",
    createdAt: new Date().toISOString(),
  };
}

function maskValue(value: string) {
  const compact = value.replace(/\s+/g, "");
  if (compact.length <= 4) return "****";
  return `${"*".repeat(Math.max(4, compact.length - 4))}${compact.slice(-4)}`;
}
