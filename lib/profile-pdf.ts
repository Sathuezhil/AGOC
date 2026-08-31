export const profilePdfPath = "/documents/company-profile.pdf";
export const profileDownloadName = "AGOC-Company-Profile.pdf";

export function profilePdfHref(stored?: string) {
  const raw = stored?.trim() || profilePdfPath;
  return raw.split("?")[0] || profilePdfPath;
}
