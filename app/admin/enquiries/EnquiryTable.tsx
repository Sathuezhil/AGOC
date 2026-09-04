"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Reply, Search, X } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Enquiry, EnquiryStatus } from "@/lib/enquiries";

type StatusFilter = "all" | EnquiryStatus;

export default function EnquiryTable({ items }: { items: Enquiry[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<Enquiry | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replyOk, setReplyOk] = useState("");
  const [sending, setSending] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  /** Keep dropdown on the chosen value while PATCH + refresh run. */
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, EnquiryStatus>
  >({});

  useEffect(() => {
    setStatusOverrides((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const item of items) {
        if (next[item.id] && next[item.id] === item.status) {
          delete next[item.id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [items]);

  function statusOf(item: Enquiry): EnquiryStatus {
    return statusOverrides[item.id] ?? item.status;
  }

  const services = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      const s = item.service?.trim();
      if (s) set.add(s);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const status = statusOf(item);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (serviceFilter !== "all" && item.service !== serviceFilter) return false;
      if (!q) return true;
      const hay = [
        item.name,
        item.email,
        item.phone,
        item.service,
        item.message,
        status,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, statusFilter, serviceFilter, statusOverrides]);

  const hasActiveFilters =
    query.trim() !== "" || statusFilter !== "all" || serviceFilter !== "all";

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setServiceFilter("all");
  }

  useEffect(() => {
    if (!replyTarget) return;
    setSubject(`Re: Your enquiry · ${replyTarget.service}`);
    setMessage("");
    setReplyError("");
    setReplyOk("");
  }, [replyTarget]);

  useEffect(() => {
    if (!replyTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sending) setReplyTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [replyTarget, sending]);

  async function setStatus(id: string, status: EnquiryStatus) {
    const previous =
      statusOverrides[id] ?? items.find((item) => item.id === id)?.status;
    setBusy(id);
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Could not update status.");
      }
      router.refresh();
    } catch {
      setStatusOverrides((prev) => {
        const next = { ...prev };
        if (previous) next[id] = previous;
        else delete next[id];
        return next;
      });
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!pendingId) return;
    const id = pendingId;
    setBusy(id);
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    setPendingId(null);
    router.refresh();
    setBusy(null);
  }

  async function sendReply() {
    if (!replyTarget) return;
    setSending(true);
    setReplyError("");
    setReplyOk("");
    try {
      const response = await fetch(
        `/api/admin/enquiries/${replyTarget.id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, message }),
        },
      );
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not send reply.");
      }
      setReplyOk(`Reply sent to ${replyTarget.email}.`);
      router.refresh();
      window.setTimeout(() => setReplyTarget(null), 900);
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Could not send reply.");
    } finally {
      setSending(false);
    }
  }

  if (items.length === 0) {
    return (
      <p className="mt-8 admin-card border border-sand/10 bg-night/80 p-8 text-sm text-mist">
        No enquiries yet. When someone sends the contact form, they show up
        here so you can follow up.
      </p>
    );
  }

  const pending = items.find((item) => item.id === pendingId);
  const lastReply = replyTarget?.replies?.length
    ? replyTarget.replies[replyTarget.replies.length - 1]
    : null;

  const field =
    "rounded-lg border border-sand/15 bg-ink px-3 py-2.5 text-sm text-sand outline-none focus:border-olive/50";

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="relative min-w-[14rem] flex-1 sm:max-w-sm">
          <Search
            size={14}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-mist"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, message…"
            className={`${field} w-full ps-9`}
          />
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className={field}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="done">Done</option>
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className={`${field} max-w-full sm:max-w-xs`}
          aria-label="Filter by service"
        >
          <option value="all">All services</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs tracking-wide text-olive uppercase hover:text-sand"
          >
            Clear filters
          </button>
        ) : null}
        <p className="text-xs text-mist sm:ms-auto">
          Showing {filtered.length} of {items.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 admin-card border border-dashed border-sand/15 bg-night/60 p-8 text-sm text-mist">
          No enquiries match your search or filters.
          {hasActiveFilters ? (
            <>
              {" "}
              <button
                type="button"
                onClick={clearFilters}
                className="text-olive underline-offset-2 hover:underline"
              >
                Clear filters
              </button>
            </>
          ) : null}
        </p>
      ) : (
        <div className="admin-card mt-4 overflow-x-auto border border-sand/10 bg-night/60">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-night text-xs tracking-[0.16em] text-mist uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-sand/10 align-top">
                  <td className="px-4 py-4">
                    <p className="text-sand">{item.name}</p>
                    <p className="text-mist">{item.email}</p>
                    <p className="text-mist">{item.phone}</p>
                    <p className="mt-1 text-xs text-mist/70">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    {(item.replies?.length ?? 0) > 0 && (
                      <p className="mt-1 text-[10px] tracking-wide text-olive uppercase">
                        {item.replies!.length} reply
                        {item.replies!.length === 1 ? "" : " replies"}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sand">{item.service}</td>
                  <td className="max-w-sm px-4 py-4 text-mist">{item.message}</td>
                  <td className="px-4 py-4">
                    <select
                      value={statusOf(item)}
                      disabled={busy === item.id}
                      onChange={(e) =>
                        setStatus(item.id, e.target.value as EnquiryStatus)
                      }
                      className="border border-sand/15 bg-ink px-2 py-1.5 text-sand outline-none"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <button
                        type="button"
                        disabled={busy === item.id}
                        onClick={() => setReplyTarget(item)}
                        className="inline-flex items-center gap-1.5 text-xs tracking-wide text-olive uppercase hover:text-sand disabled:opacity-50"
                      >
                        <Reply size={12} />
                        Reply
                      </button>
                      <button
                        type="button"
                        disabled={busy === item.id}
                        onClick={() => setPendingId(item.id)}
                        className="text-xs tracking-wide text-crimson uppercase hover:text-crimson-soft"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {replyTarget && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-reply-title"
          onClick={() => {
            if (!sending) setReplyTarget(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-sand/15 bg-night p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="enquiry-reply-title"
                  className="font-display text-2xl text-sand"
                >
                  Reply by email
                </h2>
                <p className="mt-1 text-sm text-mist">
                  To {replyTarget.name} · {replyTarget.email}
                </p>
              </div>
              <button
                type="button"
                disabled={sending}
                onClick={() => setReplyTarget(null)}
                className="rounded-lg border border-sand/15 p-2 text-mist hover:text-sand disabled:opacity-50"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-sand/10 bg-ink/40 p-3 text-sm text-mist">
              <p className="text-[10px] tracking-[0.16em] text-mist/70 uppercase">
                Their message · {replyTarget.service}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sand/90">
                {replyTarget.message}
              </p>
            </div>

            {lastReply && (
              <div className="mt-3 rounded-lg border border-olive/20 bg-olive/5 p-3 text-sm text-mist">
                <p className="text-[10px] tracking-[0.16em] text-olive uppercase">
                  Last reply · {new Date(lastReply.sentAt).toLocaleString()}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sand/90">
                  {lastReply.body}
                </p>
              </div>
            )}

            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Subject
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={sending}
                className="w-full rounded-lg border border-sand/15 bg-ink px-3 py-2.5 text-sm text-sand outline-none focus:border-olive/50"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Your reply
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
                rows={7}
                placeholder="Write your reply to the visitor…"
                className="w-full resize-y rounded-lg border border-sand/15 bg-ink px-3 py-2.5 text-sm text-sand outline-none placeholder:text-mist/60 focus:border-olive/50"
              />
            </label>

            {replyError && (
              <p className="mt-3 text-sm text-crimson-soft">{replyError}</p>
            )}
            {replyOk && <p className="mt-3 text-sm text-olive">{replyOk}</p>}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={sending}
                onClick={() => setReplyTarget(null)}
                className="rounded-lg border border-sand/20 px-5 py-2.5 text-sm tracking-wide text-sand uppercase transition hover:border-sand/40 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sending || !message.trim()}
                onClick={sendReply}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-crimson px-5 py-2.5 text-sm font-medium tracking-wide text-white uppercase transition hover:bg-crimson-dark disabled:opacity-50"
              >
                <Reply size={14} />
                {sending ? "Sending…" : "Send reply"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingId)}
        title="Delete enquiry?"
        message={
          pending
            ? `Delete the enquiry from “${pending.name}”? This cannot be undone.`
            : "Delete this enquiry? This cannot be undone."
        }
        confirmLabel="Yes, delete"
        cancelLabel="No"
        busy={busy === pendingId}
        onCancel={() => setPendingId(null)}
        onConfirm={remove}
      />
    </>
  );
}
