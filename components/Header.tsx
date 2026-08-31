"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileDown, Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { navLinks, site } from "@/lib/site";
import { profileDownloadName, profilePdfHref } from "@/lib/profile-pdf";

export default function Header({
  logoSrc,
  profilePdf = site.companyProfilePdf,
}: {
  logoSrc: string;
  profilePdf?: string;
}) {
  const pathname = usePathname();
  const profileHref = profilePdfHref(profilePdf);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`site-topbar overflow-x-clip border-b bg-white/95 backdrop-blur-md transition-all duration-500 ${
          scrolled
            ? "border-black/10 shadow-[0_10px_30px_rgba(7,21,37,0.08)]"
            : "border-black/5"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-90" />
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-1 md:px-5 lg:gap-4 lg:px-6">
          <Link
            href="/"
            aria-label="AGOC Security home"
            className="flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <Logo
              src={logoSrc}
              className="h-12 max-w-[9.5rem] sm:h-14 sm:max-w-[11rem] lg:h-16 lg:max-w-[12.5rem]"
            />
          </Link>

          <nav className="hidden min-w-0 items-center gap-3 overflow-hidden lg:flex xl:gap-5">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative shrink-0 text-sm tracking-[0.12em] uppercase transition duration-300 xl:text-[0.95rem] xl:tracking-[0.14em] ${
                    active ? "text-crimson" : "text-navy/70 hover:text-navy"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-crimson transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <ThemeToggle compact />
            <a
              href={profileHref}
              download={profileDownloadName}
              className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-navy/15 px-2.5 py-2 text-xs font-medium tracking-wide text-navy transition duration-300 hover:border-crimson/40 hover:text-crimson md:inline-flex lg:px-3 lg:py-2.5 lg:text-sm"
            >
              <FileDown size={14} />
              <span className="hidden xl:inline">Our Profile</span>
              <span className="xl:hidden">Profile</span>
            </a>
            <Link
              href="/contact"
              className="btn-shine hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-crimson px-3 py-2 text-xs font-medium tracking-wide text-white transition duration-300 hover:bg-crimson-dark hover:shadow-lg md:inline-flex lg:px-4 lg:py-2.5 lg:text-sm"
            >
              <Phone size={14} />
              Get Protection
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-crimson text-white transition duration-300 hover:bg-crimson-dark lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="site-topbar animate-fadeUp border-b border-black/10 bg-white px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-black/10 pb-3 text-lg tracking-wide text-navy transition hover:text-crimson"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={profileHref}
              download={profileDownloadName}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-navy/15 px-4 py-3 text-center text-sm font-medium tracking-wide text-navy transition hover:border-crimson/40 hover:text-crimson"
            >
              <FileDown size={15} />
              Our Profile
            </a>
            <Link
              href="/contact"
              className="mt-2 rounded-lg bg-crimson px-4 py-3 text-center text-sm font-medium tracking-wide text-white"
            >
              Get Protection
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
