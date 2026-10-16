import path from "path";
import { PROFILE_PDF_MAX_BYTES, PROFILE_PDF_MAX_MB } from "./profile-pdf";
import { saveStoredFile } from "./file-store";

export const PROFILE_DOCUMENT = "company-profile.pdf";
export const profileDocumentHref = `/api/documents/${PROFILE_DOCUMENT}`;

export async function saveProfilePdf(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  if (ext !== ".pdf") {
    throw new Error("Upload a PDF file only.");
  }
  if (file.size > PROFILE_PDF_MAX_BYTES) {
    throw new Error(`PDF must be under ${PROFILE_PDF_MAX_MB} MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const header = buffer.subarray(0, 5).toString("utf8");
  if (!header.startsWith("%PDF-")) {
    throw new Error("That file does not look like a valid PDF.");
  }

  await saveStoredFile("documents", PROFILE_DOCUMENT, buffer, "application/pdf");
  return `${profileDocumentHref}?v=${Date.now()}`;
}
