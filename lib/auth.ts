const encoder = new TextEncoder();
const COOKIE = "agoc_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

export type Session = {
  email: string;
  role: "admin";
  exp: number;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is not set.");
  }
  return value;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(email: string) {
  const payload: Session = {
    email: email.toLowerCase(),
    role: "admin",
    exp: Date.now() + MAX_AGE * 1000,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmac(body);
  return `${body}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = await hmac(body);
  if (expected !== signature) return null;
  try {
    const json = new TextDecoder().decode(fromBase64Url(body));
    const session = JSON.parse(json) as Session;
    if (session.role !== "admin" || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE,
    },
  };
}

export const SESSION_COOKIE = COOKIE;
