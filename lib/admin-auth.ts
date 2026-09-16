import { readEnv } from "./bindings";

export const ADMIN_COOKIE = "pl_admin";
const SESSION_HOURS = 12;

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Length-independent comparison, so a wrong password leaks no timing signal. */
function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i += 1) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}

function signingSecret(): string {
  // One variable is enough to get started; set ADMIN_SESSION_SECRET too if you
  // want existing sessions to survive a password change.
  const secret = readEnv("ADMIN_SESSION_SECRET") ?? readEnv("ADMIN_PASSWORD");
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to `.dev.vars` (local) or to the Worker's secrets (deployed)."
    );
  }
  return secret;
}

export function adminPasswordConfigured(): boolean {
  return Boolean(readEnv("ADMIN_PASSWORD"));
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(signingSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(mac);
}

export function checkPassword(candidate: string): boolean {
  const expected = readEnv("ADMIN_PASSWORD");
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export async function createSessionCookie(): Promise<string> {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expiresAt);
  const token = `${payload}.${await sign(payload)}`;
  return [
    `${ADMIN_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Secure",
    `Max-Age=${SESSION_HOURS * 60 * 60}`,
  ].join("; ");
}

export function clearSessionCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`;
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return undefined;
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const token = readCookie(request, ADMIN_COOKIE);
  if (!token) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  try {
    return safeEqual(mac, await sign(payload));
  } catch {
    return false;
  }
}

/** Returns a 401 response when the request has no valid admin session. */
export async function requireAdmin(request: Request): Promise<Response | null> {
  if (await isAuthenticated(request)) return null;
  return Response.json({ error: "Not signed in." }, { status: 401 });
}
