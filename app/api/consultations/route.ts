import { NextRequest, NextResponse } from "next/server";
import { createConsultation, type ConsultationRequest } from "../../lib/backend";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as ConsultationRequest;
  const result = createConsultation(body);

  if (!result.ok) {
    return NextResponse.json(result.error, { status: 400 });
  }

  return NextResponse.json(result.data, { status: 201 });
}
