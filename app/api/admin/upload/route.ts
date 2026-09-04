import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { deleteMedia, saveUpload } from "@/lib/media";
import { sameMediaSrc } from "@/lib/media-path";
import { revalidateSite } from "@/lib/revalidate";

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Choose an image." }, { status: 400 });
    }
    const replace = String(form.get("replace") || "").trim();
    const src = await saveUpload(file);

    if (replace && !sameMediaSrc(replace, src)) {
      try {
        await deleteMedia(replace);
      } catch {
        // New upload already saved; keep it even if old delete fails
      }
    }

    revalidateSite();
    await logActivity({
      action: replace ? "media.replace" : "media.upload",
      actorEmail: session!.email,
      entity: "media",
      entityId: src,
      summary: replace ? "Replaced / cropped an image." : `Uploaded image “${file.name}”.`,
    });
    return NextResponse.json({ ok: true, src });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
