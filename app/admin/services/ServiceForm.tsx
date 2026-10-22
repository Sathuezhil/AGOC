"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service, ServiceCategory } from "@/lib/services";
import { uniqueMediaSrcs } from "@/lib/media-path";
import ImagePicker from "../ImagePicker";
import { ArrowLeft, Check, Plus, Shield, Trash2 } from "lucide-react";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-sand/15 bg-ink/70 px-4 py-2.5 text-sm text-sand outline-none transition placeholder:text-mist/50 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20";

const empty: Service = {
  slug: "",
  title: "",
  short: "",
  summary: "",
  image: "",
  focus: "",
  gallery: ["", "", ""],
  points: ["", "", "", "", ""],
  hidden: false,
  category: "security",
};

export default function ServiceForm({
  initial,
  mode,
}: {
  initial?: Service;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<Service>(initial ?? empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof Service>(key: K, value: Service[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload: Service = {
      ...form,
      category: form.category || "security",
      gallery: uniqueMediaSrcs(
        form.gallery.map((item) => item.trim()).filter(Boolean),
      ),
      points: form.points.map((item) => item.trim()).filter(Boolean),
    };
    const url =
      mode === "create"
        ? "/api/admin/services"
        : `/api/admin/services/${initial?.slug}`;
    const response = await fetch(url, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string; item?: Service };
    setBusy(false);
    if (!data.ok) {
      setError(data.error || "Could not save.");
      return;
    }
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-2">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-mist uppercase transition hover:text-sand"
        >
          <ArrowLeft size={14} /> Back to services
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="admin-card rounded-2xl border border-sand/10 bg-night/70 p-6 backdrop-blur-sm sm:p-7 space-y-5">
        <h2 className="text-base font-semibold text-sand flex items-center gap-2">
          <Shield size={18} className="text-[#0066FF]" /> Service Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold tracking-wider text-mist uppercase">
              Service Title *
            </span>
            <input
              required
              className={inputClass}
              placeholder="e.g. Private Guarding Services"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold tracking-wider text-mist uppercase">
              Category *
            </span>
            <select
              value={form.category || "security"}
              onChange={(e) => set("category", e.target.value as ServiceCategory)}
              className={inputClass}
            >
              <option value="security">🛡️ Security Services</option>
              <option value="facility">🏢 Facility Management</option>
              <option value="cleaning">🧹 Cleaning Services</option>
            </select>
            <p className="mt-1 text-[11px] text-mist">
              Determines which filter tab this service appears under on the website.
            </p>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold tracking-wider text-mist uppercase">
              URL Slug
            </span>
            <input
              className={inputClass}
              placeholder="auto-generated from title"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold tracking-wider text-mist uppercase">
            Short Tagline / Catchphrase *
          </span>
          <input
            required
            className={inputClass}
            placeholder="e.g. Licensed officers for homes, offices, and private sites."
            value={form.short}
            onChange={(e) => set("short", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold tracking-wider text-mist uppercase">
            Full Description / Summary *
          </span>
          <textarea
            required
            rows={5}
            className={inputClass}
            placeholder="Detailed overview explaining this service to prospective clients..."
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </label>
      </div>

      {/* Media Card */}
      <div className="admin-card rounded-2xl border border-sand/10 bg-night/70 p-6 backdrop-blur-sm sm:p-7 space-y-5">
        <h2 className="text-base font-semibold text-sand">Images & Media</h2>

        <ImagePicker
          label="Main Cover Image"
          value={form.image}
          onChange={(src) => {
            setForm((current) => ({ ...current, image: src, focus: "center" }));
          }}
        />

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold tracking-wider text-mist uppercase">
            Image focus (optional)
          </span>
          <input
            className={inputClass}
            placeholder="center"
            value={form.focus ?? ""}
            onChange={(e) => set("focus", e.target.value)}
          />
          <p className="mt-1 text-[11px] text-mist">
            Keep this as <span className="text-sand font-medium">center</span> after cropping.
          </p>
        </label>

        <div className="pt-2 border-t border-sand/10">
          <p className="mb-3 text-xs font-semibold tracking-wider text-mist uppercase">
            Gallery Showcase Photos
          </p>
          <div className="space-y-3">
            {form.gallery.map((src, i) => (
              <div key={`${i}-${src || "empty"}`} className="relative">
                <ImagePicker
                  label={`Gallery Photo ${i + 1}`}
                  value={src}
                  onChange={(next) => {
                    const gallery = [...form.gallery];
                    gallery[i] = next;
                    set("gallery", gallery);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("gallery", [...form.gallery, ""])}
              className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-[#0066FF] hover:text-[#3D96FF] uppercase transition"
            >
              <Plus size={14} /> Add photo
            </button>
          </div>
        </div>
      </div>

      {/* Points Card */}
      <div className="admin-card rounded-2xl border border-sand/10 bg-night/70 p-6 backdrop-blur-sm sm:p-7 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-sand">What Clients Get (Key Highlights)</h2>
          <p className="mt-1 text-xs text-mist">
            Bullet points displayed in the &ldquo;What You Get&rdquo; section on the service page.
          </p>
        </div>

        <div className="space-y-2.5">
          {form.points.map((point, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0066FF]/15 text-[#0066FF] text-xs font-bold">
                {i + 1}
              </span>
              <input
                className={inputClass}
                placeholder="e.g. 24/7 post coverage and incident logging"
                value={point}
                onChange={(e) => {
                  const points = [...form.points];
                  points[i] = e.target.value;
                  set("points", points);
                }}
              />
              {form.points.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const points = form.points.filter((_, idx) => idx !== i);
                    set("points", points);
                  }}
                  className="p-2 text-mist hover:text-rose-400 transition"
                  title="Remove bullet"
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("points", [...form.points, ""])}
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-[#0066FF] hover:text-[#3D96FF] uppercase transition mt-2"
          >
            <Plus size={14} /> Add bullet point
          </button>
        </div>
      </div>

      {/* Visibility & Submit */}
      <div className="admin-card rounded-2xl border border-sand/10 bg-night/70 p-6 backdrop-blur-sm sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-sand/20 text-[#0066FF] focus:ring-[#0066FF]"
            checked={Boolean(form.hidden)}
            onChange={(e) => set("hidden", e.target.checked)}
          />
          <div>
            <span className="text-sm font-medium text-sand block">Hide from public website</span>
            <span className="text-xs text-mist block">Only visible to administrators when checked</span>
          </div>
        </label>

        {error && <p className="text-sm text-rose-400 w-full">{error}</p>}

        <div className="flex items-center gap-3 ml-auto">
          <Link
            href="/admin/services"
            className="rounded-xl border border-sand/15 px-5 py-2.5 text-sm font-medium text-mist hover:text-sand transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_10px_25px_-10px_rgba(0,102,255,0.5)] transition disabled:opacity-60"
          >
            {busy ? "Saving…" : mode === "create" ? "Create Service" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
