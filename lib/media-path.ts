/** Pure media path helpers — safe for Client Components (no Node/Mongo). */

export function mediaSrc(filename: string) {
  const clean = filename.replace(/^\/+/, "").replace(/^api\/media\//, "");
  return `/api/media/${clean.split("/").map(encodeURIComponent).join("/")}`;
}

/** Collapse broken nested paths and map /images/* → /api/media/images/* */
export function normalizeMediaSrc(src: string) {
  if (!src || typeof src !== "string") return src;
  let s = src.trim();
  if (
    !s.includes("/images") &&
    !s.includes("logo.png") &&
    !s.includes("/api/media") &&
    !s.includes("/uploads/")
  ) {
    return s;
  }

  while (s.includes("/api/media/api/media/")) {
    s = s.replaceAll("/api/media/api/media/", "/api/media/");
  }

  const nested = s.match(
    /\/(?:api\/media\/)+((?:images|uploads)\/.+|logo\.png)$/,
  );
  if (nested?.[1]) return mediaSrc(nested[1]);

  if (s.startsWith("/api/media/")) return s;
  if (s.startsWith("/images/")) return mediaSrc(s.slice(1));
  if (s === "/logo.png") return mediaSrc("logo.png");
  return s;
}

export function publicToMediaSrc(src: string) {
  return normalizeMediaSrc(src);
}

export function rewriteImageRefs<T>(value: T): T {
  const walk = (node: unknown): unknown => {
    if (typeof node === "string") return normalizeMediaSrc(node);
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
        out[key] = walk(val);
      }
      return out;
    }
    return node;
  };
  return walk(value) as T;
}

export function srcToFilename(src: string) {
  const normalized = normalizeMediaSrc(src.split("?")[0]);
  if (normalized.startsWith("/api/media/")) {
    return decodeURIComponent(normalized.slice("/api/media/".length));
  }
  if (normalized.startsWith("/images/")) return normalized.slice(1);
  if (normalized === "/logo.png") return "logo.png";
  return normalized.replace(/^\//, "");
}

/** Compare paths that may be /images/x vs /api/media/images/x */
export function sameMediaSrc(a: string, b: string) {
  if (!a?.trim() || !b?.trim()) return false;
  return srcToFilename(a) === srcToFilename(b);
}

/** Keep first occurrence only (same file once). */
export function uniqueMediaSrcs(srcs: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of srcs) {
    if (!src?.trim()) continue;
    const key = srcToFilename(src);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(normalizeMediaSrc(src));
  }
  return out;
}
