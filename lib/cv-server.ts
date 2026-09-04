import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { CV_MAX_BYTES, CV_MAX_MB } from "./cv";

export { CV_MAX_BYTES, CV_MAX_MB } from "./cv";

const CV_DIR = path.join(process.cwd(), "storage", "cvs");

export function cvStoragePath(storedName: string) {
  const safe = path.basename(storedName);
  return path.join(CV_DIR, safe);
}

export async function saveApplicationCv(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  if (ext !== ".pdf" && file.type !== "application/pdf") {
    throw new Error("CV must be a PDF file.");
  }
  if (file.size > CV_MAX_BYTES) {
    throw new Error(`CV must be under ${CV_MAX_MB} MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const header = buffer.subarray(0, 5).toString("utf8");
  if (!header.startsWith("%PDF-")) {
    throw new Error("That file does not look like a valid PDF.");
  }

  await mkdir(CV_DIR, { recursive: true });
  const storedName = `${Date.now()}-${randomUUID()}.pdf`;
  await writeFile(cvStoragePath(storedName), buffer);

  const originalName = file.name.replace(/[^\w.\- ()[\]]+/g, "-").slice(0, 120);
  return {
    storedName,
    originalName: originalName.endsWith(".pdf") ? originalName : `${originalName}.pdf`,
  };
}

export async function deleteApplicationCv(storedName?: string | null) {
  if (!storedName) return;
  await unlink(cvStoragePath(storedName)).catch(() => undefined);
}
