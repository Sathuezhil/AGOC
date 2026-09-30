"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import LocaleLink from "./LocaleLink";
import type { Slide } from "@/lib/content";
import { getDictionary, getLocaleFromPathname } from "@/lib/i18n";
import { sameMediaSrc } from "@/lib/media-path";

type HeroContent = {
  eyebrow: string;
  title: string;
  titleItalic: string;
  text: string;
  slides: Slide[];
};

function uniqueSlides(slides: Slide[]) {
  const seen = new Set<string>();
  const out: Slide[] = [];
  for (const slide of slides) {
    if (!slide?.src?.trim()) continue;
    const key = slide.src;
    if ([...seen].some((s) => sameMediaSrc(s, key))) continue;
    seen.add(key);
    out.push(slide);
  }
  return out;
}

export default function Hero({ content }: { content: HeroContent }) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const dict = useMemo(() => getDictionary(locale), [locale]);
  const slides = uniqueSlides(
    content.slides.length
      ? content.slides
      : [{ src: "/images/hero.jpg", alt: "AGOC Security" }],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <section className="hero-section relative min-h-[100svh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={`${slide.src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            unoptimized={slide.src.startsWith("/api/media")}
            className={`object-cover object-[center_42%] ${
              i === index ? "hero-slide-live" : ""
            }`}
          />
        </div>
      ))}

      <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-[7.5rem] pt-28 sm:px-6 sm:pb-32 sm:pt-32 md:justify-center md:pb-28 md:pt-32">
        <div className="hero-copy max-w-xl lg:max-w-2xl">
          <p
            className="olive-label animate-fadeUp text-[0.65rem] font-semibold tracking-[0.28em] text-olive uppercase opacity-0 sm:text-xs rtl:tracking-normal rtl:normal-case"
            style={{ animationDelay: "60ms" }}
          >
            {content.eyebrow}
          </p>

          <h1
            className="mt-3 animate-fadeUp font-display text-[1.85rem] leading-[1.08] tracking-tight text-white opacity-0 sm:mt-5 sm:text-4xl md:text-5xl lg:text-[3.75rem]"
            style={{ animationDelay: "160ms" }}
          >
            <span className="block text-white">{content.title}</span>
            <span className="mt-1 block font-display text-[0.9em] font-normal italic text-white">
              {content.titleItalic}
            </span>
          </h1>

          <p
            className="hero-lead type-body measure mt-3 max-w-[34rem] animate-fadeUp text-[0.95rem] text-white opacity-0 sm:mt-5 sm:text-[1.0625rem]"
            style={{ animationDelay: "280ms" }}
          >
            {content.text}
          </p>

          <div
            className="hero-cta mt-6 flex w-full animate-fadeUp flex-col gap-2.5 opacity-0 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5"
            style={{ animationDelay: "400ms" }}
          >
            <LocaleLink
              href="/contact"
              className="btn-shine group inline-flex w-full items-center justify-center gap-2.5 bg-crimson px-6 py-3.5 text-sm font-semibold tracking-[0.12em] text-white uppercase transition duration-300 hover:bg-crimson-dark sm:w-auto sm:px-7 rtl:tracking-normal rtl:normal-case"
            >
              <Phone size={15} strokeWidth={2.25} />
              {dict.header.getProtection}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              />
            </LocaleLink>
            <LocaleLink
              href="/services"
              className="inline-flex w-full items-center justify-center gap-2 border border-white/55 bg-black/20 px-6 py-3.5 text-sm font-medium tracking-[0.1em] text-white uppercase backdrop-blur-[2px] transition duration-300 hover:border-white/85 hover:bg-black/30 sm:w-auto sm:px-7 rtl:tracking-normal rtl:normal-case"
            >
              {dict.hero.exploreServices}
            </LocaleLink>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-[5.75rem] start-5 z-10 flex items-center gap-2 sm:bottom-8 sm:start-6 md:start-10">
          {slides.map((slide, i) => (
            <button
              key={`${slide.src}-dot-${i}`}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index
                  ? "w-7 bg-white"
                  : "w-1.5 bg-white/35 hover:bg-white/65"
              }`}
            />
          ))}
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-8 end-6 hidden flex-col items-center gap-2 md:flex md:end-10">
        <span className="text-[0.58rem] tracking-[0.28em] text-white/55 uppercase rtl:tracking-normal rtl:normal-case">
          {dict.hero.scroll}
        </span>
        <span className="h-8 w-px overflow-hidden bg-white/15">
          <span className="block h-2.5 w-px bg-olive/90 animate-scroll" />
        </span>
      </div>
    </section>
  );
}
