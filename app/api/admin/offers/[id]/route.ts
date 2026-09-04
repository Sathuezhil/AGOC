import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { deleteOffer, updateOffer } from "@/lib/offers";

function revalidateOffers() {
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/admin/offers");
  revalidatePath("/services", "layout");
  revalidatePath("/ar/services", "layout");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  try {
    const body = (await request.json()) as {
      serviceSlug?: string;
      badge?: string;
      description?: string;
      ctaLabel?: string;
      hidden?: boolean;
      sortOrder?: number;
    };

    if (body.serviceSlug !== undefined && !body.serviceSlug.trim()) {
      return NextResponse.json(
        { ok: false, error: "Select a service for this offer." },
        { status: 400 },
      );
    }

    const item = await updateOffer(id, body);
    if (!item) {
      return NextResponse.json({ ok: false, error: "Offer not found." }, { status: 404 });
    }

    revalidateOffers();
    await logActivity({
      action: "offer.update",
      actorEmail: session!.email,
      entity: "offer",
      entityId: item.id,
      summary: `Updated offer “${item.title}”.`,
    });
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not update offer.",
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
  const ok = await deleteOffer(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Offer not found." }, { status: 404 });
  }
  revalidateOffers();
  await logActivity({
    action: "offer.delete",
    actorEmail: session!.email,
    entity: "offer",
    entityId: id,
    summary: `Deleted offer ${id}.`,
  });
  return NextResponse.json({ ok: true });
}
