import Image from "next/image";
import { ArrowRight, Building2, Cctv, ShieldCheck, Users } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import SplitText from "@/components/motion/SplitText";
import type { HomeOps, OpsFloatCard } from "@/lib/home-ops";
import OpsBrandFly from "./OpsBrandFly";
import OpsTag from "./OpsTag";

const MARK_SRC = "/images/agoc-mark-hd.png";
const BRAND_NAME = "AGOC";

const icons: Record<OpsFloatCard["icon"], typeof ShieldCheck> = {
  guard: ShieldCheck,
  cctv: Cctv,
  facility: Building2,
  event: Users,
};

function FloatCard({ card, className }: { card: OpsFloatCard; className: string }) {
  const Icon = icons[card.icon];
  return (
    <div className={`ops-float ${className}`}>
      <span className={`ops-float-icon ops-float-icon-${card.tone}`}>
        <Icon size={18} strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.95rem] font-semibold text-[#0B1F2A]">
          {card.title}
        </span>
        <span className="ops-mono block truncate text-[0.72rem] text-[#5B6B7C]">
          {card.meta}
        </span>
      </span>
      <OpsTag tone={card.tone} className="ms-auto">
        {card.tag}
      </OpsTag>
    </div>
  );
}

export default function OpsHero({ copy, rtl = false }: { copy: HomeOps["hero"]; rtl?: boolean }) {
  const [a, b, c, d] = copy.cards;
  return (
    <section data-scene className="ops-light ops-hero ops-hero-fly relative">
      <div className="ops-hero-stage">
        <div className="ops-hero-glow ops-hero-glow-a" aria-hidden />
        <div className="ops-hero-glow ops-hero-glow-b" aria-hidden />

        <div className="pointer-events-none absolute inset-0 z-[2] hidden lg:block" aria-hidden>
          {a ? (
            <div className="ops-fly" style={{ "--fx": -1, "--fy": -0.6 } as React.CSSProperties}>
              <FloatCard card={a} className="ops-float-pos-a" />
            </div>
          ) : null}
          {b ? (
            <div className="ops-fly" style={{ "--fx": -1, "--fy": 0.7 } as React.CSSProperties}>
              <FloatCard card={b} className="ops-float-pos-b" />
            </div>
          ) : null}
          {c ? (
            <div className="ops-fly" style={{ "--fx": 1, "--fy": -0.6 } as React.CSSProperties}>
              <FloatCard card={c} className="ops-float-pos-c" />
            </div>
          ) : null}
          {d ? (
            <div className="ops-fly" style={{ "--fx": 1, "--fy": 0.7 } as React.CSSProperties}>
              <FloatCard card={d} className="ops-float-pos-d" />
            </div>
          ) : null}
        </div>

        <div className="ops-hero-dark" aria-hidden />

        <div className="ops-hero-content relative z-[3] mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 pb-6 pt-[4.75rem] text-center sm:pb-10 sm:pt-24">
          <div className="ops-hero-brand" dir="ltr">
            <span className="ops-hero-mark">
              <Image src={MARK_SRC} alt="" width={1035} height={1035} priority unoptimized />
            </span>
            <p className="ops-hero-brand-name" data-brand-slot>
              {BRAND_NAME}
            </p>
            <p className="ops-hero-brand-sub">SECURITY SERVICES L.L.C</p>
          </div>

          <p className="ops-pill mt-4 animate-fadeUp sm:mt-5 opacity-0" style={{ animationDelay: "60ms" }}>
            <span className="ops-pill-dot" aria-hidden />
            {copy.badge}
          </p>

          <h1 className="ops-h1 mt-4 sm:mt-5" data-kinetic data-base="750" data-peak="900">
            <SplitText
              rtl={rtl}
              lineBreak
              delay={180}
              parts={[{ text: copy.title }, { text: copy.accent, accent: true }]}
            />
          </h1>

          <p
            className="ops-hero-text mt-4 max-w-2xl animate-fadeUp text-[0.95rem] leading-relaxed text-[#3E4F61] opacity-0 sm:mt-5 sm:text-lg"
            style={{ animationDelay: "520ms" }}
          >
            {copy.text}
          </p>

          <div
            className="mt-6 flex w-full animate-fadeUp sm:mt-8 flex-col items-center justify-center gap-3 opacity-0 sm:w-auto sm:flex-row"
            style={{ animationDelay: "640ms" }}
          >
            <LocaleLink href="#enquire" className="ops-btn ops-btn-primary w-full sm:w-auto">
              {copy.primary}
              <ArrowRight size={17} className="rtl:rotate-180" />
            </LocaleLink>
            <a href="#ops-demo" className="ops-btn ops-btn-ghost w-full sm:w-auto">
              {copy.secondary}
            </a>
          </div>

          <a
            href="#ops-statement"
            className="ops-mono ops-scroll-cue mt-10 hidden flex-col items-center gap-3 text-[0.68rem] tracking-[0.24em] text-[#5B6B7C] uppercase md:flex rtl:tracking-normal"
          >
            <span className="ops-mouse" aria-hidden>
              <span />
            </span>
            {copy.scroll}
          </a>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[4]">
          <OpsBrandFly text={BRAND_NAME} />
        </div>
      </div>
    </section>
  );
}
