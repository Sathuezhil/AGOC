import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const db = await getDb();
    await db.command({ ping: 1 });
    const [services, enquiries, users, media] = await Promise.all([
      db.collection("services").countDocuments(),
      db.collection("enquiries").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("media.files").countDocuments(),
    ]);
    return NextResponse.json({
      ok: true,
      database: db.databaseName,
      services,
      enquiries,
      users,
      images: media,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "MongoDB unavailable",
      },
      { status: 503 },
    );
  }
}
