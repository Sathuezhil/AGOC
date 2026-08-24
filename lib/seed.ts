import type { SiteContent } from "./content";
import type { Service } from "./services";
import type { Enquiry } from "./enquiries";
import {
  contentCollection,
  ensureIndexes,
  enquiriesCollection,
  servicesCollection,
} from "./db";
import { rewriteImageRefs, saveBuffer } from "./media";
import { ensureAdminUser } from "./users";

async function readJsonFile<T>(name: string): Promise<T | null> {
  try {
    const { readFile } = await import("fs/promises");
    const path = await import("path");
    const raw = await readFile(path.join(process.cwd(), "data", name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function seedDiskImages() {
  const { readdir, readFile, stat } = await import("fs/promises");
  const path = await import("path");
  const root = process.cwd();

  async function walk(dir: string, prefix: string): Promise<{ disk: string; filename: string }[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: { disk: string; filename: string }[] = [];
    for (const entry of entries) {
      const disk = path.join(dir, entry.name);
      const filename = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        files.push(...(await walk(disk, filename)));
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) continue;
      files.push({ disk, filename: filename.replace(/\\/g, "/") });
    }
    return files;
  }

  const imagesDir = path.join(root, "public", "images");
  const logoPath = path.join(root, "public", "logo.png");
  const files = await walk(imagesDir, "images");
  try {
    await stat(logoPath);
    files.push({ disk: logoPath, filename: "logo.png" });
  } catch {
    /* no logo */
  }

  const { findMediaFile } = await import("./media");
  const { getDb } = await import("./db");
  const deleted = new Set(
    (
      await (await getDb()).collection<{ filename: string }>("media_deleted").find({}).toArray()
    ).map((row) => row.filename),
  );
  for (const file of files) {
    if (deleted.has(file.filename)) continue;
    if (await findMediaFile(file.filename)) continue;
    const buffer = await readFile(file.disk);
    await saveBuffer({ filename: file.filename, buffer, kind: "seed" });
  }
}

async function rewriteStoredImages() {
  const content = await contentCollection();
  const services = await servicesCollection();
  const doc = await content.findOne({ _id: "site" });
  if (doc) {
    const { _id, ...rest } = doc;
    await content.updateOne({ _id }, { $set: rewriteImageRefs(rest) });
  }
  const items = await services.find({}).toArray();
  for (const item of items) {
    const { _id, ...rest } = item;
    await services.updateOne({ _id }, { $set: rewriteImageRefs(rest) });
  }
}

let seeded = false;
let seeding: Promise<void> | null = null;

export async function ensureSeeded() {
  if (seeded) return;
  if (seeding) return seeding;
  seeding = (async () => {
    await ensureIndexes();
    await ensureAdminUser();
    await seedDiskImages();

    const [{ DEFAULT_SERVICES }, { DEFAULT_CONTENT }] = await Promise.all([
      import("./services"),
      import("./content"),
    ]);

    const services = await servicesCollection();
    const content = await contentCollection();
    const enquiries = await enquiriesCollection();

    const serviceCount = await services.countDocuments();
    if (serviceCount === 0) {
      const fromFile = await readJsonFile<Service[]>("services.json");
      const items = (fromFile?.length ? fromFile : DEFAULT_SERVICES).map(
        (item, index) => ({
          ...rewriteImageRefs(item),
          hidden: Boolean(item.hidden),
          gallery: item.gallery ?? [],
          points: item.points ?? [],
          sortOrder: index,
        }),
      );
      if (items.length) await services.insertMany(items);
    }

    const contentDoc = await content.findOne({ _id: "site" });
    if (!contentDoc) {
      const fromFile = await readJsonFile<SiteContent>("content.json");
      await content.insertOne({
        _id: "site",
        ...rewriteImageRefs(fromFile ?? DEFAULT_CONTENT),
      });
    }

    const enquiryCount = await enquiries.countDocuments();
    if (enquiryCount === 0) {
      const fromFile = await readJsonFile<Enquiry[]>("enquiries.json");
      if (fromFile?.length) await enquiries.insertMany(fromFile);
    }

    await rewriteStoredImages();
    seeded = true;
  })();
  try {
    await seeding;
  } finally {
    seeding = null;
  }
}
