import { GridFSBucket } from "mongodb";
import { getDb } from "./db";

/** Private file buckets; unlike `media`, nothing here is served by /api/media. */
export type FileBucket = "cvs" | "documents";

async function bucket(name: FileBucket) {
  return new GridFSBucket(await getDb(), { bucketName: name });
}

export async function saveStoredFile(
  name: FileBucket,
  filename: string,
  buffer: Buffer,
  contentType: string,
) {
  const b = await bucket(name);
  const existing = await b.find({ filename }).toArray();
  for (const file of existing) await b.delete(file._id);
  await new Promise<void>((resolve, reject) => {
    const stream = b.openUploadStream(filename, { metadata: { contentType } });
    stream.on("error", reject);
    stream.on("finish", () => resolve());
    stream.end(buffer);
  });
}

export async function readStoredFile(name: FileBucket, filename: string) {
  const b = await bucket(name);
  const [file] = await b.find({ filename }).sort({ uploadDate: -1 }).limit(1).toArray();
  if (!file) return null;
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    b.openDownloadStream(file._id)
      .on("data", (chunk: Buffer) => chunks.push(chunk))
      .on("error", reject)
      .on("end", () => resolve());
  });
  return {
    buffer: Buffer.concat(chunks),
    contentType: String(file.metadata?.contentType || "application/octet-stream"),
    uploadDate: file.uploadDate,
  };
}

export async function deleteStoredFile(name: FileBucket, filename: string) {
  const b = await bucket(name);
  for (const file of await b.find({ filename }).toArray()) await b.delete(file._id);
}
