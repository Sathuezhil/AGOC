import { BadgeCheck, Clock3, ShieldCheck, UserRound } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { HomeOps } from "@/lib/home-ops";

const icons = [ShieldCheck, Clock3, BadgeCheck, UserRound];

export default function OpsTrust({ copy }: { copy: HomeOps["trust"] }) {
  return (
    <section className="ops-dark relative overflow-hidden py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl px-5">
        <p className="ops-eyebrow ops-eyebrow-dark">{copy.label}</p>
        <h2 className="ops-h2 mt-4 text-white">
          {copy.title} <span className="ops-accent-dark">{copy.accent}</span>
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.items.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck;
            return (
              <Reveal key={item.title} delay={i * 90} className="h-full">
                <article className="ops-trust-card h-full">
                  <span className="ops-trust-icon">
                    <Icon size={20} />
                  </span>
                  <p className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-[2.6rem]">
                    {item.value}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-white/70">{item.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="ops-mono mt-10 text-[0.72rem] text-white/45">{copy.footnote}</p>
      </div>
    </section>
  );
}
