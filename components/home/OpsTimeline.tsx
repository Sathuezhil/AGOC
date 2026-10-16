import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { HomeOps } from "@/lib/home-ops";

const pct = (hours: number) => `${(hours / 24) * 100}%`;

export default function OpsTimeline({ copy }: { copy: HomeOps["timeline"] }) {
  return (
    <section className="ops-dark relative overflow-hidden py-20 md:py-28">
      <div className="ops-statement-glow opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="ops-eyebrow ops-eyebrow-dark">{copy.label}</p>
          <h2 className="ops-h2 mt-4 text-white">
            {copy.title} <span className="ops-accent-dark">{copy.accent}</span>
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-white/80">{copy.text}</p>
          <ul className="mt-7 space-y-3">
            {copy.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3 text-white/90">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0066FF]/25 text-[#8EC4FF]">
                  <Check size={13} strokeWidth={3} />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="ops-roster">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{copy.panelTitle}</p>
              <p className="ops-mono text-[0.7rem] text-white/55">{copy.panelMeta}</p>
            </div>

            <div className="mt-6 grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <span />
              <div className="ops-mono flex justify-between text-[0.6rem] text-white/45 sm:text-[0.66rem]">
                {copy.hours.map((h, i) => (
                  <span key={`${h}-${i}`} className={i % 2 ? "hidden sm:inline" : undefined}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mt-3 space-y-3">
              {copy.rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                >
                  <span className="truncate text-[0.8rem] text-white/75 sm:text-sm">{row.label}</span>
                  <div className="ops-track">
                    {row.kind === "span" ? (
                      <span
                        className={`ops-span ops-span-${row.tone}`}
                        style={{
                          insetInlineStart: pct(row.from ?? 0),
                          width: pct((row.to ?? 24) - (row.from ?? 0)),
                        }}
                      />
                    ) : (
                      row.points?.map((p) => (
                        <span
                          key={p}
                          className={`ops-point ops-point-${row.tone}`}
                          style={{ insetInlineStart: `calc(${pct(p)} - 5px)` }}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
              <div
                className="pointer-events-none absolute inset-y-0 end-0 start-[8.5rem] sm:start-[10rem]"
                aria-hidden
              >
                <span className="ops-now" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
