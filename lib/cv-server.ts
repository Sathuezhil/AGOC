import { readFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { CV_MAX_BYTES, CV_MAX_MB } from "./cv";
import { deleteStoredFile, readStoredFile, saveStoredFile } from "./file-store";

export { CV_MAX_BYTES, CV_MAX_MB } from "./cv";

/** CVs uploaded before they moved to MongoDB still live on disk here. */
const LEGACY_CV_DIR = path.join(process.cwd(), "storage", "cvs");

function legacyCvPath(storedName: string) {
  return path.join(LEGACY_CV_DIR, path.basename(storedName));
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

  const storedName = `${Date.now()}-${randomUUID()}.pdf`;
  await saveStoredFile("cvs", storedName, buffer, "application/pdf");

  const originalName = file.name.replace(/[^\w.\- ()[\]]+/g, "-").slice(0, 120);
  return {
    storedName,
    originalName: originalName.endsWith(".pdf") ? originalName : `${originalName}.pdf`,
  };
}

export async function readApplicationCv(storedName: string) {
  const stored = await readStoredFile("cvs", path.basename(storedName));
  if (stored) return stored.buffer;
  return readFile(legacyCvPath(storedName)).catch(() => null);
}

export async function deleteApplicationCv(storedName?: string | null) {
  if (!storedName) return;
  await deleteStoredFile("cvs", path.basename(storedName)).catch(() => undefined);
  await unlink(legacyCvPath(storedName)).catch(() => undefined);
}
