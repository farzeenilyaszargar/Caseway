import { NextRequest, NextResponse } from "next/server";
import {
  createChatResponse,
  createOpenAIChatResponse,
  createOpenAIChatTextStream,
  type ChatRequest,
} from "../../lib/backend";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as ChatRequest;
  const wantsStream = request.nextUrl.searchParams.get("stream") === "1";

  if (wantsStream) {
    const result = await createOpenAIChatTextStream(body).catch(() => {
      const fallback = createChatResponse(body);
      if (!fallback.ok) return fallback;

      const encoder = new TextEncoder();
      return {
        ok: true as const,
        stream: new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode(fallback.data.reply));
            controller.close();
          },
        }),
      };
    });

    if (!result.ok) {
      return NextResponse.json(result.error, { status: 400 });
    }

    return new Response(result.stream, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const result = await createOpenAIChatResponse(body).catch(() => createChatResponse(body));

  if (!result.ok) {
    return NextResponse.json(result.error, { status: 400 });
  }

  return NextResponse.json(result.data);
}
