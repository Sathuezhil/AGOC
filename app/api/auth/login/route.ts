import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookie } from "@/lib/auth";
import { authenticateAdmin } from "@/lib/users";
import { ensureSeeded } from "@/lib/seed";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    const user = await authenticateAdmin(email, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await createSessionToken(user.email);
    const cookie = sessionCookie(token);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to sign in right now." },
      { status: 500 },
    );
  }
}
