"use client";

import { useEffect, useState } from "react";

type MediaFile = { src: string; name: string; uploaded?: boolean };

export default function MediaManager() {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/media");
    const data = (await response.json()) as { items?: MediaFile[] };
    setItems(data.items ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(file: File) {
    setBusy(true);
    setMessage("");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!data.ok) {
      setMessage(data.error || "Upload failed.");
      return;
    }
    setMessage("Image uploaded.");
    load();
  }

  async function remove(src: string, name: string) {
    if (!confirm(`Delete “${name}”? This removes it from the media library.`)) return;
    setDeleting(src);
    setMessage("");
    const response = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setDeleting(null);
    if (!data.ok) {
      setMessage(data.error || "Could not delete.");
      return;
    }
    setMessage("Image deleted.");
    setItems((prev) => prev.filter((item) => item.src !== src));
  }

  return (
    <div className="mt-8">
      <label className="inline-block cursor-pointer bg-crimson px-5 py-2.5 text-xs tracking-wide text-white uppercase hover:bg-crimson-dark">
        {busy ? "Uploading…" : "Upload image"}
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
      {message && <p className="mt-3 text-sm text-olive">{message}</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <article key={item.src} className="border border-white/10 bg-night">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.name} className="h-36 w-full object-cover" />
            <div className="space-y-2 p-3">
              <p className="truncate text-xs text-mist">{item.name}</p>
              <p className="truncate text-[10px] text-mist/70">{item.src}</p>
              <button
                type="button"
                disabled={deleting === item.src}
                onClick={() => remove(item.src, item.name)}
                className="text-xs tracking-wide text-crimson uppercase disabled:opacity-50"
              >
                {deleting === item.src ? "Deleting…" : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
