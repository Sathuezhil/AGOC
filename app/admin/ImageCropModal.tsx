"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedFile } from "@/lib/cropImage";

const ASPECTS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "16:10", value: 16 / 10 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
];

export default function ImageCropModal({
  imageSrc,
  fileName = "image.jpg",
  originalFile,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  fileName?: string;
  /** If set, “Use full image” uploads this file without cropping */
  originalFile?: File | null;
  onCancel: () => void;
  onConfirm: (file: File) => void | Promise<void>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function apply() {
    if (!croppedAreaPixels) return;
    setBusy(true);
    setError("");
    try {
      const mime =
        fileName.toLowerCase().endsWith(".png") || imageSrc.startsWith("data:image/png")
          ? "image/png"
          : "image/jpeg";
      const file = await getCroppedFile(imageSrc, croppedAreaPixels, fileName, mime);
      await onConfirm(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crop failed.");
    } finally {
      setBusy(false);
    }
  }

  async function useFull() {
    setBusy(true);
    setError("");
    try {
      if (originalFile) {
        await onConfirm(originalFile);
        return;
      }
      // Already in the media library — keep it, don't upload a second copy
      if (
        imageSrc.startsWith("/api/media") ||
        imageSrc.startsWith("/images/")
      ) {
        onCancel();
        return;
      }
      const response = await fetch(imageSrc);
      if (!response.ok) throw new Error("Could not load image.");
      const blob = await response.blob();
      const type = blob.type || "image/jpeg";
      const ext = type.includes("png") ? "png" : "jpg";
      const base = fileName.replace(/\.[^.]+$/, "") || "image";
      await onConfirm(new File([blob], `${base}.${ext}`, { type }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-sand/15 bg-night shadow-2xl">
        <div className="flex items-center justify-between border-b border-sand/10 px-5 py-4">
          <div>
            <p className="font-display text-2xl text-sand">Crop image</p>
            <p className="mt-0.5 text-xs text-mist">
              Free = full photo. Use 16:10 only for service card thumbnails.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="text-sm text-mist hover:text-sand disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <div className="relative h-[48vh] min-h-[260px] w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
          />
        </div>

        <div className="space-y-4 border-t border-sand/10 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {ASPECTS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setAspect(item.value)}
                className={`rounded-md px-3 py-1.5 text-xs tracking-wide uppercase transition ${
                  aspect === item.value
                    ? "bg-crimson text-white"
                    : "border border-sand/15 text-mist hover:border-olive/50 hover:text-sand"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 text-sm text-mist">
            <span className="w-12 shrink-0 tracking-wide uppercase">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#2D9B45]"
            />
          </label>

          {error && <p className="text-sm text-crimson-soft">{error}</p>}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-lg border border-sand/15 px-4 py-2.5 text-sm text-mist hover:text-sand disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={useFull}
              disabled={busy}
              className="rounded-lg border border-olive/40 px-4 py-2.5 text-sm tracking-wide text-olive uppercase hover:bg-olive/10 disabled:opacity-50"
            >
              {busy ? "Saving…" : "Use full image"}
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={busy || !croppedAreaPixels}
              className="btn-shine rounded-lg bg-crimson px-5 py-2.5 text-sm font-medium tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-60"
            >
              {busy ? "Saving…" : "Apply crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
