import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";
import { getLocaleFromPathname } from "./path";

export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromHeader = h.get("x-locale");
  if (isLocale(fromHeader)) return fromHeader;
  const pathname = h.get("x-pathname") ?? "";
  return getLocaleFromPathname(pathname) || defaultLocale;
}
