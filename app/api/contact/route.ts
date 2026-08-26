import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mailConfigured, sendEnquiryEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      service?: string;
      message?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const service = body.service?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { ok: false, error: "Please complete every field." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const { addEnquiry } = await import("@/lib/enquiries");
    await addEnquiry({ name, email, phone, service, message });
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    let emailed = false;
    let mailError: string | undefined;

    if (mailConfigured()) {
      try {
        await sendEnquiryEmail({ name, email, phone, service, message });
        emailed = true;
      } catch (err) {
        console.error("[contact] enquiry saved but email failed:", err);
        mailError =
          err instanceof Error ? err.message : "Email delivery failed.";
      }
    } else {
      console.warn(
        "[contact] enquiry saved; email skipped (set SMTP_* or RESEND_API_KEY).",
      );
      mailError = "Email is not configured on the server.";
    }

    return NextResponse.json({
      ok: true,
      emailed,
      ...(mailError && !emailed ? { mailWarning: mailError } : {}),
    });
  } catch (err) {
    console.error("[contact] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Unable to send your request right now." },
      { status: 500 },
    );
  }
}
