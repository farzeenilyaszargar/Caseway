import { NextRequest, NextResponse } from "next/server";
import { createChatResponse, createOpenAIChatResponse, type ChatRequest } from "../../lib/backend";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as ChatRequest;
  const result = await createOpenAIChatResponse(body).catch(() => createChatResponse(body));

  if (!result.ok) {
    return NextResponse.json(result.error, { status: 400 });
  }

  return NextResponse.json(result.data);
}
