import { NextRequest, NextResponse } from "next/server";
import { findMediaFile, mediaBucket, mediaContentType, srcToFilename } from "@/lib/media";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    await ensureSeeded();
    const { key } = await params;
    const filename = srcToFilename(`/api/media/${key.map(decodeURIComponent).join("/")}`);
    const file = await findMediaFile(filename);
    if (!file) {
      return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    }
    const bucket = await mediaBucket();
    const stream = bucket.openDownloadStream(file._id);
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve());
    });
    const body = Buffer.concat(chunks);
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": mediaContentType(
          filename,
          typeof file.metadata?.contentType === "string" ? file.metadata.contentType : undefined,
        ),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(body.length),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to load image." }, { status: 500 });
  }
}
