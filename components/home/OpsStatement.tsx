"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { HomeOps } from "@/lib/home-ops";

const CHIP_SPOTS = [
  { x: 6, y: 66, fx: -260, fy: 120, r: -8 },
  { x: 19, y: 82, fx: -180, fy: 260, r: 6 },
  { x: 36, y: 74, fx: -60, fy: 300, r: -4 },
  { x: 55, y: 84, fx: 80, fy: 280, r: 5 },
  { x: 70, y: 68, fx: 220, fy: 160, r: -6 },
  { x: 80, y: 82, fx: 280, fy: 240, r: 8 },
];

type Chip = HomeOps["statement"]["chips"][number];

function ChipCard({ chip, className, style }: { chip: Chip; className: string; style: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <span className="ops-chip-card-icon">
        <CheckCircle2 size={15} />
      </span>
      <span className="min-w-0">
        <span className="ops-chip-card-title block truncate text-[0.86rem] font-semibold text-white">
          {chip.title}
        </span>
        <span className="ops-chip-card-meta ops-mono block truncate text-[0.68rem] text-white/55">
          {chip.meta}
        </span>
      </span>
    </div>
  );
}

export default function OpsStatement({ copy }: { copy: HomeOps["statement"] }) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const words = copy.lead.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const raw = travel > 0 ? -rect.top / travel : 1;
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const lit = Math.round(progress * 1.5 * words.length);
  const showTurn = progress > 0.62;

  return (
    <section id="ops-statement" ref={ref} className="ops-dark ops-norise ops-statement-sec relative h-[240vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="ops-statement-glow" aria-hidden />

        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          {copy.chips.slice(0, CHIP_SPOTS.length).map((chip, i) => {
            const spot = CHIP_SPOTS[i];
            const k = Math.min(1, Math.max(0, (progress - 0.6 - i * 0.035) / 0.22));
            const e = 1 - Math.pow(1 - k, 3);
            const drift = Math.max(0, progress - 0.85) * -120;
            return (
              <ChipCard
                key={chip.title}
                chip={chip}
                className="ops-chip-card"
                style={{
                  insetInlineStart: `${spot.x}%`,
                  top: `${spot.y}%`,
                  opacity: e,
                  transform: `translate3d(${(spot.fx * (1 - e)).toFixed(1)}px, ${(spot.fy * (1 - e) + drift).toFixed(1)}px, 0) rotate(${(spot.r * (1 - e * 0.7)).toFixed(2)}deg) scale(${(0.85 + e * 0.15).toFixed(3)})`,
                }}
              />
            );
          })}
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center md:-mt-24">
          <p className="ops-statement">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className={`ops-statement-word ${i < lit ? "is-lit" : ""}`}>
                {word}{" "}
              </span>
            ))}
          </p>
          <h2
            className={`ops-statement-turn mt-8 transition-all duration-700 ease-out ${
              showTurn ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-sm"
            }`}
          >
            <span className="ops-accent-dark">{copy.turn}</span>
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-2.5 text-start md:hidden" aria-hidden>
            {copy.chips.slice(0, CHIP_SPOTS.length).map((chip, i) => {
              const k = Math.min(1, Math.max(0, (progress - 0.6 - i * 0.035) / 0.22));
              const e = 1 - Math.pow(1 - k, 3);
              const side = i % 2 === 0 ? -1 : 1;
              return (
                <ChipCard
                  key={chip.title}
                  chip={chip}
                  className="ops-chip-card ops-chip-card-grid"
                  style={{
                    opacity: e,
                    transform: `translate3d(${(side * 40 * (1 - e)).toFixed(1)}px, ${(36 * (1 - e)).toFixed(1)}px, 0) scale(${(0.9 + e * 0.1).toFixed(3)})`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
