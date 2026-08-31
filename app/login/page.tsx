import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ThemeBrandLogo from "@/components/ThemeBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { brandLogo, brandLogoLight } from "@/lib/site";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink px-6 py-12">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/images/city.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/90 to-crimson/30" />
      <div className="absolute right-5 top-5 z-20 md:right-8 md:top-8">
        <ThemeToggle variant="admin" />
      </div>
      <div className="relative w-full max-w-md border border-sand/10 bg-night/90 p-8 shadow-glow backdrop-blur-sm md:p-10">
        <div className="mb-5 flex justify-center">
          <ThemeBrandLogo
            darkSrc={brandLogo}
            lightSrc={brandLogoLight}
            compact
            className="mx-auto h-auto w-full max-w-[8rem]"
          />
        </div>
        <p className="olive-label text-center text-sm font-semibold tracking-[0.3em] text-olive uppercase">
          Admin access
        </p>
        <h1 className="mt-4 font-display text-4xl text-sand">Sign in</h1>
        <p className="mt-2 text-sm text-mist">
          Manage enquiries, services, and the public site from the control room.
        </p>
        <div className="mt-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-sand/70 underline-offset-4 hover:text-olive hover:underline"
        >
          Back to website
        </Link>
      </div>
    </div>
  );
}
