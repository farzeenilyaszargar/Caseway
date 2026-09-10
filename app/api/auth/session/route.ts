import { NextResponse } from "next/server";
import { getCasewaySession, publicSession } from "../../../lib/auth/session";

export async function GET() {
  const session = await getCasewaySession();
  return NextResponse.json(publicSession(session));
}
