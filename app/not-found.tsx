import { ArrowRight, Phone } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <section className="ops-light relative flex min-h-[88vh] items-center overflow-hidden px-5 pb-20 pt-32 text-center">
      <div className="ops-hero-glow ops-hero-glow-a" aria-hidden />
      <div className="ops-hero-glow ops-hero-glow-b" aria-hidden />
      <div className="relative mx-auto max-w-2xl">
        <p className="ops-404 animate-fadeUp opacity-0" aria-hidden>
          <span className="ops-accent">404</span>
        </p>
        <h1
          className="ops-h2 mt-2 animate-fadeUp text-[#0B1F2A] opacity-0"
          style={{ animationDelay: "120ms" }}
        >
          {dict.notFound.title}
        </h1>
        <p
          className="mx-auto mt-5 max-w-md animate-fadeUp text-[1.05rem] leading-relaxed text-[#4A5A6B] opacity-0"
          style={{ animationDelay: "220ms" }}
        >
          {dict.notFound.text}
        </p>
        <div
          className="mt-9 flex animate-fadeUp flex-col items-center justify-center gap-3 opacity-0 sm:flex-row"
          style={{ animationDelay: "320ms" }}
        >
          <LocaleLink href="/" className="ops-btn ops-btn-primary w-full sm:w-auto">
            {dict.notFound.back}
            <ArrowRight size={17} className="rtl:rotate-180" />
          </LocaleLink>
          <LocaleLink href="/contact" className="ops-btn ops-btn-ghost w-full sm:w-auto">
            <Phone size={16} />
            {dict.hero.contactUs}
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
