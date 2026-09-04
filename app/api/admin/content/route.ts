import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import { getContent, saveContent, type SiteContent } from "@/lib/content";
import { revalidateSite } from "@/lib/revalidate";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const content = await getContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  try {
    const content = (await request.json()) as SiteContent;
    if (!content?.site?.name || !content?.hero?.title) {
      return NextResponse.json({ ok: false, error: "Invalid content." }, { status: 400 });
    }
    await saveContent(content);
    revalidateSite();
    await logActivity({
      action: "content.update",
      actorEmail: session!.email,
      entity: "content",
      summary: "Updated site texts / content.",
    });
    return NextResponse.json({ ok: true, content });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not save." }, { status: 500 });
  }
}
