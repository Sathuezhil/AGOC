"use client";

import { usePathname } from "next/navigation";
import {
  getLocaleFromPathname,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";

export default function LanguageSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";
  const href = switchLocalePath(pathname, nextLocale);

  return (
    <a
      href={href}
      hrefLang={nextLocale}
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={`inline-flex items-center justify-center rounded-lg border border-navy/15 font-medium tracking-wide text-navy transition duration-300 hover:border-crimson/40 hover:text-crimson ${
        compact
          ? "h-10 min-w-10 px-2 text-xs"
          : "px-2.5 py-2 text-xs lg:px-3 lg:py-2.5 lg:text-sm"
      }`}
      onClick={(event) => {
        // Full navigation — soft push + refresh races and mixes EN header with AR body.
        event.preventDefault();
        window.location.assign(href);
      }}
    >
      {nextLocale === "ar" ? "عربي" : "EN"}
    </a>
  );
}
