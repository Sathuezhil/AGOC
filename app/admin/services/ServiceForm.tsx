"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/services";
import ImagePicker from "../ImagePicker";

const field =
  "w-full border border-white/10 bg-ink px-3 py-2 text-sm text-sand outline-none focus:border-olive";

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
      gallery: form.gallery.map((item) => item.trim()).filter(Boolean),
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
    <form onSubmit={onSubmit} className="mt-8 max-w-3xl space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
          Title
        </span>
        <input
          required
          className={field}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
          URL slug
        </span>
        <input
          className={field}
          placeholder="auto from title"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
          Short line
        </span>
        <input
          required
          className={field}
          value={form.short}
          onChange={(e) => set("short", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
          Full summary
        </span>
        <textarea
          required
          rows={5}
          className={field}
          value={form.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
      </label>
      <ImagePicker
        label="Main image"
        value={form.image}
        onChange={(src) => set("image", src)}
      />
      <label className="block">
        <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
          Image focus (optional)
        </span>
        <input
          className={field}
          placeholder="top / center 38%"
          value={form.focus ?? ""}
          onChange={(e) => set("focus", e.target.value)}
        />
      </label>
      <div>
        <p className="mb-2 text-xs tracking-[0.16em] text-mist uppercase">
          Gallery images
        </p>
        <div className="space-y-3">
          {form.gallery.map((src, i) => (
            <ImagePicker
              key={`${i}-${src || "empty"}`}
              label={`Photo ${i + 1}`}
              value={src}
              onChange={(next) => {
                const gallery = [...form.gallery];
                gallery[i] = next;
                set("gallery", gallery);
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => set("gallery", [...form.gallery, ""])}
            className="text-xs tracking-wide text-olive uppercase"
          >
            Add gallery image
          </button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs tracking-[0.16em] text-mist uppercase">
          What you get
        </p>
        {form.points.map((point, i) => (
          <input
            key={i}
            className={`${field} mb-2`}
            value={point}
            onChange={(e) => {
              const points = [...form.points];
              points[i] = e.target.value;
              set("points", points);
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => set("points", [...form.points, ""])}
          className="text-xs tracking-wide text-olive uppercase"
        >
          Add point
        </button>
      </div>
      <label className="flex items-center gap-2 text-sm text-sand">
        <input
          type="checkbox"
          checked={Boolean(form.hidden)}
          onChange={(e) => set("hidden", e.target.checked)}
        />
        Hide from the public website
      </label>
      {error && <p className="text-sm text-crimson-soft">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="btn-shine bg-crimson px-6 py-3 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-70"
      >
        {busy ? "Saving…" : "Save service"}
      </button>
    </form>
  );
}
