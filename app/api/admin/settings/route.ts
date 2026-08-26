import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { createSessionToken, sessionCookie } from "@/lib/auth";
import { updateAdminCredentials } from "@/lib/users";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;

  return NextResponse.json({
    ok: true,
    email: session.email,
  });
}

export async function PUT(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;

  try {
    const body = (await request.json()) as {
      currentPassword?: string;
      email?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    const currentPassword = body.currentPassword ?? "";
    const email = body.email?.trim() ?? session.email;
    const newPassword = body.newPassword ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!currentPassword) {
      return NextResponse.json(
        { ok: false, error: "Enter your current password to save changes." },
        { status: 400 },
      );
    }

    if (newPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { ok: false, error: "New password and confirmation do not match." },
        { status: 400 },
      );
    }

    const emailChanged =
      email.trim().toLowerCase() !== session.email.toLowerCase();
    if (!emailChanged && !newPassword) {
      return NextResponse.json(
        { ok: false, error: "Change the email or set a new password." },
        { status: 400 },
      );
    }

    const updated = await updateAdminCredentials({
      currentEmail: session.email,
      currentPassword,
      nextEmail: email,
      nextPassword: newPassword || undefined,
    });

    const token = await createSessionToken(updated.email);
    const cookie = sessionCookie(token);
    const response = NextResponse.json({
      ok: true,
      email: updated.email,
      message: newPassword
        ? "Login credentials updated."
        : "Admin email updated.",
    });
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    return response;
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error ? err.message : "Could not update settings.",
      },
      { status: 400 },
    );
  }
}
