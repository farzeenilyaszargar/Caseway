import { NextRequest, NextResponse } from "next/server";
import { createPaymentOrder, type PaymentRequest } from "../../lib/backend";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as PaymentRequest;
  const result = createPaymentOrder(body);

  if (!result.ok) {
    return NextResponse.json(result.error, { status: 400 });
  }

  return NextResponse.json(result.data, { status: 201 });
}
