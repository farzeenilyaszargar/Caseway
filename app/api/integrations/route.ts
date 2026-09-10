import { NextResponse } from "next/server";
import { governmentIntegrations } from "../../lib/backend";
import { buildConnectorCatalog } from "../../lib/orchestration/connectors";

export async function GET() {
  return NextResponse.json({
    integrations: governmentIntegrations,
    connectorCatalog: buildConnectorCatalog(),
  });
}
