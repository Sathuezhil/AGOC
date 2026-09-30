"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
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

  if (status === "ok") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={22} className="shrink-0 text-olive" />
        <div>
          <p className="font-medium text-sand">{dict.form.thankYou}</p>
          <button
            type="button"
            className="mt-3 text-sm text-olive underline-offset-2 hover:underline"
            onClick={() => setStatus("idle")}
          >
            {dict.form.send}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="form-stack space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-field-wrap">
          <span className="form-label">{dict.form.name}</span>
          <input
            required
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="form-field contact-field"
          />
        </label>
        <label className="form-field-wrap">
          <span className="form-label">{dict.form.email}</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-field contact-field"
          />
        </label>
        <label className="form-field-wrap">
          <span className="form-label">{dict.form.phone}</span>
          <input
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="form-field contact-field"
          />
        </label>
        <label className="form-field-wrap">
          <span className="form-label">{dict.form.selectService}</span>
          <select
            required
            name="service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="form-field contact-field appearance-none"
          >
            <option value="">{dict.form.selectService}</option>
            {services.map((service) => (
              <option key={service.title} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="form-field-wrap">
        <span className="form-label">{dict.form.message}</span>
        <textarea
          required
          name="message"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="form-field contact-field min-h-[6.5rem] resize-y"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shine w-full rounded-lg bg-crimson py-3.5 text-sm font-medium tracking-[0.16em] text-white uppercase transition duration-300 hover:bg-crimson-dark disabled:opacity-70 rtl:tracking-normal rtl:normal-case"
      >
        {status === "sending" ? dict.form.sending : dict.form.send}
      </button>
      {status === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
