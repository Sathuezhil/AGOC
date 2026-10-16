"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  ClipboardList,
  Cctv,
  Pause,
  Play,
  Route,
  TriangleAlert,
  Users,
} from "lucide-react";
import type { HomeOps } from "@/lib/home-ops";
import OpsTag from "./OpsTag";

const TAB_MS = 7000;
const navIcons = [Building2, Users, Route, TriangleAlert, ClipboardList];

export default function OpsDashboard({ copy }: { copy: HomeOps["demo"] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tab = copy.tabs[active];
  const focus = Math.max(0, tab.rows.findIndex((row) => row.tone === "live"));
  const navActive = active === 0 ? 1 : active === 1 ? 2 : 4;

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % copy.tabs.length),
      TAB_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, paused, copy.tabs.length]);

  return (
    <section id="ops-demo" className="ops-light scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="ops-eyebrow">{copy.label}</p>
          <h2 className="ops-h2 mt-4">
            {copy.title} <span className="ops-accent">{copy.accent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-[#3E4F61]">
            {copy.text}
          </p>
        </div>

        <div className="ops-window mt-12">
          <div className="ops-window-bar">
            <span className="flex gap-1.5" aria-hidden>
              <i className="ops-dot bg-[#FF5F57]" />
              <i className="ops-dot bg-[#FEBC2E]" />
              <i className="ops-dot bg-[#28C840]" />
            </span>
            <span className="ops-mono mx-auto truncate rounded-md bg-white/70 px-3 py-1 text-[0.7rem] text-[#5B6B7C]">
              {copy.site} · {copy.siteMeta}
            </span>
            <OpsTag tone="info" className="hidden sm:inline-flex">
              {copy.sample}
            </OpsTag>
          </div>

          <div className="grid min-h-[30rem] md:grid-cols-[13.5rem_minmax(0,1fr)_minmax(0,1.05fr)]">
            <aside className="hidden flex-col border-e border-[#0B1F2A]/[0.07] bg-[#F7F8FA] p-4 md:flex">
              <p className="ops-mono mb-2 px-2 text-[0.62rem] tracking-[0.2em] text-[#8593A3] uppercase rtl:tracking-normal">
                AGOC Ops
              </p>
              <nav className="space-y-1">
                {copy.nav.map((item, i) => {
                  const Icon = navIcons[i] ?? Building2;
                  const on = i === navActive;
                  return (
                    <span
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-500 ${
                        on
                          ? "bg-white font-semibold text-[#0B1F2A] shadow-[0_6px_18px_rgba(11,31,42,0.08)]"
                          : "text-[#4A5B6C]"
                      }`}
                    >
                      <Icon size={16} className={on ? "text-[#0066FF]" : "text-[#8593A3]"} />
                      {item.label}
                      <span className="ops-mono ms-auto text-[0.72rem] text-[#8593A3]">
                        {item.count}
                      </span>
                    </span>
                  );
                })}
              </nav>
              <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-[#0B1F2A]/[0.07] bg-white p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F2A] text-xs font-semibold text-white">
                  SV
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#0B1F2A]">
                    {copy.supervisor}
                  </span>
                  <span className="ops-mono block text-[0.68rem] text-[#8593A3]">
                    {copy.supervisorRole}
                  </span>
                </span>
              </div>
            </aside>

            <div className="border-b border-[#0B1F2A]/[0.07] p-4 sm:p-5 md:border-b-0 md:border-e">
              <p className="ops-mono mb-3 text-[0.65rem] tracking-[0.2em] text-[#8593A3] uppercase rtl:tracking-normal">
                {tab.listTitle}
              </p>
              <ul key={tab.id} className="space-y-2">
                {tab.rows.map((row, i) => (
                  <li
                    key={row.code + row.title}
                    className={`ops-row ${i === focus ? "is-focus" : ""}`}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <span className="ops-code">{row.code}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9rem] font-semibold text-[#0B1F2A]">
                        {row.title}
                      </span>
                      <span className="ops-mono block truncate text-[0.7rem] text-[#6B7A8B]">
                        {row.meta}
                      </span>
                    </span>
                    <OpsTag tone={row.tone}>{row.tag}</OpsTag>
                  </li>
                ))}
              </ul>
            </div>

            <div key={`detail-${tab.id}`} className="ops-detail p-5 sm:p-6">
              <OpsTag tone={tab.rows[focus]?.tone ?? "info"}>{tab.detail.kicker}</OpsTag>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-[#0B1F2A] sm:text-2xl">
                {tab.detail.title}
              </h3>
              <p className="ops-mono mt-1 text-[0.72rem] text-[#6B7A8B]">{tab.detail.meta}</p>

              <p className="ops-mono mt-6 text-[0.65rem] tracking-[0.2em] text-[#8593A3] uppercase rtl:tracking-normal">
                {tab.detail.checklistTitle}
              </p>
              <ul className="mt-2.5 space-y-2">
                {tab.detail.checklist.map((item, i) => (
                  <li
                    key={item.text}
                    className={`ops-check ops-check-${item.tone}`}
                    style={{ animationDelay: `${180 + i * 260}ms` }}
                  >
                    <span className="ops-check-icon">
                      {item.tone === "ok" ? <Check size={13} strokeWidth={3} /> : <Cctv size={12} />}
                    </span>
                    <span className="flex-1 text-[0.88rem] text-[#0B1F2A]">{item.text}</span>
                    <span className="ops-mono text-[0.7rem] font-semibold">{item.state}</span>
                  </li>
                ))}
              </ul>

              <div
                className="ops-detail-action"
                style={{ animationDelay: `${180 + tab.detail.checklist.length * 260}ms` }}
              >
                <p className="text-sm font-semibold text-[#0B1F2A]">{tab.detail.action}</p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-[#4A5B6C]">
                  {tab.detail.note}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="ops-tabs" role="tablist">
            {copy.tabs.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`ops-tab ${i === active ? "is-active" : ""}`}
              >
                {t.label}
                {i === active ? (
                  <span className="ops-tab-progress" aria-hidden>
                    <span
                      key={`${t.id}-${paused}`}
                      style={{
                        animationDuration: `${TAB_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? copy.play : copy.pause}
            className="ops-round-btn"
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}
