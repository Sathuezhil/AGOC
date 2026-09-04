import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { createOffer, listOffers } from "@/lib/offers";

function revalidateOffers() {
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/admin/offers");
  revalidatePath("/services", "layout");
  revalidatePath("/ar/services", "layout");
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listOffers({ includeHidden: true });
  return NextResponse.json({ ok: true, items });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = (await request.json()) as {
      serviceSlug?: string;
      badge?: string;
      description?: string;
      ctaLabel?: string;
      hidden?: boolean;
    };

    const serviceSlug = body.serviceSlug?.trim() ?? "";
    if (!serviceSlug) {
      return NextResponse.json(
        { ok: false, error: "Select a service for this offer." },
        { status: 400 },
      );
    }

    const item = await createOffer({
      serviceSlug,
      badge: body.badge?.trim() || "",
      description: body.description?.trim() || "",
      ctaLabel: body.ctaLabel?.trim() || "Book now",
      hidden: Boolean(body.hidden),
    });

    revalidateOffers();
    await logActivity({
      action: "offer.create",
      actorEmail: session!.email,
      entity: "offer",
      entityId: item.id,
      summary: `Created offer for “${item.title}”${item.badge ? ` (${item.badge})` : ""}.`,
    });
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not create offer.",
      },
      { status: 400 },
    );
  }
}
