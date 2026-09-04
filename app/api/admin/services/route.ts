import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { getServices, upsertService, type Service } from "@/lib/services";
import { revalidateSite } from "@/lib/revalidate";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await getServices();
  return NextResponse.json({ ok: true, items });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  try {
    const body = (await request.json()) as Service;
    if (!body.title?.trim()) {
      return NextResponse.json({ ok: false, error: "Title is required." }, { status: 400 });
    }
    const item = await upsertService(body);
    revalidateSite();
    await logActivity({
      action: "service.create",
      actorEmail: session!.email,
      entity: "service",
      entityId: item.slug,
      summary: `Created service “${item.title}”.`,
    });
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not create." },
      { status: 400 },
    );
  }
}
