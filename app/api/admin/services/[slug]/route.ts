import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { deleteService, getService, upsertService, type Service } from "@/lib/services";
import { revalidateSite } from "@/lib/revalidate";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  const { slug } = await params;
  const existing = await getService(slug);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  try {
    const body = (await request.json()) as Service;
    const item = await upsertService(body, slug);
    revalidateSite();
    await logActivity({
      action: "service.update",
      actorEmail: session!.email,
      entity: "service",
      entityId: item.slug,
      summary: `Updated service “${item.title}”.`,
    });
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not save." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  const { slug } = await params;
  const existing = await getService(slug);
  const ok = await deleteService(slug);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  revalidateSite();
  await logActivity({
    action: "service.delete",
    actorEmail: session!.email,
    entity: "service",
    entityId: slug,
    summary: `Deleted service “${existing?.title || slug}”.`,
  });
  return NextResponse.json({ ok: true });
}
