"use client";

import { useEffect, useState } from "react";
import { ArchiveRestore, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import ImageCropModal from "../ImageCropModal";

type MediaFile = {
  src: string;
  name: string;
  uploaded?: boolean;
  deletedAt?: string;
};

type View = "library" | "trash";

export default function MediaManager() {
  const [view, setView] = useState<View>("library");
  const [items, setItems] = useState<MediaFile[]>([]);
  const [trashCount, setTrashCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [working, setWorking] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaFile | null>(null);
  const [pendingPermanentDelete, setPendingPermanentDelete] = useState<MediaFile | null>(null);
  const [message, setMessage] = useState("");
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropName, setCropName] = useState("image.jpg");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [replaceSrc, setReplaceSrc] = useState<string | null>(null);

  async function loadLibrary() {
    const response = await fetch("/api/admin/media");
    const data = (await response.json()) as { items?: MediaFile[] };
    setItems(data.items ?? []);
  }

  async function loadTrash() {
    const response = await fetch("/api/admin/media/trash");
    const data = (await response.json()) as { items?: MediaFile[] };
    setItems(data.items ?? []);
  }

  async function refreshTrashCount() {
    const response = await fetch("/api/admin/media/trash");
    const data = (await response.json()) as { items?: MediaFile[] };
    setTrashCount(data.items?.length ?? 0);
  }

  async function loadCurrentView() {
    if (view === "library") {
      await loadLibrary();
    } else {
      await loadTrash();
    }
    await refreshTrashCount();
  }

  useEffect(() => {
    loadCurrentView();
  }, [view]);

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
    loadCurrentView();
  }

  async function moveToTrash() {
    if (!pendingDelete) return;
    const { src } = pendingDelete;
    setWorking(src);
    setMessage("");
    const response = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setWorking(null);
    setPendingDelete(null);
    if (!data.ok) {
      setMessage(data.error || "Could not move to recycle bin.");
      return;
    }
    setMessage("Image moved to recycle bin.");
    loadCurrentView();
  }

  async function restore(item: MediaFile) {
    setWorking(item.src);
    setMessage("");
    const response = await fetch("/api/admin/media/trash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src: item.src }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setWorking(null);
    if (!data.ok) {
      setMessage(data.error || "Could not restore.");
      return;
    }
    setMessage("Image restored to library.");
    loadCurrentView();
  }

  async function deleteForever() {
    if (!pendingPermanentDelete) return;
    const { src } = pendingPermanentDelete;
    setWorking(src);
    setMessage("");
    const response = await fetch("/api/admin/media/trash", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setWorking(null);
    setPendingPermanentDelete(null);
    if (!data.ok) {
      setMessage(data.error || "Could not delete permanently.");
      return;
    }
    setMessage("Image deleted permanently.");
    loadCurrentView();
  }

  function formatDeletedAt(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        {view === "library" && (
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
        )}

        {view === "library" ? (
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setView("trash");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-sand/15 px-5 py-2.5 text-xs tracking-wide text-mist uppercase transition hover:border-olive/40 hover:text-olive"
          >
            <Trash2 size={14} />
            Recycle bin
            {trashCount > 0 && (
              <span className="rounded-full bg-olive/15 px-2 py-0.5 text-[10px] text-olive">
                {trashCount}
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setView("library");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-olive/30 bg-olive/10 px-5 py-2.5 text-xs tracking-wide text-olive uppercase transition hover:bg-olive/20"
          >
            <ArchiveRestore size={14} />
            Back to library
          </button>
        )}
      </div>

      {view === "trash" && (
        <p className="mt-3 max-w-2xl text-sm text-mist">
          Deleted images stay here until you restore them or delete permanently.
        </p>
      )}

      {message && <p className="mt-3 text-sm text-olive">{message}</p>}

      {items.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand/15 bg-night/60 p-8 text-sm text-mist">
          {view === "library"
            ? "No images yet. Upload one to get started."
            : "Recycle bin is empty."}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <article key={item.src} className="overflow-hidden rounded-lg border border-sand/10 bg-night">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.name} className="h-36 w-full object-cover" />
              <div className="space-y-2 p-3">
                <p className="truncate text-xs text-sand">{item.name}</p>
                {view === "trash" && item.deletedAt && (
                  <p className="text-[10px] text-mist/70">Deleted {formatDeletedAt(item.deletedAt)}</p>
                )}
                <p className="truncate text-[10px] text-mist/70">{item.src}</p>
                <div className="flex flex-wrap gap-3">
                  {view === "library" ? (
                    <>
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
                        disabled={working === item.src}
                        onClick={() => setPendingDelete(item)}
                        className="text-xs tracking-wide text-crimson uppercase disabled:opacity-50"
                      >
                        {working === item.src ? "Deleting…" : "Delete"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={working === item.src}
                        onClick={() => restore(item)}
                        className="text-xs tracking-wide text-olive uppercase hover:text-sand disabled:opacity-50"
                      >
                        {working === item.src ? "Restoring…" : "Restore"}
                      </button>
                      <button
                        type="button"
                        disabled={working === item.src}
                        onClick={() => setPendingPermanentDelete(item)}
                        className="text-xs tracking-wide text-crimson uppercase disabled:opacity-50"
                      >
                        Delete forever
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Move to recycle bin?"
        message={
          pendingDelete
            ? `Move “${pendingDelete.name}” to the recycle bin? You can restore it later.`
            : "Move this image to the recycle bin?"
        }
        confirmLabel="Yes, move to bin"
        cancelLabel="No"
        busy={Boolean(working)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={moveToTrash}
      />

      <ConfirmDialog
        open={Boolean(pendingPermanentDelete)}
        title="Delete permanently?"
        message={
          pendingPermanentDelete
            ? `Delete “${pendingPermanentDelete.name}” forever? This cannot be undone.`
            : "Delete this image permanently?"
        }
        confirmLabel="Yes, delete forever"
        cancelLabel="No"
        busy={Boolean(working)}
        onConfirm={deleteForever}
        onCancel={() => setPendingPermanentDelete(null)}
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
