"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

const field =
  "w-full border border-sand/10 bg-ink px-3 py-2.5 text-sm text-sand outline-none focus:border-olive";

export default function SettingsForm({ email }: { email: string }) {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        email?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not save settings.");
      }

      setStatus("ok");
      setMessage(data.message || "Settings saved.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (data.email) setAdminEmail(data.email);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <div className="mt-8 grid max-w-3xl gap-6">
      <section className="admin-card border border-sand/10 bg-night/80 p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-olive/25 bg-olive/10 text-olive">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h2 className="font-display text-2xl text-sand">Account</h2>
            <p className="mt-1 text-sm text-mist">
              Signed in as <span className="text-sand">{email}</span>
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={onSubmit}
        className="admin-card space-y-5 border border-sand/10 bg-night/80 p-6"
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-crimson/25 bg-crimson/10 text-crimson-soft">
            <KeyRound size={18} />
          </span>
          <div>
            <h2 className="font-display text-2xl text-sand">Login credentials</h2>
            <p className="mt-1 text-sm text-mist">
              Change the admin email or password. Current password is required
              to save.
            </p>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Admin email
          </span>
          <input
            required
            type="email"
            autoComplete="username"
            className={field}
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Current password
          </span>
          <input
            required
            type="password"
            autoComplete="current-password"
            className={field}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>

        <div className="grid gap-4 border-t border-sand/10 pt-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
              New password
            </span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Leave blank to keep"
              className={field}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
              Confirm new password
            </span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Repeat new password"
              className={field}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </div>
        <p className="text-xs text-mist">
          New password must be at least 8 characters if you change it.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "saving"}
            className="btn-shine bg-crimson px-6 py-3 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-70"
          >
            {status === "saving" ? "Saving…" : "Save credentials"}
          </button>
          {status === "ok" && <p className="text-sm text-olive">{message}</p>}
          {status === "error" && (
            <p className="text-sm text-crimson-soft">{message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
