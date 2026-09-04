import { randomUUID } from "crypto";

export type ActivityEntity =
  | "auth"
  | "enquiry"
  | "career_job"
  | "career_application"
  | "offer"
  | "service"
  | "team"
  | "content"
  | "media"
  | "settings";

export type ActivityEvent = {
  id: string;
  action: string;
  actorEmail: string;
  entity: ActivityEntity;
  entityId?: string;
  summary: string;
  createdAt: string;
};

function stripMongo<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const { _id: _unused, ...rest } = doc;
  void _unused;
  return rest;
}

/** Fire-and-forget admin audit entry — never throws to callers. */
export async function logActivity(input: {
  action: string;
  actorEmail: string;
  entity: ActivityEntity;
  entityId?: string;
  summary: string;
}) {
  try {
    const email = input.actorEmail.trim().toLowerCase();
    if (!email) return;
    const { activityEventsCollection, ensureIndexes } = await import("./db");
    await ensureIndexes();
    const event: ActivityEvent = {
      id: randomUUID(),
      action: input.action.trim(),
      actorEmail: email,
      entity: input.entity,
      entityId: input.entityId?.trim() || undefined,
      summary: input.summary.trim().slice(0, 400),
      createdAt: new Date().toISOString(),
    };
    await (await activityEventsCollection()).insertOne(event);
  } catch {
    // Never break admin actions if logging fails.
  }
}

export async function listActivity(opts?: {
  limit?: number;
  entity?: ActivityEntity | "all";
  query?: string;
}) {
  const { activityEventsCollection, ensureIndexes } = await import("./db");
  await ensureIndexes();
  const limit = Math.min(Math.max(opts?.limit ?? 200, 1), 500);
  const filter: Record<string, unknown> = {};
  if (opts?.entity && opts.entity !== "all") {
    filter.entity = opts.entity;
  }
  const q = opts?.query?.trim();
  if (q) {
    const re = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    filter.$or = [
      { summary: re },
      { actorEmail: re },
      { action: re },
      { entityId: re },
    ];
  }
  const docs = await (await activityEventsCollection())
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((doc) => stripMongo(doc) as ActivityEvent);
}
