"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

const initial = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export default function ContactForm({
  services,
  defaultService = "",
  dict,
}: {
  services: { title: string; slug?: string }[];
  defaultService?: string;
  dict: Dictionary;
}) {
  const needle = defaultService.trim().toLowerCase();
  const matched =
    services.find((s) => s.slug?.toLowerCase() === needle)?.title ||
    services.find((s) => s.title === defaultService)?.title ||
    services.find((s) => s.title.toLowerCase() === needle)?.title ||
    "";

  const [form, setForm] = useState({ ...initial, service: matched });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!matched) return;
    setForm((prev) =>
      prev.service === matched ? prev : { ...prev, service: matched },
    );
  }, [matched]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || dict.form.sendFailed);
      }

      setStatus("ok");
      setForm({ ...initial, service: matched });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : dict.form.somethingWrong);
    }
  }

  const field =
    "contact-field w-full rounded-lg border border-sand/15 bg-night px-3.5 py-3 text-sm text-sand outline-none transition placeholder:text-mist/80 focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,162,39,0.18)]";

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder={dict.form.name}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={field}
        />
        <input
          required
          type="email"
          name="email"
          placeholder={dict.form.email}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={field}
        />
        <input
          required
          name="phone"
          placeholder={dict.form.phone}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={field}
        />
        <select
          required
          name="service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className={`${field} appearance-none`}
        >
          <option value="">{dict.form.selectService}</option>
          {services.map((service) => (
            <option key={service.title} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </div>
      <textarea
        required
        name="message"
        rows={4}
        placeholder={dict.form.message}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${field} min-h-[6.5rem] resize-y`}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shine w-full rounded-lg bg-crimson py-3.5 text-sm font-medium tracking-[0.16em] text-white uppercase transition duration-300 hover:bg-crimson-dark disabled:opacity-70 rtl:tracking-normal rtl:normal-case"
      >
        {status === "sending" ? dict.form.sending : dict.form.send}
      </button>
      {status === "ok" && (
        <p className="text-sm text-olive">{dict.form.thankYou}</p>
      )}
      {status === "error" && <p className="text-sm text-crimson-soft">{error}</p>}
    </form>
  );
}
