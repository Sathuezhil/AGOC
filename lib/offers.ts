import { randomUUID } from "crypto";

export type Offer = {
  id: string;
  /** Linked service slug — required. Offer is for this service. */
  serviceSlug: string;
  title: string;
  summary: string;
  description: string;
  /** Short badge e.g. "Limited" / "20% off" */
  badge: string;
  ctaLabel: string;
  /** Usually /?service=slug#enquire */
  ctaHref: string;
  image: string;
  titleAr?: string;
  summaryAr?: string;
  descriptionAr?: string;
  badgeAr?: string;
  ctaLabelAr?: string;
  hidden?: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function stripMongo<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const { _id: _unused, ...rest } = doc;
  void _unused;
  return rest;
}

async function translateOfferAr(fields: {
  title: string;
  summary: string;
  description: string;
  badge: string;
  ctaLabel: string;
}) {
  const { translateToAr } = await import("./translate-ar");
  return {
    titleAr: await translateToAr(fields.title),
    summaryAr: await translateToAr(fields.summary),
    descriptionAr: fields.description
      ? await translateToAr(fields.description)
      : "",
    badgeAr: fields.badge ? await translateToAr(fields.badge) : "",
    ctaLabelAr: fields.ctaLabel ? await translateToAr(fields.ctaLabel) : "",
  };
}

async function resolveFromService(serviceSlug: string) {
  const { getService } = await import("./services");
  const service = await getService(serviceSlug);
  if (!service) return null;
  return {
    serviceSlug: service.slug,
    title: service.title,
    summary: service.short,
    image: service.image || "",
    ctaHref: `/?service=${encodeURIComponent(service.slug)}#enquire`,
  };
}

export async function listOffers(opts?: { includeHidden?: boolean }) {
  const { offersCollection } = await import("./db");
  await ensureOffersReady();
  const filter = opts?.includeHidden ? {} : { hidden: { $ne: true } };
  const docs = await (await offersCollection())
    .find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .toArray();
  return docs.map((doc) => stripMongo(doc) as Offer);
}

export async function listOffersForService(
  serviceSlug: string,
  opts?: { includeHidden?: boolean },
) {
  const slug = serviceSlug.trim();
  if (!slug) return [];
  const { offersCollection } = await import("./db");
  await ensureOffersReady();
  const filter: Record<string, unknown> = { serviceSlug: slug };
  if (!opts?.includeHidden) filter.hidden = { $ne: true };
  const docs = await (await offersCollection())
    .find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .toArray();
  return docs.map((doc) => stripMongo(doc) as Offer);
}

/** First live badge per service slug (for overlays on service cards). */
export function offerBadgeByService(offers: Offer[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const offer of offers) {
    const slug = offer.serviceSlug?.trim();
    const badge = offer.badge?.trim();
    if (!slug || !badge || map[slug]) continue;
    map[slug] = badge;
  }
  return map;
}

export async function getOffer(id: string) {
  const { offersCollection } = await import("./db");
  await ensureOffersReady();
  const doc = await (await offersCollection()).findOne({ id });
  if (!doc) return null;
  return stripMongo(doc) as Offer;
}

