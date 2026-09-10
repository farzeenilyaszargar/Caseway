import { NextResponse } from "next/server";
import { getCasewaySession } from "../../../lib/auth/session";
import { fetchDigilockerIssuedDocuments, getDigilockerConfig } from "../../../lib/orchestration/digilocker";
import { createAuditEvent, runActionPolicyCheck } from "../../../lib/orchestration/risk-security";

export async function GET() {
  const session = await getCasewaySession();
  if (!session?.accessToken) {
    return NextResponse.json(
      {
        error: "Connect DigiLocker before fetching documents.",
        loginUrl: "/api/auth/digilocker/login",
        configured: getDigilockerConfig().configured,
      },
      { status: 401 },
    );
  }

  const policy = runActionPolicyCheck({
    action: "fetch_data",
    consent: true,
    connectorId: "digilocker_apisetu",
  });
  const documents = await fetchDigilockerIssuedDocuments(session.accessToken);

  return NextResponse.json({
    connector: "digilocker_apisetu",
    policy,
    documents,
    auditEvents: [
      createAuditEvent("digilocker_documents_listed", "digilocker-adapter", {
        documentCount: documents.length,
        subject: session.subject,
      }),
    ],
  });
}
