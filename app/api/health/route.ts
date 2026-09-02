import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "NyayLink backend",
    version: "0.2.0",
    capabilities: ["chat-intake", "lawyer-search", "consultation-booking", "workflow-tools", "document-scan"],
    timestamp: new Date().toISOString(),
  });
}
