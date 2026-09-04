import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { addEnquiryReply, getEnquiry } from "@/lib/enquiries";
import { mailConfigured, sendEnquiryReplyEmail } from "@/lib/mail";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) {
    return NextResponse.json({ ok: false, error: "Enquiry not found." }, { status: 404 });
  }

  if (!mailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Email is not configured. Set SMTP_USER and SMTP_PASS in .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { subject?: string; message?: string };
    const subject = body.subject?.trim() || `Re: Your enquiry · ${enquiry.service}`;
    const message = body.message?.trim() || "";

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Write a reply message." },
        { status: 400 },
      );
    }
    if (message.length > 8000) {
      return NextResponse.json(
        { ok: false, error: "Reply is too long." },
        { status: 400 },
      );
    }

    await sendEnquiryReplyEmail({
      toName: enquiry.name,
      toEmail: enquiry.email,
      subject,
      body: message,
      originalMessage: enquiry.message,
      service: enquiry.service,
    });

    const saved = await addEnquiryReply(id, { subject, body: message });
    if (!saved) {
      return NextResponse.json(
        { ok: false, error: "Reply sent, but could not save to inbox." },
        { status: 500 },
      );
    }

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    await logActivity({
      action: "enquiry.reply",
      actorEmail: session!.email,
      entity: "enquiry",
      entityId: id,
      summary: `Replied to ${enquiry.name} (${enquiry.email}) about ${enquiry.service}.`,
    });

    return NextResponse.json({
      ok: true,
      item: saved.enquiry,
      reply: saved.reply,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not send reply.",
      },
      { status: 400 },
    );
  }
}
