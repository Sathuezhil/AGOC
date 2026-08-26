"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }
      const from = searchParams.get("from");
      router.push(from?.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      setSending(false);
    }
  }

  const field =
    "w-full border border-sand/15 bg-ink/70 px-4 py-3 text-sm text-sand outline-none transition placeholder:text-mist/50 focus:border-olive";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs tracking-[0.18em] text-mist uppercase">
          Email
        </label>
        <input
          required
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs tracking-[0.18em] text-mist uppercase">
          Password
        </label>
        <input
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
        />
      </div>
      {error && <p className="text-sm text-crimson-soft">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="btn-shine w-full bg-crimson py-3.5 text-sm font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-crimson-dark disabled:opacity-70"
      >
        {sending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
