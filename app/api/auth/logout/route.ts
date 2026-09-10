import { NextResponse } from "next/server";
import { clearCasewaySession } from "../../../lib/auth/session";

export async function POST() {
  await clearCasewaySession();
  return NextResponse.json({ ok: true });
}
