import { NextRequest, NextResponse } from "next/server";
import { createDocumentScan, type DocumentScanRequest } from "../../../lib/backend";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as DocumentScanRequest;
  return NextResponse.json(createDocumentScan(body), { status: 201 });
}
