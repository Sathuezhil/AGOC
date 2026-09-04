import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  PROFILE_PDF_MAX_BYTES,
  PROFILE_PDF_MAX_MB,
  profilePdfPath,
} from "./profile-pdf";

const DOCUMENTS_DIR = path.join(process.cwd(), "public", "documents");
const PROFILE_BASENAME = "company-profile.pdf";

export async function saveProfilePdf(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  if (ext !== ".pdf") {
    throw new Error("Upload a PDF file only.");
  }
  if (file.size > PROFILE_PDF_MAX_BYTES) {
    throw new Error(`PDF must be under ${PROFILE_PDF_MAX_MB} MB.`);
  }

  await mkdir(DOCUMENTS_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const header = buffer.subarray(0, 5).toString("utf8");
  if (!header.startsWith("%PDF-")) {
    throw new Error("That file does not look like a valid PDF.");
  }

  const target = path.join(DOCUMENTS_DIR, PROFILE_BASENAME);
  await writeFile(target, buffer);

  return `${profilePdfPath}?v=${Date.now()}`;
}

/** Remove old timestamped profile uploads if any exist. */
export async function cleanupOldProfileUploads() {
  await mkdir(DOCUMENTS_DIR, { recursive: true });
  const files = await readdir(DOCUMENTS_DIR);
  for (const name of files) {
    if (name.startsWith("company-profile-") && name.endsWith(".pdf")) {
      await unlink(path.join(DOCUMENTS_DIR, name)).catch(() => undefined);
    }
  }
}
