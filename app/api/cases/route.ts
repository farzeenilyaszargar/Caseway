import { NextResponse } from "next/server";
import { getCaseDashboard } from "../../lib/backend";

export async function GET() {
  return NextResponse.json(getCaseDashboard());
}
