import type { Offer } from "@/lib/offers";
import type { Locale } from "./config";

function pick(ar: string | undefined, en: string) {
  const t = ar?.trim();
  return t ? t : en;
}

export function localizeOffer(offer: Offer, locale: Locale): Offer {
  if (locale !== "ar") return offer;
  return {
    ...offer,
    title: pick(offer.titleAr, offer.title),
    summary: pick(offer.summaryAr, offer.summary),
    description: pick(offer.descriptionAr, offer.description),
    badge: pick(offer.badgeAr, offer.badge),
    ctaLabel: pick(offer.ctaLabelAr, offer.ctaLabel),
  };
}

export function localizeOffers(offers: Offer[], locale: Locale): Offer[] {
  return offers.map((offer) => localizeOffer(offer, locale));
}
