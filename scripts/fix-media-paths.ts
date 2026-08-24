import { contentCollection, servicesCollection } from "../lib/db";
import { ensureSeeded } from "../lib/seed";
import { rewriteImageRefs } from "../lib/media";

async function main() {
  await ensureSeeded();
  const content = await contentCollection();
  const services = await servicesCollection();

  const doc = await content.findOne({ _id: "site" });
  if (doc) {
    const { _id, ...rest } = doc;
    await content.updateOne({ _id }, { $set: rewriteImageRefs(rest) });
    console.log("Fixed content image paths");
  }

  const items = await services.find({}).toArray();
  for (const item of items) {
    const { _id, ...rest } = item;
    await services.updateOne({ _id }, { $set: rewriteImageRefs(rest) });
  }
  console.log(`Fixed ${items.length} services`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
