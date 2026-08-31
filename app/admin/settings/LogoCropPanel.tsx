"use client";

import { useEffect, useState } from "react";
import { Crop, ImagePlus, Trash2, Upload } from "lucide-react";
import ImageCropModal from "@/app/admin/ImageCropModal";
import Logo from "@/components/Logo";

type MediaFile = { src: string; name: string };

export default function LogoCropPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (src: string) => void;
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [items, setItems] = useState<MediaFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropName, setCropName] = useState("logo.jpg");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [replaceSrc, setReplaceSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  async function loadLibrary() {
    const response = await fetch("/api/admin/media");
    const data = (await response.json()) as { items?: MediaFile[] };
    setItems(data.items ?? []);
  }

  useEffect(() => {
    if (libraryOpen) loadLibrary();
  }, [libraryOpen]);

  function clearCropSession() {
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setOriginalFile(null);
    setReplaceSrc(null);
    setCropOpen(false);
  }

  function startCrop(src: string, name: string, file?: File) {
    clearCropSession();
    setCropName(name || "logo.jpg");
    if (file) {
      setOriginalFile(file);
      setReplaceSrc(null);
      setCropSrc(src);
    } else {
      setOriginalFile(null);
      setReplaceSrc(src);
      setCropSrc(src);
    }
    setCropOpen(true);
  }

  async function upload(file: File) {
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    if (replaceSrc) form.append("replace", replaceSrc);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await response.json()) as { ok?: boolean; src?: string; error?: string };
    setBusy(false);
    if (!data.ok || !data.src) {
      throw new Error(data.error || "Upload failed.");
    }
    clearCropSession();
    onChange(data.src);
    setLibraryOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-sand/10 bg-white px-4 py-4">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-ink/50 uppercase">
            Admin sidebar
          </p>
          <Logo src={value} compact className="mx-auto w-full max-w-[14rem]" />
        </div>
        <div className="rounded-lg border border-black/10 bg-white px-4 py-3 shadow-sm">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-ink/50 uppercase">
            Website header
          </p>
          <Logo src={value} className="h-[4.5rem]" />
        </div>
      </div>

      {cropOpen && cropSrc ? (
        <ImageCropModal
          inline
          mode="logo"
          imageSrc={cropSrc}
          fileName={cropName}
          originalFile={originalFile}
          onCancel={clearCropSession}
          onConfirm={upload}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-sand/20 bg-ink/40 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-24 min-w-0 flex-1 items-center justify-center rounded-md border border-sand/10 bg-white px-4">
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt="Current logo"
                  className="max-h-20 w-full max-w-full object-contain"
                />
              ) : (
                <span className="text-sm text-mist">No logo selected</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
              <button
                type="button"
                onClick={() => setLibraryOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-olive/40 px-4 py-2.5 text-xs tracking-wide text-olive uppercase hover:bg-olive/10"
              >
                <ImagePlus size={14} />
                Choose image
              </button>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-sand/15 px-4 py-2.5 text-xs tracking-wide text-sand uppercase hover:border-olive/40 hover:text-olive">
                <Upload size={14} />
                {busy ? "Uploading…" : "Upload new"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) startCrop(URL.createObjectURL(file), file.name, file);
                  }}
                />
              </label>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    const name = value.split("/").pop() || "logo.jpg";
                    startCrop(value, decodeURIComponent(name));
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-crimson px-4 py-2.5 text-xs tracking-wide text-white uppercase hover:bg-crimson-dark"
                >
                  <Crop size={14} />
                  Crop logo
                </button>
              )}
              {value && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-crimson/30 px-4 py-2.5 text-xs tracking-wide text-crimson uppercase hover:bg-crimson/10"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-mist">
            Upload a wide logo image, then use <span className="text-sand">Crop logo</span> to
            trim empty space. Keep <span className="text-sand">Free</span> aspect so the full
            AGOC mark, tagline, and company line stay visible.
          </p>
        </div>
      )}

      {libraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-sand/10 bg-night p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-2xl text-sand">Choose logo</p>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="text-sm text-mist hover:text-sand"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.src}
                  className={`overflow-hidden rounded-md border ${
                    value === item.src ? "border-olive" : "border-sand/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(item.src);
                      setLibraryOpen(false);
                    }}
                    className="block w-full bg-white p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.name}
                      className="mx-auto h-20 w-full object-contain"
                    />
                  </button>
                  <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                    <p className="truncate text-[10px] text-mist">{item.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryOpen(false);
                        startCrop(item.src, item.name);
                      }}
                      className="shrink-0 text-[10px] tracking-wide text-olive uppercase hover:text-sand"
                    >
                      Crop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
