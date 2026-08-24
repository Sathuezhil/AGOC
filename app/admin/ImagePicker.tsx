"use client";

import { useEffect, useState } from "react";

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

  async function load() {
    const response = await fetch("/api/admin/media");
    const data = (await response.json()) as { items?: MediaFile[] };
    setItems(data.items ?? []);
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  async function upload(file: File) {
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await response.json()) as { ok?: boolean; src?: string; error?: string };
    setBusy(false);
    if (!data.ok || !data.src) {
      alert(data.error || "Upload failed.");
      return;
    }
    onChange(data.src);
    setOpen(false);
  }

  return (
    <div>
      <p className="mb-1.5 text-xs tracking-[0.16em] text-mist uppercase">{label}</p>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-24 overflow-hidden border border-white/10 bg-night">
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
            className="text-xs tracking-wide text-olive uppercase hover:text-white"
          >
            Choose image
          </button>
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
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto border border-white/10 bg-night p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-2xl text-white">Images</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-mist hover:text-white"
              >
                Close
              </button>
            </div>
            <label className="mb-4 inline-block cursor-pointer bg-crimson px-4 py-2 text-xs tracking-wide text-white uppercase">
              {busy ? "Uploading…" : "Upload new"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file);
                }}
              />
            </label>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.src}
                  onClick={() => {
                    onChange(item.src);
                    setOpen(false);
                  }}
                  className={`overflow-hidden border ${
                    value === item.src ? "border-olive" : "border-white/10"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.name} className="h-24 w-full object-cover" />
                  <p className="truncate px-1 py-1 text-[10px] text-mist">{item.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
