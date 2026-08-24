import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { deleteMedia, listMedia } from "@/lib/media";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listMedia();
  return NextResponse.json({ ok: true, items });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  try {
    const body = (await request.json()) as { src?: string };
    if (!body.src) {
      return NextResponse.json({ ok: false, error: "Missing image." }, { status: 400 });
    }
    await deleteMedia(body.src);
    const { revalidateSite } = await import("@/lib/revalidate");
    revalidateSite();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not delete." },
      { status: 400 },
    );
  }
}
