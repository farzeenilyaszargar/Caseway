import { NextRequest, NextResponse } from "next/server";
import { submitLegalFiling, type FilingSubmissionRequest } from "../../../lib/backend";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as FilingSubmissionRequest;
  const result = submitLegalFiling(body);

  if (!result.ok) {
    return NextResponse.json(result.error, { status: 400 });
  }

  return NextResponse.json(result.data, { status: 202 });
}
