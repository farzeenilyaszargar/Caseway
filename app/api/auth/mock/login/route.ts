import { NextResponse } from "next/server";
import { createSessionId, setCasewaySession } from "../../../../lib/auth/session";
import { mockUser } from "../../../../lib/account/mock";

export async function POST() {
  const now = Date.now();
  await setCasewaySession({
    id: createSessionId(),
    provider: "mock",
    subject: "demo-user",
    name: mockUser.name,
    email: mockUser.email,
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 1000 * 60 * 60 * 8).toISOString(),
    scope: "profile filings documents settings",
  });

  return NextResponse.json({ ok: true, redirectTo: "/profile" });
}
