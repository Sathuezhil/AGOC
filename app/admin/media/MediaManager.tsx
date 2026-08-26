"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import ImageCropModal from "../ImageCropModal";

type MediaFile = { src: string; name: string; uploaded?: boolean };

export default function MediaManager() {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaFile | null>(null);
  const [message, setMessage] = useState("");
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
    load();
  }, []);

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
    setMessage("");
    const form = new FormData();
    form.append("file", file);
    if (replaceSrc) form.append("replace", replaceSrc);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!data.ok) {
      throw new Error(data.error || "Upload failed.");
    }
    clearCrop();
    setMessage("Image saved.");
    load();
  }

  async function remove() {
    if (!pendingDelete) return;
    const { src } = pendingDelete;
    setDeleting(src);
    setMessage("");
    const response = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setDeleting(null);
    setPendingDelete(null);
    if (!data.ok) {
      setMessage(data.error || "Could not delete.");
      return;
    }
    setMessage("Image deleted.");
    setItems((prev) => prev.filter((item) => item.src !== src));
  }

  return (
    <div className="mt-8">
      <label className="inline-block cursor-pointer rounded-lg bg-crimson px-5 py-2.5 text-xs tracking-wide text-white uppercase hover:bg-crimson-dark">
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
      {message && <p className="mt-3 text-sm text-olive">{message}</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <article key={item.src} className="overflow-hidden rounded-lg border border-sand/10 bg-night">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.name} className="h-36 w-full object-cover" />
            <div className="space-y-2 p-3">
              <p className="truncate text-xs text-mist">{item.name}</p>
              <p className="truncate text-[10px] text-mist/70">{item.src}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startCropFromLibrary(item.src, item.name)}
                  className="text-xs tracking-wide text-olive uppercase hover:text-sand disabled:opacity-50"
                >
                  Crop
                </button>
                <button
                  type="button"
                  disabled={deleting === item.src}
                  onClick={() => setPendingDelete(item)}
                  className="text-xs tracking-wide text-crimson uppercase disabled:opacity-50"
                >
                  {deleting === item.src ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete image?"
        message={
          pendingDelete
            ? `Delete “${pendingDelete.name}”? This removes it from the media library.`
            : "Delete this image?"
        }
        confirmLabel="Yes, delete"
        cancelLabel="No"
        busy={Boolean(deleting)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
      />

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
