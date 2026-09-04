import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { listApplications } from "@/lib/careers";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listApplications();
  return NextResponse.json({ ok: true, items });
}
