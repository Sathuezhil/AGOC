import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import {
  deleteEnquiry,
  updateEnquiry,
  type EnquiryStatus,
} from "@/lib/enquiries";

const STATUSES: EnquiryStatus[] = ["new", "read", "replied", "done"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  let body: { status?: EnquiryStatus } = {};
  try {
    body = (await request.json()) as { status?: EnquiryStatus };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }
  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  const item = await updateEnquiry(id, { status: body.status });
  if (!item) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  await logActivity({
    action: "enquiry.status",
    actorEmail: session!.email,
    entity: "enquiry",
    entityId: id,
    summary: `Set enquiry from ${item.name} to “${body.status}”.`,
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;
  const ok = await deleteEnquiry(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  await logActivity({
    action: "enquiry.delete",
    actorEmail: session!.email,
    entity: "enquiry",
    entityId: id,
    summary: `Deleted enquiry ${id}.`,
  });
  return NextResponse.json({ ok: true });
}
