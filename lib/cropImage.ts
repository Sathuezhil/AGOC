import type { Area } from "react-easy-crop";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    if (/^https?:\/\//i.test(url)) {
      image.crossOrigin = "anonymous";
    }
    image.src = url;
  });
}

/** Export exactly the cropped pixels — this file is what the site shows. */
export async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  mimeType = "image/jpeg",
  quality = 0.92,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop image.");

  const sx = Math.max(0, Math.round(pixelCrop.x));
  const sy = Math.max(0, Math.round(pixelCrop.y));
  const sw = Math.max(1, Math.round(Math.min(pixelCrop.width, image.naturalWidth - sx)));
  const sh = Math.max(1, Math.round(Math.min(pixelCrop.height, image.naturalHeight - sy)));

  // Cap longest side for web, keep exact crop aspect
  const maxEdge = 1920;
  const scale = Math.min(1, maxEdge / Math.max(sw, sh));
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));

  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not create cropped image."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

export async function getCroppedFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
  mimeType = "image/jpeg",
): Promise<File> {
  const blob = await getCroppedBlob(imageSrc, pixelCrop, mimeType);
  const base = fileName.replace(/\.[^.]+$/, "") || "cropped";
  const ext = mimeType === "image/png" ? "png" : "jpg";
  return new File([blob], `${base}-cropped.${ext}`, { type: mimeType });
}
