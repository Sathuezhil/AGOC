import { randomUUID } from "crypto";

export type EnquiryStatus = "new" | "read" | "done";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
};

function stripMongo<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const { _id: _unused, ...rest } = doc;
  void _unused;
  return rest;
}

export async function listEnquiries() {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const docs = await (await enquiriesCollection())
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((doc) => stripMongo(doc) as Enquiry);
}

export async function addEnquiry(
  input: Omit<Enquiry, "id" | "status" | "createdAt">,
) {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const enquiry: Enquiry = {
    id: randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
    ...input,
  };
  await (await enquiriesCollection()).insertOne(enquiry);
  return enquiry;
}

export async function updateEnquiry(
  id: string,
  patch: Partial<Pick<Enquiry, "status">>,
) {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const result = await (
    await enquiriesCollection()
  ).findOneAndUpdate(
    { id },
    { $set: patch },
    { returnDocument: "after" },
  );
  if (!result) return null;
  return stripMongo(result) as Enquiry;
}

export async function deleteEnquiry(id: string) {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const result = await (await enquiriesCollection()).deleteOne({ id });
  return result.deletedCount > 0;
}
