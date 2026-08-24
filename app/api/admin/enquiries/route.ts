import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { listEnquiries } from "@/lib/enquiries";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listEnquiries();
  return NextResponse.json({ ok: true, items });
}
