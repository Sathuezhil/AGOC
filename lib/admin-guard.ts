import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

export async function getAdminSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 }),
    };
  }
  return { session, error: null };
}
