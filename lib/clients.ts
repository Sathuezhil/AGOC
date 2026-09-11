import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(png|jpe?g|webp|svg|gif)$/i;

/** Friendly names for logos in public/clients */
const DISPLAY_NAMES: Record<string, string> = {
  "ATVA.png": "ATVA",
  "Al Thabat Security.png": "Al Thabat Security",
  "broud vission.png": "Broad Vision",
  "Capra.png": "Capra Group",
  "Crown Falcon.png": "Crown Falcon",
  "day to day.png": "Day to Day",
  "delta centre.png": "Delta Centre",
  "EMG.png": "EMG Emirates Management Group",
  "first.png": "First Security Group",
  "flex.png": "Flex Facility Management",
  "guardian.png": "Guardian",
  "Honest El-WahaB Group.png": "Honest by El-WahaB Group",
  "interforce.png": "Interforce",
  "orville.png": "Orville",
  "S hotel.png": "S Hotel",
  "S19 Hotel.png": "S19 Hotel",
  "Tulip Hotel.png": "Tulip Hotel",
};

export type ClientLogo = {
  src: string;
  name: string;
};

function labelFromFile(filename: string) {
  if (DISPLAY_NAMES[filename]) return DISPLAY_NAMES[filename];
  return filename
    .replace(IMAGE_EXT, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Public URL for a file under /public/clients (spaces & unicode safe). */
function clientSrc(filename: string) {
  return `/clients/${filename
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

export function getClientLogos(): ClientLogo[] {
  const dir = path.join(process.cwd(), "public", "clients");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file) && !file.startsWith("."))
    .sort((a, b) =>
      labelFromFile(a).localeCompare(labelFromFile(b), undefined, {
        sensitivity: "base",
      }),
    )
    .map((file) => ({
      src: clientSrc(file),
      name: labelFromFile(file),
    }));
}
