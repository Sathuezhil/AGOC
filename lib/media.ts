import { GridFSBucket, type GridFSFile } from "mongodb";
import { getDb } from "./db";

const BUCKET = "media";
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

export type MediaFile = {
  src: string;
  name: string;
  filename: string;
  uploaded: boolean;
};

export function mediaSrc(filename: string) {
  const clean = filename.replace(/^\/+/, "").replace(/^api\/media\//, "");
  return `/api/media/${clean.split("/").map(encodeURIComponent).join("/")}`;
}

/** Collapse broken nested paths and map /images/* → /api/media/images/* */
export function normalizeMediaSrc(src: string) {
  if (!src || typeof src !== "string") return src;
  let s = src.trim();
  if (
    !s.includes("/images") &&
    !s.includes("logo.png") &&
    !s.includes("/api/media") &&
    !s.includes("/uploads/")
  ) {
    return s;
  }

  while (s.includes("/api/media/api/media/")) {
    s = s.replaceAll("/api/media/api/media/", "/api/media/");
  }

  const nested = s.match(
    /\/(?:api\/media\/)+((?:images|uploads)\/.+|logo\.png)$/,
  );
  if (nested?.[1]) return mediaSrc(nested[1]);

  if (s.startsWith("/api/media/")) return s;
  if (s.startsWith("/images/")) return mediaSrc(s.slice(1));
  if (s === "/logo.png") return mediaSrc("logo.png");
  return s;
}

export function publicToMediaSrc(src: string) {
  return normalizeMediaSrc(src);
}

export function rewriteImageRefs<T>(value: T): T {
  const walk = (node: unknown): unknown => {
    if (typeof node === "string") return normalizeMediaSrc(node);
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
        out[key] = walk(val);
      }
      return out;
    }
    return node;
  };
  return walk(value) as T;
}

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

export async function listMedia(): Promise<MediaFile[]> {
  const bucket = await mediaBucket();
  const files = await bucket.find({}).sort({ filename: 1 }).toArray();
  return files.map((file) => ({
    src: mediaSrc(file.filename),
    name: file.filename.split("/").pop() || file.filename,
    filename: file.filename,
    uploaded: file.metadata?.kind === "upload",
  }));
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

export function srcToFilename(src: string) {
  const normalized = normalizeMediaSrc(src.split("?")[0]);
  if (normalized.startsWith("/api/media/")) {
    return decodeURIComponent(normalized.slice("/api/media/".length));
  }
  if (normalized.startsWith("/images/")) return normalized.slice(1);
  if (normalized === "/logo.png") return "logo.png";
  return normalized.replace(/^\//, "");
}
