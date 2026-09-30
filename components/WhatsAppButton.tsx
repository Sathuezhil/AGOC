"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getDictionary, getLocaleFromPathname } from "@/lib/i18n";
import { site } from "@/lib/site";

export default function WhatsAppButton() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const dict = useMemo(() => getDictionary(locale), [locale]);
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    dict.whatsapp.message,
  )}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.whatsapp.aria}
      className="wa-fab fixed z-40 flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
    >
      <span className="wa-fab-ring wa-fab-ring-a" aria-hidden />
      <span className="wa-fab-ring wa-fab-ring-b" aria-hidden />
      <span className="wa-fab-core relative z-10 flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14">
        <Image
          src="/api/media/images/whatsapp.png"
          alt=""
          width={40}
          height={40}
          className="h-8 w-8 object-contain sm:h-10 sm:w-10"
          priority
          unoptimized
        />
      </span>
    </Link>
  );
}
