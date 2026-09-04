import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import {
  listDeletedMedia,
  permanentlyDeleteMedia,
  restoreMedia,
} from "@/lib/media";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listDeletedMedia();
  return NextResponse.json({ ok: true, items });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  try {
    const body = (await request.json()) as { src?: string };
    if (!body.src) {
      return NextResponse.json({ ok: false, error: "Missing image." }, { status: 400 });
    }
    await restoreMedia(body.src);
    const { revalidateSite } = await import("@/lib/revalidate");
    revalidateSite();
    await logActivity({
      action: "media.restore",
      actorEmail: session!.email,
      entity: "media",
      entityId: body.src,
      summary: "Restored image from trash.",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not restore." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  try {
    const body = (await request.json()) as { src?: string };
    if (!body.src) {
      return NextResponse.json({ ok: false, error: "Missing image." }, { status: 400 });
    }
    await permanentlyDeleteMedia(body.src);
    const { revalidateSite } = await import("@/lib/revalidate");
    revalidateSite();
    await logActivity({
      action: "media.purge",
      actorEmail: session!.email,
      entity: "media",
      entityId: body.src,
      summary: "Permanently deleted image.",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not delete permanently.",
      },
      { status: 400 },
    );
  }
}
