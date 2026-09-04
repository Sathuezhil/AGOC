export const profilePdfPath = "/documents/company-profile.pdf";
export const profileDownloadName = "AGOC-Company-Profile.pdf";
export const PROFILE_PDF_MAX_MB = 100;
export const PROFILE_PDF_MAX_BYTES = PROFILE_PDF_MAX_MB * 1024 * 1024;

export function profilePdfHref(stored?: string) {
  const raw = stored?.trim() || profilePdfPath;
  return raw.split("?")[0] || profilePdfPath;
}
