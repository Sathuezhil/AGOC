import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import {
  deleteApplication,
  updateApplication,
  type ApplicationStatus,
} from "@/lib/careers";

const STATUSES: ApplicationStatus[] = [
  "new",
  "reviewed",
  "shortlisted",
  "closed",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const body = (await request.json()) as { status?: ApplicationStatus };
  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  const item = await updateApplication(id, { status: body.status });
  if (!item) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  revalidatePath("/admin/careers");
  await logActivity({
    action: "career_application.status",
    actorEmail: session!.email,
    entity: "career_application",
    entityId: id,
    summary: `Set application from ${item.name} to “${body.status}”.`,
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
  const ok = await deleteApplication(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  revalidatePath("/admin/careers");
  await logActivity({
    action: "career_application.delete",
    actorEmail: session!.email,
    entity: "career_application",
    entityId: id,
    summary: `Deleted career application ${id}.`,
  });
  return NextResponse.json({ ok: true });
}
