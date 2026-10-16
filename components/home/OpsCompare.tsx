"use client";

import { useState } from "react";
import { Building2, Check, ChevronsLeftRight, House } from "lucide-react";
import type { HomeOps } from "@/lib/home-ops";

type Side = HomeOps["compare"]["left"];

function Panel({ side, dark, icon: Icon }: { side: Side; dark: boolean; icon: typeof House }) {
  return (
    <div className={`ops-compare-copy ${dark ? "ops-compare-copy-end text-white" : "text-[#0B1F2A]"}`}>
      <span className={`ops-compare-tag ${dark ? "bg-white/10 text-[#8EC4FF]" : "bg-[#0066FF]/10 text-[#0066FF]"}`}>
        <Icon size={14} />
        {side.tag}
      </span>
      <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{side.title}</h3>
      <p className={`mt-3 text-[0.98rem] leading-relaxed ${dark ? "text-white/75" : "text-[#3E4F61]"}`}>
        {side.text}
      </p>
      <ul className="mt-6 space-y-2.5">
        {side.items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[0.95rem]">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                dark ? "bg-[#C9A227]/20 text-[#E0C35A]" : "bg-[#0066FF]/10 text-[#0066FF]"
              }`}
            >
              <Check size={13} strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className={`ops-mono mt-7 text-[0.7rem] ${dark ? "text-white/50" : "text-[#6B7A8B]"}`}>{side.foot}</p>
    </div>
  );
}

export default function OpsCompare({ copy, rtl }: { copy: HomeOps["compare"]; rtl: boolean }) {
  const [split, setSplit] = useState(50);

  return (
    <section className="ops-light pb-20 pt-4 md:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="ops-eyebrow">{copy.label}</p>
          <h2 className="ops-h2 mt-4">
            {copy.title} <span className="ops-accent">{copy.accent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-[#3E4F61]">{copy.text}</p>
        </div>

        <div className="ops-compare mt-12" dir="ltr">
          <div className="ops-compare-pane bg-white" dir={rtl ? "rtl" : "ltr"}>
            <Panel side={copy.left} dark={false} icon={Building2} />
          </div>
          <div
            className="ops-compare-pane ops-compare-dark"
            style={{ clipPath: `inset(0 0 0 ${split}%)` }}
            dir={rtl ? "rtl" : "ltr"}
          >
            <Panel side={copy.right} dark icon={House} />
          </div>

          <div className="ops-compare-handle" style={{ left: `${split}%` }} aria-hidden>
            <span>
              <ChevronsLeftRight size={18} />
            </span>
          </div>

          <input
            type="range"
            min={8}
            max={92}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label={copy.hint}
            className="ops-compare-range"
          />
        </div>
        <p className="ops-mono mt-4 text-center text-[0.7rem] tracking-[0.2em] text-[#6B7A8B] uppercase rtl:tracking-normal">
          {copy.hint}
        </p>
      </div>
    </section>
  );
}
