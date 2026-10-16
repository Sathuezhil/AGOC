import { BatteryFull, Check, CheckCheck, Paperclip, Signal, Wifi } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { HomeOps } from "@/lib/home-ops";

export default function OpsReport({ copy }: { copy: HomeOps["report"] }) {
  const p = copy.phone;
  return (
    <section className="ops-light py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        <Reveal motion="left" className="order-2 lg:order-1">
          <div className="ops-phone mx-auto">
            <div className="ops-phone-screen">
              <div className="flex items-center justify-between px-6 pt-4 text-[0.72rem] font-semibold text-[#0B1F2A]">
                <span>{p.time}</span>
                <span className="flex items-center gap-1" aria-hidden>
                  <Signal size={12} />
                  <Wifi size={12} />
                  <BatteryFull size={14} />
                </span>
              </div>
              <div className="ops-phone-notch" aria-hidden />

              <p className="px-5 pt-5 text-lg font-bold text-[#0B1F2A]">{p.inbox}</p>
              <div className="mx-3 mt-2 flex gap-3 rounded-2xl bg-[#EAF2FF] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B1F2A] text-[0.7rem] font-bold text-white">
                  AG
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[0.82rem] font-semibold text-[#0B1F2A]">{p.from}</span>
                    <span className="ops-mono text-[0.62rem] text-[#6B7A8B]">{p.sentAt}</span>
                  </span>
                  <span className="block truncate text-[0.78rem] font-medium text-[#0B1F2A]">{p.subject}</span>
                  <span className="block truncate text-[0.72rem] text-[#6B7A8B]">{p.preview}</span>
                </span>
              </div>

              <div className="ops-phone-mail">
                <p className="text-[0.95rem] font-bold text-[#0B1F2A]">{p.subject}</p>
                <p className="ops-mono mt-0.5 text-[0.62rem] text-[#6B7A8B]">
                  {p.from} · {p.sentAt}
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-[#2E3F50]">{p.greeting}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {p.stats.map((s) => (
                    <div key={s.label} className="rounded-xl bg-[#F3F6FA] px-2 py-2.5 text-center">
                      <p className="text-lg font-bold text-[#0B1F2A]">{s.value}</p>
                      <p className="text-[0.62rem] text-[#6B7A8B]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-[#F2C94C]/50 bg-[#FFF8E1] p-2.5">
                  <p className="text-[0.66rem] font-bold tracking-wide text-[#8A6A12] uppercase">{p.noteTitle}</p>
                  <p className="mt-0.5 text-[0.74rem] leading-snug text-[#5C4A12]">{p.note}</p>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[0.68rem] text-[#6B7A8B]">
                  <Paperclip size={12} /> report-tower-a.pdf
                </p>
                <p className="ops-mono mt-3 border-t border-[#0B1F2A]/[0.07] pt-2.5 text-[0.6rem] text-[#8593A3]">
                  {p.footer}
                </p>
              </div>

              <div className="ops-phone-read">
                <CheckCheck size={14} />
                {p.read}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal motion="right" className="order-1 lg:order-2">
          <p className="ops-eyebrow">{copy.label}</p>
          <h2 className="ops-h2 mt-4">
            {copy.title} <span className="ops-accent">{copy.accent}</span>
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-[#3E4F61]">{copy.text}</p>
          <ul className="mt-7 space-y-3">
            {copy.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3 text-[#0B1F2A]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
                  <Check size={13} strokeWidth={3} />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
