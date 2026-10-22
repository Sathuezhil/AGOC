"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Shield, Building2, Sparkles, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Service, ServiceCategory } from "@/lib/services";
import ServiceActions from "./ServiceActions";

const CATEGORY_META: Record<ServiceCategory, { label: string; icon: typeof Shield; color: string }> = {
  security: { label: "Security", icon: Shield, color: "text-[#0066FF] bg-[#0066FF]/10 border-[#0066FF]/20" },
  facility: { label: "Facility", icon: Building2, color: "text-[#C9A227] bg-[#C9A227]/10 border-[#C9A227]/20" },
  cleaning: { label: "Cleaning", icon: Sparkles, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

export default function ServicesList({ items }: { items: Service[] }) {
  const [filter, setFilter] = useState<"all" | ServiceCategory>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const res: Record<string, number> = { all: items.length, security: 0, facility: 0, cleaning: 0 };
    for (const item of items) {
      const cat = item.category || "security";
      res[cat] = (res[cat] ?? 0) + 1;
    }
    return res;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const cat = item.category || "security";
      if (filter !== "all" && cat !== filter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.short.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  return (
    <div className="mt-8 space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "security", "facility", "cleaning"] as const).map((key) => {
            const count = counts[key] ?? 0;
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  active
                    ? "bg-[#0066FF] text-white shadow-[0_8px_20px_-6px_rgba(0,102,255,0.4)]"
                    : "border border-sand/15 bg-night/60 text-mist hover:text-sand hover:bg-night"
                }`}
              >
                <span>
                  {key === "all" ? "All Services" : key === "security" ? "Security" : key === "facility" ? "Facility" : "Cleaning"}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    active ? "bg-white/20 text-white" : "bg-sand/10 text-mist"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            className="w-full rounded-xl border border-sand/15 bg-ink/70 pl-9 pr-4 py-2 text-xs text-sand outline-none transition placeholder:text-mist/50 focus:border-[#0066FF]"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="admin-card rounded-2xl border border-dashed border-sand/20 bg-night/40 p-12 text-center">
            <p className="text-sm text-mist">
              {query ? "No services match your search." : "No services found in this category."}
            </p>
            <Link
              href="/admin/services/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0066FF] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#0066FF]/20 hover:bg-[#0052CC] transition"
            >
              <Plus size={15} /> Add new service
            </Link>
          </div>
        ) : null}

        {filtered.map((service) => {
          const cat = (service.category || "security") as ServiceCategory;
          const meta = CATEGORY_META[cat] || CATEGORY_META.security;
          const Icon = meta.icon;

          return (
            <article
              key={service.slug}
              className="admin-card group rounded-2xl border border-sand/10 bg-night/70 p-4 transition-all duration-300 hover:border-[#0066FF]/40 hover:bg-night/90 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              {/* Thumbnail */}
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-ink sm:h-20 sm:w-28">
                {service.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-mist/40">
                    <Shield size={24} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${meta.color}`}
                  >
                    <Icon size={11} /> {meta.label}
                  </span>

                  {service.hidden ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sand/15 bg-sand/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-mist">
                      Hidden
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-sand group-hover:text-white transition">
                  {service.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-mist sm:text-sm">
                  {service.short}
                </p>
                <p className="mt-1 text-[11px] text-mist/70 font-mono">
                  /services/{service.slug}
                </p>
              </div>

              {/* Actions */}
              <div className="shrink-0 pt-2 sm:pt-0">
                <ServiceActions slug={service.slug} title={service.title} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
