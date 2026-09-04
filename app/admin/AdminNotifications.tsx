"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import type { CareerApplication } from "@/lib/careers";
import type { Enquiry } from "@/lib/enquiries";

const POLL_MS = 25_000;
const PREVIEW_LIMIT = 10;

type NotifItem = {
  id: string;
  kind: "enquiry" | "application";
  name: string;
  subtitle: string;
  detail: string;
  createdAt: string;
  href: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff) || diff < 0) return "";
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminNotifications() {
  const [items, setItems] = useState<NotifItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const [enqRes, appRes] = await Promise.all([
        fetch("/api/admin/enquiries", { cache: "no-store" }),
        fetch("/api/admin/careers/applications", { cache: "no-store" }),
      ]);

      const next: NotifItem[] = [];

      if (enqRes.ok) {
        const data = (await enqRes.json()) as {
          ok?: boolean;
          items?: Enquiry[];
        };
        if (data.ok && Array.isArray(data.items)) {
          for (const item of data.items) {
            if (item.status !== "new") continue;
            next.push({
              id: `enquiry-${item.id}`,
              kind: "enquiry",
              name: item.name || "Visitor",
              subtitle: item.service || "General enquiry",
              detail: item.message || "",
              createdAt: item.createdAt,
              href: "/admin/enquiries",
            });
          }
        }
      }

      if (appRes.ok) {
        const data = (await appRes.json()) as {
          ok?: boolean;
          items?: CareerApplication[];
        };
        if (data.ok && Array.isArray(data.items)) {
          for (const item of data.items) {
            if (item.status !== "new") continue;
            next.push({
              id: `application-${item.id}`,
              kind: "application",
              name: item.name || "Applicant",
              subtitle: item.jobTitle || "Career application",
              detail: item.message || item.experience || "",
              createdAt: item.createdAt,
              href: "/admin/careers",
            });
          }
        }
      }

      next.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setItems(next);
    } catch {
      /* ignore transient network errors while polling */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), POLL_MS);
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const count = items.length;
  const preview = items.slice(0, PREVIEW_LIMIT);
  const badge = count > 9 ? "9+" : String(count);

  const counts = useMemo(() => {
    let enquiries = 0;
    let applications = 0;
    for (const item of items) {
      if (item.kind === "enquiry") enquiries += 1;
      else applications += 1;
    }
    return { enquiries, applications };
  }, [items]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) void load();
        }}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-sand/15 bg-night/60 text-mist transition hover:border-olive/40 hover:text-olive"
        aria-label={
          count > 0 ? `${count} new notification${count === 1 ? "" : "s"}` : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={16} />
        {count > 0 && (
          <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-semibold leading-none text-white">
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-sand/15 bg-night shadow-xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-sand/10 px-3.5 py-2.5">
            <p className="text-xs font-semibold tracking-wide text-sand uppercase">
              Notifications
            </p>
            {count > 0 && (
              <span className="rounded-full bg-crimson/15 px-2 py-0.5 text-[10px] font-medium text-crimson-soft">
                {count}
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && count === 0 ? (
              <p className="px-3.5 py-6 text-center text-xs text-mist">
                Checking…
              </p>
            ) : preview.length === 0 ? (
              <p className="px-3.5 py-6 text-center text-xs text-mist">
                No new enquiries or applications
              </p>
            ) : (
              <ul className="divide-y divide-sand/10">
                {preview.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-3.5 py-3 transition hover:bg-sand/[0.04]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium text-sand">
                          {item.name}
                        </p>
                        <span className="shrink-0 text-[10px] text-mist">
                          {timeAgo(item.createdAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                            item.kind === "enquiry"
                              ? "bg-olive/15 text-olive"
                              : "bg-crimson/15 text-crimson-soft"
                          }`}
                        >
                          {item.kind === "enquiry" ? "Enquiry" : "Career"}
                        </span>
                        <p className="truncate text-xs text-mist">
                          {item.subtitle}
                        </p>
                      </div>
                      {item.detail ? (
                        <p className="mt-1 line-clamp-2 text-xs text-mist/80">
                          {item.detail}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-sand/10 px-3.5 py-2.5">
            <Link
              href="/admin/enquiries"
              onClick={() => setOpen(false)}
              className="text-[10px] tracking-wide text-olive uppercase transition hover:text-sand"
            >
              Enquiries{counts.enquiries ? ` (${counts.enquiries})` : ""}
            </Link>
            <Link
              href="/admin/careers"
              onClick={() => setOpen(false)}
              className="text-[10px] tracking-wide text-olive uppercase transition hover:text-sand"
            >
              Careers{counts.applications ? ` (${counts.applications})` : ""}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
