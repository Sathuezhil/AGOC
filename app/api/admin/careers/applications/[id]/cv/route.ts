import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { requireAdminApi } from "@/lib/admin-guard";
import { getApplication } from "@/lib/careers";
import { cvStoragePath } from "@/lib/cv-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const application = await getApplication(id);
  if (!application?.cvStoredName) {
    return NextResponse.json({ ok: false, error: "No CV on file." }, { status: 404 });
  }

  try {
    const buffer = await readFile(cvStoragePath(application.cvStoredName));
    const filename = application.cvOriginalName || "cv.pdf";
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "CV file missing." }, { status: 404 });
  }
}
