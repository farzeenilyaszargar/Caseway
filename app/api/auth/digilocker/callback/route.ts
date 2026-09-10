import { NextRequest, NextResponse } from "next/server";
import {
  consumeDigilockerState,
  createSessionId,
  setCasewaySession,
} from "../../../../lib/auth/session";
import {
  exchangeDigilockerCode,
  fetchDigilockerProfile,
} from "../../../../lib/orchestration/digilocker";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const baseUrl = new URL("/assistant", request.nextUrl.origin);

  if (error) {
    baseUrl.searchParams.set("digilocker", "denied");
    baseUrl.searchParams.set("reason", error);
    return NextResponse.redirect(baseUrl);
  }

  const validState = await consumeDigilockerState(state);
  if (!validState || !code) {
    baseUrl.searchParams.set("digilocker", "invalid_state");
    return NextResponse.redirect(baseUrl);
  }

  try {
    const token = await exchangeDigilockerCode(code);
    const profile = await fetchDigilockerProfile(token.accessToken);
    await setCasewaySession({
      id: createSessionId(),
      provider: "digilocker",
      subject: profile?.subject,
      name: profile?.name,
      issuedAt: token.issuedAt,
      expiresAt: token.expiresAt,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      tokenType: token.tokenType,
      scope: token.scope,
    });

    baseUrl.searchParams.set("digilocker", "connected");
    return NextResponse.redirect(baseUrl);
  } catch (callbackError) {
    baseUrl.searchParams.set("digilocker", "failed");
    baseUrl.searchParams.set("reason", callbackError instanceof Error ? callbackError.message : "callback_failed");
    return NextResponse.redirect(baseUrl);
  }
}
