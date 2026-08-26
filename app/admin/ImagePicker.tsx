"use client";

import { useEffect, useState } from "react";
import ImageCropModal from "./ImageCropModal";

type MediaFile = { src: string; name: string };

export default function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (src: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropName, setCropName] = useState("image.jpg");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [replaceSrc, setReplaceSrc] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/media");
    const data = (await response.json()) as { items?: MediaFile[] };
    setItems(data.items ?? []);
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  function clearCrop() {
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setOriginalFile(null);
    setReplaceSrc(null);
  }

  function startCropFromFile(file: File) {
    clearCrop();
    setCropName(file.name || "image.jpg");
    setOriginalFile(file);
    setReplaceSrc(null);
    setCropSrc(URL.createObjectURL(file));
  }

  function startCropFromLibrary(src: string, name: string) {
    clearCrop();
    setCropName(name || "image.jpg");
    setOriginalFile(null);
    setReplaceSrc(src);
    setCropSrc(src);
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
    clearCrop();
    onChange(data.src);
    setOpen(false);
  }

  return (
    <div>
      <p className="mb-1.5 text-xs tracking-[0.16em] text-mist uppercase">{label}</p>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-24 overflow-hidden rounded-md border border-sand/10 bg-night">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] text-mist">
              None
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs tracking-wide text-olive uppercase hover:text-sand"
          >
            Choose image
          </button>
          {value && (
            <button
              type="button"
              onClick={() => {
                const name = value.split("/").pop() || "image.jpg";
                startCropFromLibrary(value, decodeURIComponent(name));
              }}
              className="text-xs tracking-wide text-sand/80 uppercase hover:text-olive"
            >
              Crop current
            </button>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs tracking-wide text-crimson uppercase"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-sand/10 bg-night p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-2xl text-sand">Images</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-mist hover:text-sand"
              >
                Close
              </button>
            </div>
            <label className="mb-4 inline-block cursor-pointer rounded-lg bg-crimson px-4 py-2 text-xs tracking-wide text-white uppercase">
              {busy ? "Uploading…" : "Upload & crop"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) startCropFromFile(file);
                }}
              />
            </label>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
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
                      setOpen(false);
                    }}
                    className="block w-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt={item.name} className="h-24 w-full object-cover" />
                  </button>
                  <div className="flex items-center justify-between gap-1 px-1 py-1">
                    <p className="truncate text-[10px] text-mist">{item.name}</p>
                    <button
                      type="button"
                      onClick={() => startCropFromLibrary(item.src, item.name)}
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

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={cropName}
          originalFile={originalFile}
          onCancel={clearCrop}
          onConfirm={upload}
        />
      )}
    </div>
  );
}
