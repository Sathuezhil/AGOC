"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/services", label: "Services", icon: Shield },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/content", label: "Texts", icon: FileText },
  { href: "/admin/media", label: "Images", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="admin-shell relative min-h-svh bg-ink text-sand">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="admin-glow admin-glow-a" />
        <div className="admin-glow admin-glow-b" />
      </div>

      <aside className="admin-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sand/10 bg-night/95 backdrop-blur-md lg:flex lg:flex-col">
        <div className="relative overflow-hidden border-b border-sand/10 px-6 py-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-olive/70 to-transparent" />
          <p className="text-xs tracking-[0.22em] text-olive uppercase">AGOC</p>
          <p className="mt-1 font-display text-2xl text-sand">Control room</p>
          <p className="mt-1 text-xs text-mist">Website ops desk</p>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-5">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm tracking-wide transition duration-300 ${
                  active
                    ? "bg-crimson/15 text-sand shadow-[inset_3px_0_0_0_#2D9B45]"
                    : "text-mist hover:bg-sand/[0.04] hover:text-sand"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition duration-300 ${
                    active
                      ? "border-crimson/40 bg-crimson/20 text-crimson-soft"
                      : "border-sand/10 bg-ink/40 text-olive group-hover:border-olive/40"
                  }`}
                >
                  <Icon size={15} />
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sand/10 px-5 pt-5 pb-14">
          <p className="truncate text-xs text-mist">{email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-sand/20 bg-ink/55 px-3 py-2 text-sm text-sand transition hover:border-crimson/45 hover:text-crimson"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-sand/10 bg-ink/80 px-5 py-3 backdrop-blur-md md:px-8">
          <div className="flex max-w-[55%] gap-3 overflow-x-auto lg:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 text-xs tracking-wide uppercase transition ${
                  pathname === link.href ||
                  (link.href !== "/admin" && pathname.startsWith(link.href))
                    ? "text-crimson"
                    : "text-mist hover:text-sand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <ThemeToggle variant="admin" />
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-sand/15 bg-night/60 px-3 py-2 text-xs tracking-wide text-mist uppercase transition hover:border-olive/40 hover:text-olive"
            >
              View site
              <ExternalLink size={12} />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-sand/20 bg-ink/40 px-2.5 py-1.5 text-xs tracking-wide text-sand uppercase transition hover:border-crimson/45 hover:text-crimson lg:hidden"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="px-5 py-8 md:px-8 md:py-10">{children}</div>
      </div>
    </div>
  );
}
