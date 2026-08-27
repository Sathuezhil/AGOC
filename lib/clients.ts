import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(png|jpe?g|webp|svg|gif)$/i;

export type ClientLogo = {
  src: string;
  name: string;
};

function labelFromFile(filename: string) {
  return filename
    .replace(IMAGE_EXT, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getClientLogos(): ClientLogo[] {
  const dir = path.join(process.cwd(), "public", "clients");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file) && !file.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((file) => ({
      src: `/clients/${encodeURIComponent(file)}`,
      name: labelFromFile(file),
    }));
}
