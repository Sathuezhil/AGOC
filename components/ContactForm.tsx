"use client";

import { FormEvent, useState } from "react";

const initial = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export default function ContactForm({
  services,
}: {
  services: { title: string }[];
}) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

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
        throw new Error(data.error || "Unable to send your request.");
      }

      setStatus("ok");
      setForm(initial);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const field =
    "w-full border border-sand/15 bg-night px-4 py-3 text-sm text-sand outline-none transition placeholder:text-mist focus:border-olive shadow-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={field}
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={field}
        />
        <input
          required
          name="phone"
          placeholder="Phone number"
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
          <option value="">Select a service</option>
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
        rows={5}
        placeholder="Tell us about the site, hours, and what you need protected."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${field} resize-y`}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shine w-full bg-crimson py-3.5 text-sm font-medium tracking-[0.16em] text-white uppercase transition duration-300 hover:bg-crimson-dark disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send request"}
      </button>
      {status === "ok" && (
        <p className="text-base text-olive">
          Thank you. Our team will contact you shortly.
        </p>
      )}
      {status === "error" && <p className="text-sm text-crimson-soft">{error}</p>}
    </form>
  );
}
