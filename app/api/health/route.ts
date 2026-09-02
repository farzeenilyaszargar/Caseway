import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "NyayLink backend",
    version: "0.2.0",
    capabilities: [
      "chat-intake",
      "guided-intake",
      "lawyer-search",
      "consultation-booking",
      "payment-orders",
      "case-tracking",
      "workflow-tools",
      "document-scan",
    ],
    timestamp: new Date().toISOString(),
  });
}
