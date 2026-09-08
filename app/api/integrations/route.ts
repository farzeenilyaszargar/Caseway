import { NextResponse } from "next/server";
import { governmentIntegrations } from "../../lib/backend";

export async function GET() {
  return NextResponse.json({ integrations: governmentIntegrations });
}
