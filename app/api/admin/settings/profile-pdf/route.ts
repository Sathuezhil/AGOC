import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { updateSiteProfilePdf } from "@/lib/content";
import { cleanupOldProfileUploads, saveProfilePdf } from "@/lib/documents-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Choose a PDF file." },
        { status: 400 },
      );
    }

    const href = await saveProfilePdf(file);
    await cleanupOldProfileUploads();
    const content = await updateSiteProfilePdf(href);

    revalidatePath("/", "layout");

    const { logActivity } = await import("@/lib/activity");
    await logActivity({
      action: "settings.profile_pdf",
      actorEmail: session!.email,
      entity: "settings",
      summary: "Updated company profile PDF.",
    });

    return NextResponse.json({
      ok: true,
      companyProfilePdf: content.site.companyProfilePdf,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not save PDF.",
      },
      { status: 400 },
    );
  }
}
