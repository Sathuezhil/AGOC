import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { saveUpload } from "@/lib/media";
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
    const src = await saveUpload(file);
    revalidateSite();
    return NextResponse.json({ ok: true, src });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
