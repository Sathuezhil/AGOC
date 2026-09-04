"use client";

import { useRef, useState } from "react";
import { ExternalLink, FileText, Upload } from "lucide-react";
import {
  PROFILE_PDF_MAX_BYTES,
  PROFILE_PDF_MAX_MB,
  profileDownloadName,
  profilePdfHref,
} from "@/lib/profile-pdf";

export default function ProfilePdfPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (src: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setMessage("");
    setError("");

    if (file.size > PROFILE_PDF_MAX_BYTES) {
      setError(`PDF must be under ${PROFILE_PDF_MAX_MB} MB.`);
      setBusy(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/settings/profile-pdf", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        companyProfilePdf?: string;
      };

      if (!response.ok || !data.ok || !data.companyProfilePdf) {
        throw new Error(data.error || "Could not upload PDF.");
      }

      onChange(data.companyProfilePdf);
      setMessage("Company profile PDF updated on the website.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const previewHref = profilePdfHref(value);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed border-sand/20 bg-ink/40 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-olive/25 bg-olive/10 text-olive">
              <FileText size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sand">Current profile PDF</p>
              <p className="mt-1 truncate text-xs text-mist">{previewHref}</p>
              <p className="mt-2 text-xs text-mist">
                Visitors download this from the <span className="text-sand">Our Profile</span>{" "}
                button in the website header. Max file size: {PROFILE_PDF_MAX_MB} MB.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-crimson px-4 py-2.5 text-xs tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-70"
            >
              <Upload size={14} />
              {busy ? "Uploading…" : "Upload new PDF"}
            </button>
            {value && (
              <a
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-sand/15 px-4 py-2.5 text-xs tracking-wide text-mist uppercase transition hover:border-olive/40 hover:text-olive"
              >
                Preview
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) upload(file);
          }}
        />
      </div>

      {value && (
        <a
          href={previewHref}
          download={profileDownloadName}
          className="inline-flex items-center gap-2 text-xs tracking-wide text-olive uppercase hover:text-sand"
        >
          <FileText size={14} />
          Test download as visitor
        </a>
      )}

      {message && <p className="text-sm text-olive">{message}</p>}
      {error && <p className="text-sm text-crimson-soft">{error}</p>}
    </div>
  );
}
