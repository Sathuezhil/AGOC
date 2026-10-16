"use client";

import { useMemo, useState } from "react";
import { SERVICE_CATEGORY, type PagesOps } from "@/lib/pages-ops";
import OpsServiceCard, { type OpsServiceCardData } from "./OpsServiceCard";

export default function OpsServiceGrid({
  services,
  badges,
  copy,
  learnMore,
}: {
  services: OpsServiceCardData[];
  badges: Record<string, string>;
  copy: PagesOps["services"];
  learnMore: string;
}) {
  const [filter, setFilter] = useState<PagesOps["services"]["filters"][number]["id"]>("all");
  const counts = useMemo(() => {
    const out: Record<string, number> = { all: services.length };
    for (const s of services) {
      const cat = SERVICE_CATEGORY[s.slug];
      if (cat) out[cat] = (out[cat] ?? 0) + 1;
    }
    return out;
  }, [services]);
  const visible =
    filter === "all" ? services : services.filter((s) => SERVICE_CATEGORY[s.slug] === filter);
  const filters = copy.filters.filter((f) => f.id === "all" || counts[f.id]);

  return (
    <>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="ops-tabs max-w-full overflow-x-auto" role="tablist" aria-label={copy.filterLabel}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`ops-tab whitespace-nowrap ${filter === f.id ? "is-active" : ""}`}
            >
              {f.label}
              <span className="ops-mono ms-2 text-[0.7rem] text-[#8593A3]">{counts[f.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <p className="ops-mono text-[0.75rem] text-[#5B6B7C]">
          {visible.length} {copy.count}
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((service, i) => (
          <div
            key={`${filter}-${service.slug}`}
            className="ops-grid-item h-full"
            style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
          >
            <OpsServiceCard
              service={service}
              index={services.indexOf(service)}
              badge={badges[service.slug] || ""}
              learnMore={learnMore}
              book={copy.book}
            />
          </div>
        ))}
      </div>
    </>
  );
}
