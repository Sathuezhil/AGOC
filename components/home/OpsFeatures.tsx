import { ArrowRight, Check } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import type { HomeOps } from "@/lib/home-ops";
import OpsTag from "./OpsTag";

const skins = ["ops-feature-blue", "ops-feature-navy", "ops-feature-white", "ops-feature-gold"];

export default function OpsFeatures({ copy }: { copy: HomeOps["features"] }) {
  return (
    <section className="ops-light pb-20 pt-6 md:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="ops-eyebrow">{copy.label}</p>
          <h2 className="ops-h2 mt-4">
            {copy.title} <span className="ops-accent">{copy.accent}</span>
          </h2>
        </div>

        <div className="mt-12 space-y-6">
          {copy.items.map((item, i) => (
            <article
              key={item.slug}
              className={`ops-feature ${skins[i % skins.length]}`}
              style={{ top: `calc(6.5rem + ${i * 1.25}rem)` }}
            >
              <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
                <div>
                  <p className="ops-feature-kicker">{item.kicker}</p>
                  <h3 className="ops-feature-title mt-3">{item.title}</h3>
                  <p className="ops-feature-text mt-4 max-w-xl">{item.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3 text-[0.98rem]">
                        <span className="ops-feature-check">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <LocaleLink href={`/services/${item.slug}`} className="ops-feature-link mt-7">
                    {copy.more}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </LocaleLink>
                </div>

                <div className="ops-feature-visual">
                  <p className="ops-mono mb-3 text-[0.62rem] tracking-[0.2em] uppercase opacity-70 rtl:tracking-normal">
                    {item.kicker}
                  </p>
                  <ul className="space-y-2">
                    {item.visual.map((row) => (
                      <li key={row.label} className="ops-feature-visual-row">
                        <span className="text-[0.9rem] font-medium text-[#0B1F2A]">{row.label}</span>
                        <OpsTag tone={row.tone}>{row.value}</OpsTag>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
