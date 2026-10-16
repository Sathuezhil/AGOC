"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import LocaleLink from "./LocaleLink";
import {
  getDictionary,
  getLocaleFromPathname,
  localePath,
} from "@/lib/i18n";
import { profileDownloadName, profilePdfHref } from "@/lib/profile-pdf";
import { site } from "@/lib/site";

const TOP_TEXT =
  "text-[0.8rem] font-semibold tracking-[0.08em] uppercase xl:text-sm xl:tracking-[0.1em] rtl:tracking-normal rtl:normal-case";
const MENU_TEXT =
  "text-sm font-semibold tracking-[0.1em] uppercase rtl:tracking-normal rtl:normal-case";

export default function Header({
  profilePdf = site.companyProfilePdf,
}: {
  profilePdf?: string;
}) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const dict = useMemo(() => getDictionary(locale), [locale]);
  const profileHref = profilePdfHref(profilePdf);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = useMemo(
    () => [
      { href: "/", label: dict.nav.home },
      { href: "/about", label: dict.nav.about },
      { href: "/services", label: dict.nav.services },
      { href: "/careers", label: dict.nav.careers },
      { href: "/contact", label: dict.nav.contact },
    ],
    [dict],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("font-arabic", locale === "ar");
  }, [locale]);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-40" data-open={open ? "1" : undefined}>
      <div
        className={`site-topbar overflow-x-clip border-b bg-white/95 backdrop-blur-md transition-all duration-500 ${
          scrolled
            ? "border-[#0B1F2A]/10 shadow-[0_10px_30px_rgba(11,31,42,0.08)]"
            : "border-black/5"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-90" />
        <div className="mx-auto grid min-h-[3.75rem] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:px-4 md:px-5 lg:gap-3 lg:px-6">
          <nav className="hidden min-w-0 items-center justify-start gap-4 lg:flex xl:gap-7">
            {links.map((link) => {
              const full = localePath(link.href, locale);
              const active =
                pathname === full ||
                (link.href !== "/" && pathname.startsWith(full));
              return (
                <LocaleLink
                  key={link.href}
                  href={link.href}
                  className={`group relative shrink-0 ${TOP_TEXT} transition duration-300 ${
                    active ? "text-crimson" : "text-navy/70 hover:text-navy"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 start-0 h-px bg-crimson transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </LocaleLink>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <LanguageSwitcher compact />
            <a
              href={profileHref}
              download={profileDownloadName}
              className={`olive-label !hidden shrink-0 whitespace-nowrap ${TOP_TEXT} text-olive transition duration-300 hover:opacity-80 lg:!inline-flex`}
            >
              {dict.header.ourProfile}
            </a>
            <LocaleLink
              href="/contact"
              className={`btn-shine hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-crimson px-3 py-2 ${TOP_TEXT} text-white transition duration-300 hover:bg-crimson-dark md:inline-flex xl:px-4 xl:py-2.5`}
            >
              <Phone size={15} strokeWidth={2.25} />
              {dict.header.getProtection}
            </LocaleLink>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-crimson text-white transition duration-300 hover:bg-crimson-dark lg:hidden"
              aria-label={open ? dict.header.closeMenu : dict.header.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="site-topbar animate-fadeUp border-b border-[#0B1F2A]/10 bg-white px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className={`border-b border-[#0B1F2A]/08 py-3 ${MENU_TEXT} text-navy transition hover:text-crimson`}
              >
                {link.label}
              </LocaleLink>
            ))}
            <a
              href={profileHref}
              download={profileDownloadName}
              className={`olive-label mt-3 py-3 ${MENU_TEXT} text-olive transition hover:opacity-80`}
            >
              {dict.header.ourProfile}
            </a>
            <LocaleLink
              href="/contact"
              className={`btn-shine mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-crimson px-4 py-3 text-center ${MENU_TEXT} text-white`}
            >
              <Phone size={15} />
              {dict.header.getProtection}
            </LocaleLink>
          </nav>
        </div>
      )}
    </header>
  );
}