export async function createOffer(input: {
  serviceSlug: string;
  badge?: string;
  description?: string;
  ctaLabel?: string;
  hidden?: boolean;
  sortOrder?: number;
}) {
  const { offersCollection } = await import("./db");
  await ensureOffersReady();
  const col = await offersCollection();
  const count = await col.countDocuments();
  const now = new Date().toISOString();

  const slug = input.serviceSlug.trim();
  if (!slug) throw new Error("Service is required.");

  const fromService = await resolveFromService(slug);
  if (!fromService) throw new Error("Selected service was not found.");

  const badge = (input.badge || "").trim();
  const description = (input.description || "").trim();
  const ctaLabel = (input.ctaLabel || "Book now").trim();

  const ar = await translateOfferAr({
    title: fromService.title,
    summary: fromService.summary,
    description,
    badge,
    ctaLabel,
  });

  const offer: Offer = {
    id: randomUUID(),
    serviceSlug: fromService.serviceSlug,
    title: fromService.title,
    summary: fromService.summary,
    description,
    badge,
    ctaLabel,
    ctaHref: fromService.ctaHref,
    image: fromService.image,
    ...ar,
    hidden: Boolean(input.hidden),
    sortOrder: typeof input.sortOrder === "number" ? input.sortOrder : count,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(offer);
  return offer;
}

export async function updateOffer(
  id: string,
  patch: Partial<{
    serviceSlug: string;
    badge: string;
    description: string;
    ctaLabel: string;
    hidden: boolean;
    sortOrder: number;
  }>,
) {
  const { offersCollection } = await import("./db");
  await ensureOffersReady();
  const col = await offersCollection();
  const existing = await col.findOne({ id });
  if (!existing) return null;

  const nextSlug =
    patch.serviceSlug !== undefined
      ? patch.serviceSlug.trim()
      : String(existing.serviceSlug || "");

  let nextTitle = String(existing.title || "");
  let nextSummary = String(existing.summary || "");
  let nextImage = String(existing.image || "");
  let nextCtaHref = String(existing.ctaHref || "#enquire");

  if (patch.serviceSlug !== undefined || !existing.serviceSlug) {
    if (!nextSlug) throw new Error("Service is required.");
    const fromService = await resolveFromService(nextSlug);
    if (!fromService) throw new Error("Selected service was not found.");
    nextTitle = fromService.title;
    nextSummary = fromService.summary;
    nextImage = fromService.image;
    nextCtaHref = fromService.ctaHref;
  }

  const nextBadge =
    patch.badge !== undefined ? patch.badge.trim() : String(existing.badge || "");
  const nextDescription =
    patch.description !== undefined
      ? patch.description.trim()
      : String(existing.description || "");
  const nextCtaLabel =
    patch.ctaLabel !== undefined
      ? patch.ctaLabel.trim()
      : String(existing.ctaLabel || "Book now");

  const enChanged =
    patch.serviceSlug !== undefined ||
    patch.badge !== undefined ||
    patch.description !== undefined ||
    patch.ctaLabel !== undefined ||
    !existing.titleAr;

  const $set: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
    serviceSlug: nextSlug,
    title: nextTitle,
    summary: nextSummary,
    image: nextImage,
    ctaHref: nextCtaHref,
    badge: nextBadge,
    description: nextDescription,
    ctaLabel: nextCtaLabel,
  };
  if (patch.hidden !== undefined) $set.hidden = Boolean(patch.hidden);
  if (patch.sortOrder !== undefined) $set.sortOrder = patch.sortOrder;

  if (enChanged) {
    Object.assign(
      $set,
      await translateOfferAr({
        title: nextTitle,
        summary: nextSummary,
        description: nextDescription,
        badge: nextBadge,
        ctaLabel: nextCtaLabel,
      }),
    );
  }

  const result = await col.findOneAndUpdate(
    { id },
    { $set },
    { returnDocument: "after" },
  );
  if (!result) return null;
  return stripMongo(result) as Offer;
}

export async function deleteOffer(id: string) {
  const { offersCollection } = await import("./db");
  await ensureOffersReady();
  const result = await (await offersCollection()).deleteOne({ id });
  return result.deletedCount > 0;
}

let offersReady = false;
let offersReadyPromise: Promise<void> | null = null;

async function ensureOffersReady() {
  if (offersReady) return;
  if (offersReadyPromise) return offersReadyPromise;
  offersReadyPromise = (async () => {
    const { ensureIndexes } = await import("./db");
    await ensureIndexes();
    offersReady = true;
  })();
  try {
    await offersReadyPromise;
  } finally {
    offersReadyPromise = null;
  }
}
