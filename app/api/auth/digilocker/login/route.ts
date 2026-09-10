import { NextResponse } from "next/server";
import { createDigilockerState } from "../../../../lib/auth/session";
import { buildDigilockerAuthorizationUrl, getDigilockerConfig } from "../../../../lib/orchestration/digilocker";

export async function GET() {
  const state = await createDigilockerState();
  const authorization = buildDigilockerAuthorizationUrl(state);

  if (!authorization.ok) {
    return NextResponse.json(
      {
        error: authorization.error,
        connector: "digilocker_apisetu",
        setupRequired: {
          env: ["DIGILOCKER_CLIENT_ID", "DIGILOCKER_CLIENT_SECRET", "DIGILOCKER_REDIRECT_URI"],
          config: getDigilockerConfig(),
        },
      },
      { status: 503 },
    );
  }

  return NextResponse.redirect(authorization.url);
}
