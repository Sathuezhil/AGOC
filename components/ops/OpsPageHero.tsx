import { ArrowRight } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import SplitText from "@/components/motion/SplitText";
import { isRtl } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { splitAccent } from "@/lib/pages-ops";

type Action = { href: string; label: string; external?: boolean; icon?: React.ReactNode };

function ActionLink({ action, primary }: { action: Action; primary: boolean }) {
  const className = `ops-btn ${primary ? "ops-btn-primary" : "ops-btn-ghost"} w-full sm:w-auto`;
  const body = (
    <>
      {action.icon}
      {action.label}
      {primary ? <ArrowRight size={17} className="rtl:rotate-180" /> : null}
    </>
  );
  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return (
    <LocaleLink href={action.href} className={className}>
      {body}
    </LocaleLink>
  );
}

export default async function OpsPageHero({
  eyebrow,
  title,
  accent,
  text,
  primary,
  secondary,
  chips,
  visual,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  text: string;
  primary?: Action;
  secondary?: Action;
  chips?: string[];
  visual?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  const [lead, tail] = accent === undefined ? splitAccent(title) : [title, accent];
  const centered = !visual;
  const rtl = isRtl(await getLocale());

  return (
    <section data-spot className="ops-light ops-page-hero relative overflow-hidden">
      <div className="ops-hero-glow ops-hero-glow-a" aria-hidden />
      <div className="ops-hero-glow ops-hero-glow-b" aria-hidden />

      <div
        className={`relative mx-auto max-w-6xl px-5 pb-16 pt-32 md:pb-24 md:pt-40 ${
          centered ? "text-center" : "grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
        }`}
      >
        <div className={centered ? "mx-auto max-w-3xl" : "min-w-0"}>
          {breadcrumb ? (
            <div className="ops-mono mb-5 animate-fadeUp text-[0.72rem] text-[#5B6B7C] opacity-0">
              {breadcrumb}
            </div>
          ) : null}
          <p className="ops-pill animate-fadeUp opacity-0" style={{ animationDelay: "60ms" }}>
            <span className="ops-pill-dot" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="ops-h1 ops-h1-page mt-6" data-kinetic data-base="750" data-peak="900">
            <SplitText
              rtl={rtl}
              delay={200}
              stagger={18}
              parts={[...(lead ? [{ text: lead }] : []), { text: tail, accent: true }]}
            />
          </h1>
          <p
            className={`mt-6 animate-fadeUp text-[1.05rem] leading-relaxed text-[#3E4F61] opacity-0 sm:text-lg ${
              centered ? "mx-auto max-w-2xl" : "max-w-xl"
            }`}
            style={{ animationDelay: "280ms" }}
          >
            {text}
          </p>

          {primary || secondary ? (
            <div
              className={`mt-9 flex animate-fadeUp flex-col gap-3 opacity-0 sm:flex-row ${
                centered ? "items-center justify-center" : ""
              }`}
              style={{ animationDelay: "400ms" }}
            >
              {primary ? <ActionLink action={primary} primary /> : null}
              {secondary ? <ActionLink action={secondary} primary={false} /> : null}
            </div>
          ) : null}

          {chips?.length ? (
            <ul
              className={`mt-9 flex animate-fadeUp flex-wrap gap-2 opacity-0 ${centered ? "justify-center" : ""}`}
              style={{ animationDelay: "520ms" }}
            >
              {chips.map((chip) => (
                <li key={chip} className="ops-chip">
                  <span className="ops-chip-dot" aria-hidden />
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {visual ? (
          <div className="min-w-0 animate-fadeUp opacity-0" style={{ animationDelay: "360ms" }}>
            {visual}
          </div>
        ) : null}
      </div>
    </section>
  );
}
