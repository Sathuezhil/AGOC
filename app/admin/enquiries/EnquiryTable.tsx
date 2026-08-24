"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Enquiry, EnquiryStatus } from "@/lib/enquiries";

export default function EnquiryTable({ items }: { items: Enquiry[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

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

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    setBusy(id);
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(null);
  }

  if (items.length === 0) {
    return (
      <p className="mt-8 border border-white/10 bg-night p-8 text-sm text-mist">
        No enquiries yet. When someone sends the contact form, they show up
        here so you can follow up.
      </p>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto border border-white/10">
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
            <tr key={item.id} className="border-t border-white/10 align-top">
              <td className="px-4 py-4">
                <p className="text-white">{item.name}</p>
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
                  className="border border-white/15 bg-ink px-2 py-1.5 text-sand outline-none"
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
                  onClick={() => remove(item.id)}
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
  );
}
