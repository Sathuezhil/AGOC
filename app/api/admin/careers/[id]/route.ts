import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { deleteJob, updateJob, type JobType } from "@/lib/careers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  try {
    const body = (await request.json()) as {
      title?: string;
      department?: string;
      location?: string;
      type?: JobType;
      summary?: string;
      description?: string;
      requirements?: string[];
      hidden?: boolean;
      sortOrder?: number;
    };

    if (body.type && !["full-time", "part-time", "contract"].includes(body.type)) {
      return NextResponse.json({ ok: false, error: "Invalid job type." }, { status: 400 });
    }

    const item = await updateJob(id, body);
    if (!item) {
      return NextResponse.json({ ok: false, error: "Job not found." }, { status: 404 });
    }

    revalidatePath("/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");

    await logActivity({
      action: "career_job.update",
      actorEmail: session!.email,
      entity: "career_job",
      entityId: item.id,
      summary: `Updated job “${item.title}”.`,
    });

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not update job.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;
  const ok = await deleteJob(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Job not found." }, { status: 404 });
  }
  revalidatePath("/careers");
  revalidatePath("/ar/careers");
  revalidatePath("/admin/careers");
  await logActivity({
    action: "career_job.delete",
    actorEmail: session!.email,
    entity: "career_job",
    entityId: id,
    summary: `Deleted job ${id}.`,
  });
  return NextResponse.json({ ok: true });
}
