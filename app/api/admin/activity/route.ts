import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { listActivity, type ActivityEntity } from "@/lib/activity";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const entity = (searchParams.get("entity") || "all") as ActivityEntity | "all";
  const query = searchParams.get("q") || "";
  const limit = Number(searchParams.get("limit") || 200);

  const items = await listActivity({ entity, query, limit });
  return NextResponse.json({ ok: true, items });
}
