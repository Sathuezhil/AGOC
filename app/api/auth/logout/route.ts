import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { cookies } from "next/headers";

export async function POST() {
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  if (session?.email) {
    await logActivity({
      action: "auth.logout",
      actorEmail: session.email,
      entity: "auth",
      summary: "Signed out of admin.",
    });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
