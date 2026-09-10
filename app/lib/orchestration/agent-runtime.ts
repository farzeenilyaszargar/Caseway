export type AgentRole =
  | "router_planner"
  | "identity_agent"
  | "document_agent"
  | "form_agent"
  | "legal_rules_agent"
  | "validator"
  | "execution_agent"
  | "review_risk_agent";

export function describeAgentRuntime() {
  return {
    llmRoles: ["router_planner", "document_agent", "form_agent", "legal_rules_agent"],
    deterministicRoles: ["identity_agent", "validator", "execution_agent", "review_risk_agent"],
    invariant:
      "LLMs may classify, extract, draft, and explain; deterministic software owns validation, permissions, calculations, audit logging, and irreversible action gates.",
    approvalModel: {
      automatic: ["classify", "explain", "extract", "draft", "validate", "prepare_packet"],
      explicitConsent: ["fetch_government_documents", "reuse_sensitive_profile_data", "share_packet_with_professional"],
      finalConfirmation: ["submit", "e_verify", "pay_fee", "send_legal_notice"],
    },
  };
}
