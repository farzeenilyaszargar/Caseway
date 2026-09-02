import { NextResponse } from "next/server";
import { listWorkflowTools } from "../../lib/backend";

export async function GET() {
  return NextResponse.json(listWorkflowTools());
}
