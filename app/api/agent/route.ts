import { NextRequest, NextResponse } from "next/server";
import {
  createOpenAILegalAutomationTurn,
  createLegalAutomationTurn,
  getLegalAutomationWorkflows,
  type LegalAutomationRequest,
} from "../../lib/backend";

export async function GET() {
  return NextResponse.json(getLegalAutomationWorkflows());
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as LegalAutomationRequest;
  const result = await createOpenAILegalAutomationTurn(body).catch(() => createLegalAutomationTurn(body));

  return NextResponse.json(result.data);
}
