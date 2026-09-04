"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getLocaleFromPathname, localePath } from "@/lib/i18n";

type Props = Omit<LinkProps, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

/** Link that keeps the current EN/AR locale prefix. */
export default function LocaleLink({ href, children, ...rest }: Props) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const localized =
    typeof href === "string" && href.startsWith("/")
      ? localePath(href, locale)
      : href;

  return (
    <Link href={localized} {...rest}>
      {children}
    </Link>
  );
}
