export { locales, defaultLocale, LOCALE_COOKIE, isLocale, isRtl } from "./config";
export type { Locale } from "./config";
export { getDictionary } from "./dictionary";
export type { Dictionary } from "./dictionary";
export {
  localePath,
  stripLocale,
  getLocaleFromPathname,
  switchLocalePath,
} from "./path";
export {
  localizeContent,
  localizeService,
  localizeServices,
  localizeJob,
  localizeJobs,
  localizeOffer,
  localizeOffers,
} from "./localize";

/** Server-only: import from `@/lib/i18n/server` — uses next/headers. */
