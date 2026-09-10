import { cookies } from "next/headers";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const sessionCookie = "caseway_session";
const digilockerStateCookie = "caseway_digilocker_state";
const maxAgeSeconds = 60 * 60 * 8;

export type CasewaySession = {
  id: string;
  provider: "digilocker" | "mock";
  subject?: string;
  name?: string;
  email?: string;
  issuedAt: string;
  expiresAt: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  scope?: string;
};

export function createSessionId() {
  return crypto.randomUUID();
}

export async function createDigilockerState() {
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(digilockerStateCookie, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });
  return state;
}

export async function consumeDigilockerState(receivedState: string | null) {
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(digilockerStateCookie)?.value;
  cookieStore.delete(digilockerStateCookie);
  return Boolean(receivedState && expectedState && receivedState === expectedState);
}

export async function setCasewaySession(session: CasewaySession) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeSeconds,
    path: "/",
  });
}

export async function getCasewaySession() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(sessionCookie)?.value;
  if (!encoded) return null;

  const session = decodeSession(encoded);
  if (!session) return null;
  if (Date.parse(session.expiresAt) <= Date.now()) {
    cookieStore.delete(sessionCookie);
    return null;
  }
  return session;
}

export async function clearCasewaySession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie);
  cookieStore.delete(digilockerStateCookie);
}

export function publicSession(session: CasewaySession | null) {
  if (!session) return { authenticated: false as const };
  return {
    authenticated: true as const,
    id: session.id,
    provider: session.provider,
    subject: session.subject,
    name: session.name,
    email: session.email,
    scope: session.scope,
    issuedAt: session.issuedAt,
    expiresAt: session.expiresAt,
  };
}

function encodeSession(session: CasewaySession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getSessionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(session), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString("base64url")).join(".");
}

function decodeSession(encoded: string) {
  try {
    const [iv, tag, ciphertext] = encoded.split(".").map((part) => Buffer.from(part, "base64url"));
    if (!iv || !tag || !ciphertext) return null;
    const decipher = createDecipheriv("aes-256-gcm", getSessionKey(), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
    return JSON.parse(plaintext) as CasewaySession;
  } catch {
    return null;
  }
}

function getSessionKey() {
  const secret = process.env.CASEWAY_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("CASEWAY_SESSION_SECRET is required in production.");
  }
  return createHash("sha256")
    .update(secret || "caseway-local-development-session-secret")
    .digest();
}
