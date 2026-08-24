import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { deleteService, getService, upsertService, type Service } from "@/lib/services";
import { revalidateSite } from "@/lib/revalidate";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { error } = await requireAdminApi();
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
  const { error } = await requireAdminApi();
  if (error) return error;
  const { slug } = await params;
  const ok = await deleteService(slug);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
