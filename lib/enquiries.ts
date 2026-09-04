import { randomUUID } from "crypto";

export type EnquiryStatus = "new" | "read" | "replied" | "done";

export type EnquiryReply = {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  replies?: EnquiryReply[];
  repliedAt?: string;
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

export async function getEnquiry(id: string) {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const doc = await (await enquiriesCollection()).findOne({ id });
  if (!doc) return null;
  return stripMongo(doc) as Enquiry;
}

export async function addEnquiry(
  input: Omit<Enquiry, "id" | "status" | "createdAt" | "replies" | "repliedAt">,
) {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const enquiry: Enquiry = {
    id: randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
    replies: [],
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

export async function addEnquiryReply(
  id: string,
  input: { subject: string; body: string },
) {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();

  const reply: EnquiryReply = {
    id: randomUUID(),
    subject: input.subject.trim(),
    body: input.body.trim(),
    sentAt: new Date().toISOString(),
  };

  const result = await (
    await enquiriesCollection()
  ).findOneAndUpdate(
    { id },
    {
      $push: { replies: reply },
      $set: {
        status: "replied" as EnquiryStatus,
        repliedAt: reply.sentAt,
      },
    },
    { returnDocument: "after" },
  );

  if (!result) return null;
  return { enquiry: stripMongo(result) as Enquiry, reply };
}

export async function deleteEnquiry(id: string) {
  const { enquiriesCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const result = await (await enquiriesCollection()).deleteOne({ id });
  return result.deletedCount > 0;
}
