import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import {
  createJob,
  listJobs,
  type JobType,
} from "@/lib/careers";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listJobs({ includeHidden: true });
  return NextResponse.json({ ok: true, items });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

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
    };

    const title = body.title?.trim() ?? "";
    const department = body.department?.trim() ?? "";
    const summary = body.summary?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const type = body.type ?? "full-time";

    if (!title || !department || !summary || !description) {
      return NextResponse.json(
        { ok: false, error: "Title, department, summary, and description are required." },
        { status: 400 },
      );
    }

    if (!["full-time", "part-time", "contract"].includes(type)) {
      return NextResponse.json({ ok: false, error: "Invalid job type." }, { status: 400 });
    }

    const job = await createJob({
      title,
      department,
      location: body.location?.trim() || "Dubai, UAE",
      type,
      summary,
      description,
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      hidden: Boolean(body.hidden),
    });

    revalidatePath("/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");

    await logActivity({
      action: "career_job.create",
      actorEmail: session!.email,
      entity: "career_job",
      entityId: job.id,
      summary: `Created job “${job.title}”.`,
    });

    return NextResponse.json({ ok: true, item: job });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not create job.",
      },
      { status: 400 },
    );
  }
}
