import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { deleteMedia, saveUpload } from "@/lib/media";
import { sameMediaSrc } from "@/lib/media-path";
import { revalidateSite } from "@/lib/revalidate";

export async function POST(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Choose an image." }, { status: 400 });
    }
    const replace = String(form.get("replace") || "").trim();
    const src = await saveUpload(file);

    // Cropping an existing library image → replace old file (no duplicate)
    if (replace && !sameMediaSrc(replace, src)) {
      try {
        await deleteMedia(replace);
      } catch {
        // New upload already saved; keep it even if old delete fails
      }
    }

    revalidateSite();
    return NextResponse.json({ ok: true, src });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
