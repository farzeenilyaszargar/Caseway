import { NextResponse } from "next/server";
import { getLegalAutomationWorkflows } from "../../lib/backend";
import { describeAgentRuntime } from "../../lib/orchestration/agent-runtime";
import { buildConnectorCatalog } from "../../lib/orchestration/connectors";

export async function GET() {
  return NextResponse.json({
    platform: "Caseway AI orchestration",
    runtime: describeAgentRuntime(),
    connectors: buildConnectorCatalog(),
    registry: getLegalAutomationWorkflows(),
    constraints: [
      "Live government submission remains disabled unless a connector is explicitly production-ready.",
      "CAPTCHA, portal login, payment, e-sign, DSC, and final government submission require human action.",
      "LLMs can classify, extract, explain, and draft; deterministic code controls validation, consent, audit, and irreversible actions.",
    ],
  });
}
