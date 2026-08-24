import { MongoClient, type Db, type Collection } from "mongodb";
import type { Service } from "./services";
import type { SiteContent } from "./content";
import type { Enquiry } from "./enquiries";

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/agoc";
const DB_NAME = process.env.MONGODB_DB || "agoc";

type ContentDoc = SiteContent & { _id: "site" };
type ServiceDoc = Service & { _id?: string; sortOrder?: number };
type EnquiryDoc = Enquiry & { _id?: string };

declare global {
  // eslint-disable-next-line no-var
  var __agocMongo: {
    client: MongoClient;
    promise: Promise<MongoClient>;
  } | undefined;
}

function getClientPromise() {
  if (!global.__agocMongo) {
    const client = new MongoClient(URI, {
      serverSelectionTimeoutMS: 8000,
    });
    global.__agocMongo = {
      client,
      promise: client.connect(),
    };
  }
  return global.__agocMongo.promise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}

export async function servicesCollection(): Promise<Collection<ServiceDoc>> {
  return (await getDb()).collection<ServiceDoc>("services");
}

export async function contentCollection(): Promise<Collection<ContentDoc>> {
  return (await getDb()).collection<ContentDoc>("content");
}

export async function enquiriesCollection(): Promise<Collection<EnquiryDoc>> {
  return (await getDb()).collection<EnquiryDoc>("enquiries");
}

export async function ensureIndexes() {
  const services = await servicesCollection();
  const enquiries = await enquiriesCollection();
  const users = (await getDb()).collection("users");
  await Promise.all([
    services.createIndex({ slug: 1 }, { unique: true }),
    services.createIndex({ sortOrder: 1 }),
    enquiries.createIndex({ createdAt: -1 }),
    enquiries.createIndex({ status: 1 }),
    enquiries.createIndex({ id: 1 }, { unique: true }),
    users.createIndex({ email: 1 }, { unique: true }),
  ]);
}
