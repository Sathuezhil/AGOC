"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ActivityEntity, ActivityEvent } from "@/lib/activity";

const ENTITIES: { value: "all" | ActivityEntity; label: string }[] = [
  { value: "all", label: "All areas" },
  { value: "enquiry", label: "Enquiries" },
  { value: "offer", label: "Offers" },
  { value: "career_job", label: "Jobs" },
  { value: "career_application", label: "Applications" },
  { value: "service", label: "Services" },
  { value: "team", label: "Team" },
  { value: "content", label: "Texts" },
  { value: "media", label: "Images" },
  { value: "settings", label: "Settings" },
  { value: "auth", label: "Auth" },
];

export default function ActivityLog({
  initialItems,
}: {
  initialItems: ActivityEvent[];
}) {
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState<"all" | ActivityEntity>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialItems.filter((item) => {
      if (entity !== "all" && item.entity !== entity) return false;
      if (!q) return true;
      const hay = [
        item.summary,
        item.actorEmail,
        item.action,
        item.entity,
        item.entityId || "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [initialItems, query, entity]);

  const field =
    "rounded-lg border border-sand/15 bg-ink px-3 py-2.5 text-sm text-sand outline-none focus:border-olive/50";

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="relative min-w-[14rem] flex-1 sm:max-w-sm">
          <Search
            size={14}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-mist"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activity…"
            className={`${field} w-full ps-9`}
          />
        </label>
        <select
          value={entity}
          onChange={(e) =>
            setEntity(e.target.value as "all" | ActivityEntity)
          }
          className={field}
          aria-label="Filter by area"
        >
          {ENTITIES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-mist sm:ms-auto">
          Showing {filtered.length} of {initialItems.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="admin-card border border-dashed border-sand/15 bg-night/60 p-8 text-sm text-mist">
          {initialItems.length === 0
            ? "No activity yet. Admin actions will appear here."
            : "No activity matches your filters."}
        </p>
      ) : (
        <div className="admin-card overflow-x-auto border border-sand/10 bg-night/60">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-night text-xs tracking-[0.16em] text-mist uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Area</th>
                <th className="px-4 py-3 font-medium">What happened</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-sand/10 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-mist">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sand">{item.actorEmail}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-sand/15 px-2 py-0.5 text-[10px] tracking-wide text-mist uppercase">
                      {item.entity.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sand">{item.summary}</p>
                    <p className="mt-0.5 text-[10px] tracking-wide text-mist/70 uppercase">
                      {item.action}
                      {item.entityId ? ` · ${item.entityId}` : ""}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
