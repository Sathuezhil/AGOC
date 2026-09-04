import { defaultLocale, type Locale } from "./config";

/** Strip `/ar` prefix from a pathname. */
export function stripLocale(pathname: string) {
  if (pathname === "/ar") return "/";
  if (pathname.startsWith("/ar/")) {
    const rest = pathname.slice(3);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname || "/";
}

export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  return defaultLocale;
}

/** Build a locale-aware public path. Admin/login stay unprefixed. */
export function localePath(path: string, locale: Locale) {
  if (!path.startsWith("/")) return path;

  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] || "/";
  const suffix = match?.[2] || "";

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login")
  ) {
    return `${pathname}${suffix}`;
  }

  if (locale === "ar") {
    const prefixed = pathname === "/" ? "/ar" : `/ar${pathname}`;
    return `${prefixed}${suffix}`;
  }

  return `${pathname}${suffix}`;
}

/** Switch the current browser path to another locale. */
export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const base = stripLocale(pathname);
  return localePath(base, nextLocale);
}
