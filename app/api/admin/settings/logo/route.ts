import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-guard";
import { updateSiteLogo } from "@/lib/content";

export async function PUT(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = (await request.json()) as { logo?: string };
    const logo = body.logo?.trim() ?? "";
    if (!logo) {
      return NextResponse.json(
        { ok: false, error: "Choose a logo image." },
        { status: 400 },
      );
    }

    const content = await updateSiteLogo(logo);

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/login");

    return NextResponse.json({ ok: true, logo: content.site.logo });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Could not save logo.",
      },
      { status: 400 },
    );
  }
}
