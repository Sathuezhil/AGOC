import { MongoClient, type Db, type Collection } from "mongodb";
import type { Service } from "./services";
import type { SiteContent } from "./content";
import type { Enquiry } from "./enquiries";
import type { CareerApplication, CareerJob } from "./careers";
import type { Offer } from "./offers";
import type { ActivityEvent } from "./activity";

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/agoc";
const DB_NAME = process.env.MONGODB_DB || "agoc";

type ContentDoc = SiteContent & { _id: "site" };
type ServiceDoc = Service & { _id?: string; sortOrder?: number };
type EnquiryDoc = Enquiry & { _id?: string };
type CareerJobDoc = CareerJob & { _id?: string };
type CareerApplicationDoc = CareerApplication & { _id?: string };
type OfferDoc = Offer & { _id?: string };
type ActivityDoc = ActivityEvent & { _id?: string };

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

export async function careersJobsCollection(): Promise<Collection<CareerJobDoc>> {
  return (await getDb()).collection<CareerJobDoc>("career_jobs");
}

export async function careersApplicationsCollection(): Promise<
  Collection<CareerApplicationDoc>
> {
  return (await getDb()).collection<CareerApplicationDoc>("career_applications");
}

export async function offersCollection(): Promise<Collection<OfferDoc>> {
  return (await getDb()).collection<OfferDoc>("offers");
}

export async function activityEventsCollection(): Promise<
  Collection<ActivityDoc>
> {
  return (await getDb()).collection<ActivityDoc>("activity_events");
}

export async function ensureIndexes() {
  const services = await servicesCollection();
  const enquiries = await enquiriesCollection();
  const jobs = await careersJobsCollection();
  const applications = await careersApplicationsCollection();
  const offers = await offersCollection();
  const activity = await activityEventsCollection();
  const users = (await getDb()).collection("users");
  await Promise.all([
    services.createIndex({ slug: 1 }, { unique: true }),
    services.createIndex({ sortOrder: 1 }),
    enquiries.createIndex({ createdAt: -1 }),
    enquiries.createIndex({ status: 1 }),
    enquiries.createIndex({ id: 1 }, { unique: true }),
    jobs.createIndex({ id: 1 }, { unique: true }),
    jobs.createIndex({ sortOrder: 1 }),
    jobs.createIndex({ hidden: 1 }),
    applications.createIndex({ id: 1 }, { unique: true }),
    applications.createIndex({ createdAt: -1 }),
    applications.createIndex({ status: 1 }),
    applications.createIndex({ jobId: 1 }),
    offers.createIndex({ id: 1 }, { unique: true }),
    offers.createIndex({ sortOrder: 1 }),
    offers.createIndex({ hidden: 1 }),
    offers.createIndex({ serviceSlug: 1 }),
    activity.createIndex({ id: 1 }, { unique: true }),
    activity.createIndex({ createdAt: -1 }),
    activity.createIndex({ entity: 1, createdAt: -1 }),
    users.createIndex({ email: 1 }, { unique: true }),
  ]);
}
