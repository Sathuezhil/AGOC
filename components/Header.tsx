"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
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
        className={`border-b bg-white transition-all duration-500 ${
          scrolled
            ? "border-black/10 shadow-lg shadow-black/10"
            : "border-black/5"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5 md:px-6">
          <Link
            href="/"
            aria-label="AGOC Security home"
            className="shrink-0 transition-transform duration-300 hover:scale-[1.02]"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative text-[0.8rem] tracking-[0.14em] uppercase transition duration-300 ${
                    active
                      ? "text-crimson"
                      : "text-ink/70 hover:text-ink"
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

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="btn-shine hidden items-center gap-2 bg-crimson px-4 py-2.5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-crimson-dark hover:shadow-lg lg:inline-flex"
            >
              <Phone size={15} />
              Get Protection
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center bg-crimson text-white transition duration-300 hover:bg-crimson-dark lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-fadeUp border-b border-black/10 bg-white px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-black/10 pb-3 text-lg tracking-wide text-ink transition hover:text-crimson"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 bg-crimson px-4 py-3 text-center text-sm font-medium tracking-wide text-white"
            >
              Get Protection
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
