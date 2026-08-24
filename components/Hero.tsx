"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Slide } from "@/lib/content";

type HeroContent = {
  eyebrow: string;
  title: string;
  titleItalic: string;
  text: string;
  slides: Slide[];
};

export default function Hero({ content }: { content: HeroContent }) {
  const slides = content.slides.length
    ? content.slides
    : [{ src: "/images/hero.jpg", alt: "AGOC Security" }];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 7500);
    return () => window.clearInterval(id);
  }, [index, slides.length]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={`${slide.src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            key={`${slide.src}-${i === index ? "live" : "idle"}`}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            unoptimized={slide.src.startsWith("/api/media")}
            className={`object-cover object-center ${
              i === index ? "animate-kenburnsPulse" : ""
            }`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#121214] via-[#1E1E22]/82 to-crimson/45 animate-fadeIn" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/35" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-24 pt-44 md:justify-center md:pb-28">
        <p
          className="olive-label animate-fadeUp text-sm font-semibold tracking-[0.38em] text-olive uppercase opacity-0"
          style={{ animationDelay: "80ms" }}
        >
          {content.eyebrow}
        </p>
        <h1
          className="mt-5 max-w-3xl animate-fadeUp font-display text-5xl leading-[0.95] text-white opacity-0 md:text-7xl"
          style={{ animationDelay: "220ms" }}
        >
          {content.title}
          <span className="block italic text-[#F7F4EF]">{content.titleItalic}</span>
        </h1>
        <p
          className="mt-6 max-w-xl animate-fadeUp text-base leading-relaxed text-white/80 opacity-0 md:text-lg"
          style={{ animationDelay: "380ms" }}
        >
          {content.text}
        </p>
        <div
          className="mt-9 flex animate-fadeUp flex-wrap gap-4 opacity-0"
          style={{ animationDelay: "520ms" }}
        >
          <Link
            href="/contact"
            className="btn-shine group inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold tracking-wide text-crimson-dark transition duration-300 hover:bg-[#F0EDE7]"
          >
            Contact us
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-white/35 px-6 py-3.5 text-sm font-medium tracking-wide text-white transition duration-300 hover:border-olive hover:text-olive"
          >
            Explore services
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[0.62rem] tracking-[0.28em] text-white/70 uppercase">
          Scroll
        </span>
        <span className="h-9 w-px overflow-hidden bg-white/20">
          <span className="block h-3 w-px bg-olive animate-scroll" />
        </span>
      </div>

      <div className="absolute bottom-8 left-6 z-10 flex gap-2 md:left-10">
        {slides.map((slide, i) => (
          <button
            key={`${slide.src}-dot-${i}`}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
