"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { ApplicationStatus, CareerApplication } from "@/lib/careers";

export default function ApplicationsTable({
  items,
}: {
  items: CareerApplication[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function setStatus(id: string, status: ApplicationStatus) {
    setBusy(id);
    await fetch(`/api/admin/careers/applications/${id}`, {
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
    await fetch(`/api/admin/careers/applications/${id}`, { method: "DELETE" });
    setPendingId(null);
    router.refresh();
    setBusy(null);
  }

  if (items.length === 0) {
    return (
      <p className="mt-6 rounded-lg border border-dashed border-sand/15 p-8 text-sm text-mist">
        No applications yet. Submissions from the careers page appear here.
      </p>
    );
  }

  const pending = items.find((item) => item.id === pendingId);

  return (
    <>
      <div className="admin-card mt-6 overflow-x-auto border border-sand/10 bg-night/60">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-night text-xs tracking-[0.16em] text-mist uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">CV</th>
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
                <td className="px-4 py-4 text-sand">{item.jobTitle}</td>
                <td className="px-4 py-4 text-mist">{item.experience}</td>
                <td className="max-w-sm px-4 py-4 text-mist">{item.message}</td>
                <td className="px-4 py-4">
                  {item.cvStoredName ? (
                    <a
                      href={`/api/admin/careers/applications/${item.id}/cv`}
                      className="text-xs tracking-wide text-olive uppercase hover:text-sand"
                    >
                      {item.cvOriginalName || "Download PDF"}
                    </a>
                  ) : (
                    <span className="text-xs text-mist/60">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={item.status}
                    disabled={busy === item.id}
                    onChange={(e) =>
                      setStatus(item.id, e.target.value as ApplicationStatus)
                    }
                    className="border border-sand/15 bg-ink px-2 py-1.5 text-sand outline-none"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    disabled={busy === item.id}
                    onClick={() => setPendingId(item.id)}
                    className="text-xs tracking-wide text-crimson uppercase"
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
        title="Delete application?"
        message={
          pending
            ? `Delete the application from “${pending.name}”?`
            : "Delete this application?"
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
