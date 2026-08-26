"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Enquiry, EnquiryStatus } from "@/lib/enquiries";

export default function EnquiryTable({ items }: { items: Enquiry[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function setStatus(id: string, status: EnquiryStatus) {
    setBusy(id);
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setBusy(null);
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

  if (items.length === 0) {
    return (
      <p className="mt-8 admin-card border border-sand/10 bg-night/80 p-8 text-sm text-mist">
        No enquiries yet. When someone sends the contact form, they show up
        here so you can follow up.
      </p>
    );
  }

  const pending = items.find((item) => item.id === pendingId);

  return (
    <>
      <div className="admin-card mt-8 overflow-x-auto border border-sand/10 bg-night/60">
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
            {items.map((item) => (
              <tr key={item.id} className="border-t border-sand/10 align-top">
                <td className="px-4 py-4">
                  <p className="text-sand">{item.name}</p>
                  <p className="text-mist">{item.email}</p>
                  <p className="text-mist">{item.phone}</p>
                  <p className="mt-1 text-xs text-mist/70">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </td>
                <td className="px-4 py-4 text-sand">{item.service}</td>
                <td className="max-w-sm px-4 py-4 text-mist">{item.message}</td>
                <td className="px-4 py-4">
                  <select
                    value={item.status}
                    disabled={busy === item.id}
                    onChange={(e) =>
                      setStatus(item.id, e.target.value as EnquiryStatus)
                    }
                    className="border border-sand/15 bg-ink px-2 py-1.5 text-sand outline-none"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    disabled={busy === item.id}
                    onClick={() => setPendingId(item.id)}
                    className="text-xs tracking-wide text-crimson uppercase hover:text-crimson-soft"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
