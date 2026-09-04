import { GridFSBucket, type GridFSFile } from "mongodb";
import { getDb } from "./db";
import { mediaSrc, srcToFilename } from "./media-path";

export {
  mediaSrc,
  normalizeMediaSrc,
  publicToMediaSrc,
  rewriteImageRefs,
  srcToFilename,
  sameMediaSrc,
  uniqueMediaSrcs,
} from "./media-path";
const BUCKET = "media";
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

export type MediaFile = {
  src: string;
  name: string;
  filename: string;
  uploaded: boolean;
  deletedAt?: string;
};

export async function mediaBucket() {
  return new GridFSBucket(await getDb(), { bucketName: BUCKET });
}

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function contentType(name: string) {
  switch (extOf(name)) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
}

export function mediaContentType(name: string, stored?: string) {
  if (stored && stored.startsWith("image/")) return stored;
  return contentType(name);
}

function toMediaFile(file: GridFSFile, deleted = false): MediaFile {
  const key = file.filename.replace(/^\/+/, "");
  return {
    src: mediaSrc(file.filename),
    name: file.filename.split("/").pop() || file.filename,
    filename: key,
    uploaded: file.metadata?.kind === "upload",
    ...(deleted && typeof file.metadata?.deletedAt === "string"
      ? { deletedAt: file.metadata.deletedAt }
      : {}),
  };
}

export async function listMedia(): Promise<MediaFile[]> {
  const bucket = await mediaBucket();
  const files = await bucket
    .find({ "metadata.deleted": { $ne: true } })
    .sort({ filename: 1 })
    .toArray();
  const seen = new Set<string>();
  const items: MediaFile[] = [];
  for (const file of files) {
    const key = file.filename.replace(/^\/+/, "");
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(toMediaFile(file));
  }
  return items;
}

export async function listDeletedMedia(): Promise<MediaFile[]> {
  const bucket = await mediaBucket();
  const files = await bucket
    .find({ "metadata.deleted": true })
    .sort({ "metadata.deletedAt": -1, filename: 1 })
    .toArray();
  const seen = new Set<string>();
  const items: MediaFile[] = [];
  for (const file of files) {
    const key = file.filename.replace(/^\/+/, "");
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(toMediaFile(file, true));
  }
  return items;
}

async function setMediaDeleted(file: GridFSFile, deleted: boolean) {
  const db = await getDb();
  if (deleted) {
    await db.collection(`${BUCKET}.files`).updateOne(
      { _id: file._id },
      {
        $set: {
          "metadata.deleted": true,
          "metadata.deletedAt": new Date().toISOString(),
        },
      },
    );
    return;
  }
  await db.collection(`${BUCKET}.files`).updateOne(
    { _id: file._id },
    { $unset: { "metadata.deleted": "", "metadata.deletedAt": "" } },
  );
}

export async function findMediaFile(filename: string): Promise<GridFSFile | null> {
  const bucket = await mediaBucket();
  const files = await bucket.find({ filename }).limit(1).toArray();
  return files[0] ?? null;
}

export async function saveBuffer(opts: {
  filename: string;
  buffer: Buffer;
  kind: "seed" | "upload";
  contentType?: string;
}) {
  const existing = await findMediaFile(opts.filename);
  const bucket = await mediaBucket();
  if (existing) {
    await bucket.delete(existing._id);
  }
  await new Promise<void>((resolve, reject) => {
    const stream = bucket.openUploadStream(opts.filename, {
      metadata: {
        kind: opts.kind,
        contentType: opts.contentType || contentType(opts.filename),
      },
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve());
    stream.end(opts.buffer);
  });
  return mediaSrc(opts.filename);
}

export async function saveUpload(file: File) {
  const ext = extOf(file.name);
  if (!ALLOWED.has(ext)) {
    throw new Error("Use a JPG, PNG, WEBP, GIF, or SVG image.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be under 8 MB.");
  }
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const filename = `uploads/${Date.now()}-${safe}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  return saveBuffer({
    filename,
    buffer,
    kind: "upload",
    contentType: file.type || contentType(filename),
  });
}

export async function deleteMedia(src: string) {
  const filename = srcToFilename(src);
  if (!filename) throw new Error("Invalid image path.");
  const file = await findMediaFile(filename);
  if (!file) throw new Error("Image not found.");
  if (file.metadata?.deleted === true) {
    throw new Error("Image is already in the recycle bin.");
  }
  await setMediaDeleted(file, true);
  const db = await getDb();
  await db.collection("media_deleted").updateOne(
    { filename },
    { $set: { filename, deletedAt: new Date().toISOString() } },
    { upsert: true },
  );
}

export async function restoreMedia(src: string) {
  const filename = srcToFilename(src);
  if (!filename) throw new Error("Invalid image path.");
  const file = await findMediaFile(filename);
  if (!file) throw new Error("Image not found.");
  if (file.metadata?.deleted !== true) {
    throw new Error("Image is not in the recycle bin.");
  }
  await setMediaDeleted(file, false);
  const db = await getDb();
  await db.collection("media_deleted").deleteOne({ filename });
}

export async function permanentlyDeleteMedia(src: string) {
  const filename = srcToFilename(src);
  if (!filename) throw new Error("Invalid image path.");
  const file = await findMediaFile(filename);
  if (!file) throw new Error("Image not found.");
  if (file.metadata?.deleted !== true) {
    throw new Error("Move the image to the recycle bin before deleting permanently.");
  }
  const bucket = await mediaBucket();
  await bucket.delete(file._id);
  const db = await getDb();
  await db.collection("media_deleted").updateOne(
    { filename },
    { $set: { filename, deletedAt: new Date().toISOString() } },
    { upsert: true },
  );
}

/** @deprecated use deleteMedia */
export async function deleteUpload(src: string) {
  return deleteMedia(src);
}
