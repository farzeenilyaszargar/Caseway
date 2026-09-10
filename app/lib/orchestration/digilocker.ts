import { createAuditEvent } from "./risk-security";

type DigilockerTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

export type DigilockerIssuedDocument = {
  name: string;
  type?: string;
  issuer?: string;
  uri?: string;
  issuedOn?: string;
  source: "digilocker";
  verificationState: "verified";
};

export function getDigilockerConfig() {
  const baseUrl = process.env.DIGILOCKER_BASE_URL || "https://api.digitallocker.gov.in";
  const authorizeUrl =
    process.env.DIGILOCKER_AUTHORIZE_URL || `${baseUrl}/public/oauth2/1/authorize`;
  const tokenUrl = process.env.DIGILOCKER_TOKEN_URL || `${baseUrl}/public/oauth2/1/token`;
  const documentsUrl =
    process.env.DIGILOCKER_DOCUMENTS_URL || `${baseUrl}/public/oauth2/2/files/issued`;
  const userUrl = process.env.DIGILOCKER_USER_URL || `${baseUrl}/public/oauth2/1/user`;

  return {
    clientId: process.env.DIGILOCKER_CLIENT_ID || "",
    clientSecret: process.env.DIGILOCKER_CLIENT_SECRET || "",
    redirectUri: process.env.DIGILOCKER_REDIRECT_URI || "",
    scope: process.env.DIGILOCKER_SCOPE || "files.issued files.uploaded",
    authorizeUrl,
    tokenUrl,
    documentsUrl,
    userUrl,
    configured: Boolean(
      process.env.DIGILOCKER_CLIENT_ID &&
        process.env.DIGILOCKER_CLIENT_SECRET &&
        process.env.DIGILOCKER_REDIRECT_URI,
    ),
  };
}

export function buildDigilockerAuthorizationUrl(state: string) {
  const config = getDigilockerConfig();
  if (!config.configured) {
    return { ok: false as const, error: "DigiLocker requester credentials are not configured." };
  }

  const url = new URL(config.authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", config.scope);

  return { ok: true as const, url: url.toString() };
}

export async function exchangeDigilockerCode(code: string) {
  const config = getDigilockerConfig();
  if (!config.configured) {
    throw new Error("DigiLocker requester credentials are not configured.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json().catch(() => ({}))) as DigilockerTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "DigiLocker token exchange failed.");
  }

  const now = Date.now();
  const expiresIn = Number(data.expires_in || 3600);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type || "Bearer",
    scope: data.scope || config.scope,
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + expiresIn * 1000).toISOString(),
    auditEvent: createAuditEvent("digilocker_token_exchanged", "digilocker-adapter", {
      scope: data.scope || config.scope,
    }),
  };
}

export async function fetchDigilockerProfile(accessToken: string) {
  const config = getDigilockerConfig();
  const response = await fetch(config.userUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) return null;

  return {
    subject: String(data.id || data.sub || data.digilockerid || ""),
    name: typeof data.name === "string" ? data.name : undefined,
  };
}

export async function fetchDigilockerIssuedDocuments(accessToken: string) {
  const config = getDigilockerConfig();
  const response = await fetch(config.documentsUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json().catch(() => ({}))) as {
    items?: Array<Record<string, unknown>>;
    files?: Array<Record<string, unknown>>;
    documents?: Array<Record<string, unknown>>;
    error?: string;
    error_description?: string;
  };

  if (!response.ok) {
    throw new Error(data.error_description || data.error || "DigiLocker document fetch failed.");
  }

  const items = data.items || data.files || data.documents || [];
  return items.map((item): DigilockerIssuedDocument => ({
    name: String(item.name || item.description || item.doctype || "DigiLocker document"),
    type: typeof item.type === "string" ? item.type : typeof item.doctype === "string" ? item.doctype : undefined,
    issuer: typeof item.issuer === "string" ? item.issuer : typeof item.issuerid === "string" ? item.issuerid : undefined,
    uri: typeof item.uri === "string" ? item.uri : undefined,
    issuedOn: typeof item.date === "string" ? item.date : typeof item.issuedon === "string" ? item.issuedon : undefined,
    source: "digilocker",
    verificationState: "verified",
  }));
}
