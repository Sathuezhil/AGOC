"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Offer } from "@/lib/offers";

type ServiceOption = {
  slug: string;
  title: string;
  short: string;
  image: string;
};

const emptyForm = {
  serviceSlug: "",
  badge: "",
  description: "",
  ctaLabel: "Book now",
  hidden: false,
};

export default function OffersManager({
  initialOffers,
  services,
}: {
  initialOffers: Offer[];
  services: ServiceOption[];
}) {
  const router = useRouter();
  const [offers, setOffers] = useState(initialOffers);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Offer | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.slug === form.serviceSlug) || null,
    [services, form.serviceSlug],
  );

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm({
      ...emptyForm,
      serviceSlug: services[0]?.slug || "",
    });
    setError("");
    setMessage("");
  }

  function openEdit(offer: Offer) {
    setCreating(false);
    setEditing(offer);
    setForm({
      serviceSlug: offer.serviceSlug || "",
      badge: offer.badge || "",
      description: offer.description || "",
      ctaLabel: offer.ctaLabel || "Book now",
      hidden: Boolean(offer.hidden),
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
    if (!form.serviceSlug) {
      setError("Select a service.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    const payload = {
      serviceSlug: form.serviceSlug,
      badge: form.badge,
      description: form.description,
      ctaLabel: form.ctaLabel,
      hidden: form.hidden,
    };

    try {
      const response = await fetch(
        editing ? `/api/admin/offers/${editing.id}` : "/api/admin/offers",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        item?: Offer;
      };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error(data.error || "Could not save offer.");
      }
      setOffers((prev) => {
        if (editing) {
          return prev.map((o) => (o.id === data.item!.id ? data.item! : o));
        }
        return [...prev, data.item!];
      });
      setMessage(
        editing
          ? "Offer updated. Arabic refreshed automatically."
          : "Offer added. Arabic generated automatically.",
      );
      closeForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save offer.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!pendingDelete) return;
    setBusy(true);
    const id = pendingDelete.id;
    const response = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    setPendingDelete(null);
    if (!data.ok) {
      setError(data.error || "Could not delete.");
      return;
    }
    setOffers((prev) => prev.filter((o) => o.id !== id));
    setMessage("Offer deleted.");
    router.refresh();
  }

  const field =
    "w-full rounded-lg border border-sand/15 bg-ink px-3 py-2.5 text-sm text-sand outline-none focus:border-olive/50";

  function serviceTitle(slug: string) {
    return services.find((s) => s.slug === slug)?.title || slug || "No service";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">
          {offers.length} offer(s) · each offer is for one service · home page
        </p>
        <button
          type="button"
          onClick={openCreate}
          disabled={services.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-crimson px-4 py-2.5 text-xs tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-50"
        >
          <Plus size={14} />
          Add offer
        </button>
      </div>

      {services.length === 0 && (
        <p className="text-sm text-crimson-soft">
          Add at least one service before creating offers.
        </p>
      )}

      {message && <p className="text-sm text-olive">{message}</p>}
      {error && <p className="text-sm text-crimson-soft">{error}</p>}

      {(creating || editing) && (
        <div className="admin-card space-y-4 border border-sand/10 bg-night/80 p-5">
          <h3 className="font-display text-2xl text-sand">
            {editing ? "Edit offer" : "New offer"}
          </h3>
          <p className="text-xs text-mist">
            Pick the service first. Title, image, and enquire link come from that
            service. Add a badge and offer note only.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Service *
              </span>
              <select
                className={field}
                value={form.serviceSlug}
                onChange={(e) =>
                  setForm({ ...form, serviceSlug: e.target.value })
                }
              >
                <option value="">Select a service…</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.title}
                  </option>
                ))}
              </select>
            </label>

            {selectedService ? (
              <div className="sm:col-span-2 rounded-lg border border-sand/10 bg-ink/50 p-4">
                <p className="text-xs tracking-[0.16em] text-olive uppercase">
                  From service
                </p>
                <p className="mt-2 font-display text-xl text-sand">
                  {selectedService.title}
                </p>
                <p className="mt-1 text-sm text-mist">{selectedService.short}</p>
                <p className="mt-2 text-xs text-mist">
                  Button opens enquire with this service pre-selected.
                </p>
              </div>
            ) : null}

            <label className="block">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Offer badge
              </span>
              <input
                className={field}
                placeholder="e.g. 20% off · Limited"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm text-sand">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(e) => setForm({ ...form, hidden: e.target.checked })}
              />
              Hide from home page
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Offer note (optional)
              </span>
              <textarea
                rows={3}
                className={field}
                placeholder="What is the deal? Validity, package details…"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                Button label
              </span>
              <input
                className={field}
                value={form.ctaLabel}
                onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
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
              {busy ? "Saving & translating…" : "Save offer"}
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
        {offers.length === 0 && (
          <p className="rounded-lg border border-dashed border-sand/15 p-8 text-sm text-mist">
            No offers yet. Pick a service and add a promotion for the home page.
          </p>
        )}
        {offers.map((offer) => (
          <article
            key={offer.id}
            className="admin-card flex flex-col gap-4 border border-sand/10 bg-night/80 p-5 md:flex-row md:items-center"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-2xl text-sand">
                  {offer.title || serviceTitle(offer.serviceSlug)}
                </p>
                {offer.badge ? (
                  <span className="rounded-full border border-olive/30 px-2 py-0.5 text-[10px] tracking-wide text-olive uppercase">
                    {offer.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs tracking-wide text-mist uppercase">
                Service · {serviceTitle(offer.serviceSlug)}
              </p>
              {offer.description ? (
                <p className="mt-2 text-sm text-mist">{offer.description}</p>
              ) : null}
              <p className="mt-2 text-xs tracking-wide uppercase">
                {offer.hidden ? (
                  <span className="text-crimson-soft">Hidden</span>
                ) : (
                  <span className="text-olive">Live on home</span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => openEdit(offer)}
                className="inline-flex items-center gap-1.5 text-xs tracking-wide text-olive uppercase hover:text-sand"
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(offer)}
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
        title="Delete offer?"
        message={
          pendingDelete
            ? `Delete offer for “${pendingDelete.title || serviceTitle(pendingDelete.serviceSlug)}”?`
            : "Delete this offer?"
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
