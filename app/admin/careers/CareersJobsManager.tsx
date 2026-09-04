"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { CareerJob, JobType } from "@/lib/careers";

const emptyForm = {
  title: "",
  department: "Operations",
  location: "Dubai, UAE",
  type: "full-time" as JobType,
  summary: "",
  description: "",
  requirementsText: "",
  hidden: false,
};

export default function CareersJobsManager({
  initialJobs,
}: {
  initialJobs: CareerJob[];
}) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [editing, setEditing] = useState<CareerJob | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<CareerJob | null>(null);

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  function openEdit(job: CareerJob) {
    setCreating(false);
    setEditing(job);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      summary: job.summary,
      description: job.description,
      requirementsText: job.requirements.join("\n"),
      hidden: Boolean(job.hidden),
    });
    setError("");
    setMessage("");
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    const payload = {
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      summary: form.summary,
      description: form.description,
      requirements: form.requirementsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      hidden: form.hidden,
    };

    try {
      const response = await fetch(
        editing ? `/api/admin/careers/${editing.id}` : "/api/admin/careers",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        item?: CareerJob;
      };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error(data.error || "Could not save job.");
      }
      setJobs((prev) => {
        if (editing) {
          return prev.map((job) => (job.id === data.item!.id ? data.item! : job));
        }
        return [...prev, data.item!];
      });
      setMessage(
        editing
          ? "Job updated. Arabic refreshed automatically."
          : "Job added. Arabic generated automatically.",
      );
      closeForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save job.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!pendingDelete) return;
    setBusy(true);
    const id = pendingDelete.id;
    const response = await fetch(`/api/admin/careers/${id}`, { method: "DELETE" });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    setPendingDelete(null);
    if (!data.ok) {
      setError(data.error || "Could not delete.");
      return;
    }
    setJobs((prev) => prev.filter((job) => job.id !== id));
    setMessage("Job deleted.");
    router.refresh();
  }

  const field =
    "w-full rounded-lg border border-sand/15 bg-ink px-3 py-2.5 text-sm text-sand outline-none focus:border-olive/50";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">
          {jobs.length} role(s) · Arabic auto-translates on save
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-crimson px-4 py-2.5 text-xs tracking-wide text-white uppercase hover:bg-crimson-dark"
        >
          <Plus size={14} />
          Add job
        </button>
      </div>

      {message && <p className="text-sm text-olive">{message}</p>}
      {error && <p className="text-sm text-crimson-soft">{error}</p>}

      {(creating || editing) && (
        <div className="admin-card space-y-4 border border-sand/10 bg-night/80 p-5">
          <h3 className="font-display text-2xl text-sand">
            {editing ? "Edit job" : "New job"}
          </h3>
          <p className="text-xs text-mist">
            Enter English only. Arabic copy is generated automatically when you
            save.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Title
              </span>
              <input
                className={field}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Department
              </span>
              <input
                className={field}
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Location
              </span>
              <input
                className={field}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Type
              </span>
              <select
                className={field}
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as JobType })
                }
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm text-sand">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(e) => setForm({ ...form, hidden: e.target.checked })}
              />
              Hide from public careers page
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Short summary
              </span>
              <input
                className={field}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Description
              </span>
              <textarea
                rows={4}
                className={field}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Requirements (one per line)
              </span>
              <textarea
                rows={4}
                className={field}
                value={form.requirementsText}
                onChange={(e) =>
                  setForm({ ...form, requirementsText: e.target.value })
                }
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="rounded-lg bg-crimson px-5 py-2.5 text-xs tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-50"
            >
              {busy ? "Saving & translating…" : "Save job"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={closeForm}
              className="rounded-lg border border-sand/20 px-5 py-2.5 text-xs tracking-wide text-sand uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {jobs.length === 0 && (
          <p className="rounded-lg border border-dashed border-sand/15 p-8 text-sm text-mist">
            No jobs yet. Add the first open role.
          </p>
        )}
        {jobs.map((job) => (
          <article
            key={job.id}
            className="admin-card flex flex-col gap-4 border border-sand/10 bg-night/80 p-5 md:flex-row md:items-center"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl text-sand">{job.title}</p>
              {job.titleAr ? (
                <p className="mt-0.5 text-sm text-mist" dir="rtl">
                  {job.titleAr}
                </p>
              ) : null}
              <p className="mt-1 text-sm text-mist">
                {job.department} · {job.location} · {job.type}
              </p>
              <p className="mt-2 text-xs tracking-wide uppercase">
                {job.hidden ? (
                  <span className="text-crimson-soft">Hidden</span>
                ) : (
                  <span className="text-olive">Live</span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => openEdit(job)}
                className="inline-flex items-center gap-1.5 text-xs tracking-wide text-olive uppercase hover:text-sand"
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(job)}
                className="inline-flex items-center gap-1.5 text-xs tracking-wide text-crimson uppercase"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete job?"
        message={
          pendingDelete
            ? `Delete “${pendingDelete.title}”? It will leave the public careers page.`
            : "Delete this job?"
        }
        confirmLabel="Yes, delete"
        cancelLabel="No"
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
