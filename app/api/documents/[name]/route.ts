import { NextResponse } from "next/server";
import { PROFILE_DOCUMENT } from "@/lib/documents-server";
import { readStoredFile } from "@/lib/file-store";
import { profileDownloadName, profilePdfPath } from "@/lib/profile-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (name !== PROFILE_DOCUMENT) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  const stored = await readStoredFile("documents", PROFILE_DOCUMENT).catch(() => null);
  if (!stored) return NextResponse.redirect(new URL(profilePdfPath, request.url));

  return new NextResponse(new Uint8Array(stored.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${profileDownloadName}"`,
      "Content-Length": String(stored.buffer.length),
      "Cache-Control": "public, max-age=300, must-revalidate",
    },
  });
}
