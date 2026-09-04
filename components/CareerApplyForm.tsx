"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CareerJob } from "@/lib/careers";
import { CV_MAX_MB } from "@/lib/cv";
import type { Dictionary } from "@/lib/i18n";

export default function CareerApplyForm({
  jobs,
  dict,
  defaultJobId = "",
}: {
  jobs: CareerJob[];
  dict: Dictionary;
  defaultJobId?: string;
}) {
  const [form, setForm] = useState({
    jobId: defaultJobId,
    name: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!defaultJobId) return;
    setForm((prev) =>
      prev.jobId === defaultJobId ? prev : { ...prev, jobId: defaultJobId },
    );
  }, [defaultJobId]);

  const field =
    "contact-field w-full rounded-lg border border-sand/15 bg-night px-3.5 py-3 text-sm text-sand outline-none transition placeholder:text-mist/80 focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,162,39,0.18)]";

  const cvLabel = dict.careers.cvLabel || "CV / resume (PDF, optional)";
  const cvHint = (
    dict.careers.cvHint || "Optional. PDF only, max {mb} MB."
  ).replace("{mb}", String(CV_MAX_MB));
  const cvPdfOnly = dict.careers.cvPdfOnly || "Please upload a PDF CV only.";
  const cvTooLarge = (
    dict.careers.cvTooLarge || "CV must be under {mb} MB."
  ).replace("{mb}", String(CV_MAX_MB));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    if (cv) {
      if (cv.type !== "application/pdf" && !cv.name.toLowerCase().endsWith(".pdf")) {
        setError(cvPdfOnly);
        setStatus("error");
        return;
      }
      if (cv.size > CV_MAX_MB * 1024 * 1024) {
        setError(cvTooLarge);
        setStatus("error");
        return;
      }
    }

    try {
      const body = new FormData();
      body.append("jobId", form.jobId);
      body.append("name", form.name);
      body.append("email", form.email);
      body.append("phone", form.phone);
      body.append("experience", form.experience);
      body.append("message", form.message);
      if (cv) body.append("cv", cv);

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body,
        credentials: "same-origin",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || dict.form.sendFailed);
      }
      setStatus("ok");
      setForm({
        jobId: defaultJobId || "",
        name: "",
        email: "",
        phone: "",
        experience: "",
        message: "",
      });
      setCv(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : dict.form.somethingWrong);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <select
        required
        name="jobId"
        value={form.jobId}
        onChange={(e) => setForm({ ...form, jobId: e.target.value })}
        className={`${field} appearance-none`}
      >
        <option value="">{dict.careers.selectRole}</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>
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
        <input
          required
          name="experience"
          placeholder={dict.careers.experience}
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          className={field}
        />
      </div>
      <textarea
        required
        name="message"
        rows={5}
        placeholder={dict.careers.cover}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${field} min-h-[7rem] resize-y`}
      />

      <div className="rounded-lg border border-dashed border-sand/15 bg-ink/30 p-4">
        <label className="block cursor-pointer">
          <span className="text-xs tracking-[0.16em] text-mist uppercase rtl:tracking-normal rtl:normal-case">
            {cvLabel}
          </span>
          <span className="mt-1 block text-xs text-mist/80">
            {cvHint}
          </span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="mt-3 block w-full text-sm text-sand file:mr-3 file:rounded-md file:border-0 file:bg-crimson file:px-3 file:py-2 file:text-xs file:font-medium file:tracking-wide file:text-white file:uppercase hover:file:bg-crimson-dark"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setCv(file);
            }}
          />
        </label>
        {cv && (
          <p className="mt-2 text-xs text-olive">
            {cv.name} · {(cv.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shine w-full rounded-lg bg-crimson py-3.5 text-sm font-medium tracking-[0.16em] text-white uppercase transition duration-300 hover:bg-crimson-dark disabled:opacity-70 rtl:tracking-normal rtl:normal-case"
      >
        {status === "sending" ? dict.form.sending : dict.careers.send}
      </button>
      {status === "ok" && (
        <p className="text-sm text-olive">{dict.careers.thankYou}</p>
      )}
      {status === "error" && <p className="text-sm text-crimson-soft">{error}</p>}
    </form>
  );
}
