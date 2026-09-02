import { NextRequest, NextResponse } from "next/server";
import { createIntake, getIntakeSchema, type IntakeRequest } from "../../lib/backend";

export async function GET() {
  return NextResponse.json(getIntakeSchema());
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as IntakeRequest;
  const result = createIntake(body);

  if (!result.ok) {
    return NextResponse.json(result.error, { status: 400 });
  }

  return NextResponse.json(result.data, { status: 201 });
}
