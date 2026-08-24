import { ensureSeeded } from "../lib/seed";
import { getDb } from "../lib/db";
import { getServices } from "../lib/services";
import { getContent } from "../lib/content";
import { listEnquiries } from "../lib/enquiries";

async function main() {
  console.log("Connecting to MongoDB…");
  await ensureSeeded();
  const db = await getDb();
  const [services, content, enquiries] = await Promise.all([
    getServices(),
    getContent(),
    listEnquiries(),
  ]);
  console.log(`DB: ${db.databaseName}`);
  console.log(`Services: ${services.length}`);
  console.log(`Content site: ${content.site.name}`);
  console.log(`Enquiries: ${enquiries.length}`);
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("MongoDB seed failed:", err);
  process.exit(1);
});
