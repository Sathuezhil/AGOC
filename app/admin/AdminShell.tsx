"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Briefcase,
  ExternalLink,
  FileText,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  Shield,
  Tag,
  Users,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeBrandLogo from "@/components/ThemeBrandLogo";
import { brandLogo, brandLogoLight } from "@/lib/site";
import AdminNotifications from "./AdminNotifications";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/services", label: "Services", icon: Shield },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/content", label: "Texts", icon: FileText },
  { href: "/admin/media", label: "Images", icon: ImageIcon },
  { href: "/admin/activity", label: "Activity", icon: ScrollText },
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
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setLogoutOpen(false);
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="admin-shell relative min-h-svh bg-ink text-sand">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="admin-glow admin-glow-a" />
        <div className="admin-glow admin-glow-b" />
      </div>

      <aside className="admin-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sand/10 bg-night/95 backdrop-blur-md lg:flex lg:flex-col">
        <div className="relative shrink-0 border-b border-sand/10 px-3 py-2">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-olive/70 to-transparent" />
          <Link
            href="/admin"
            className="mx-auto flex max-w-[15.5rem] items-center justify-center rounded-lg px-1 py-1"
          >
            <ThemeBrandLogo
              darkSrc={brandLogo}
              lightSrc={brandLogoLight}
              compact
              className="h-auto max-h-25 w-full"
            />
          </Link>
          <p className="admin-control-room-label mt-1.5 text-center text-[10px] font-semibold uppercase">
            <span className="admin-control-room-label-text">Control room</span>
          </p>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3">
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
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm tracking-wide transition duration-300 ${
                  active
                    ? "bg-crimson/15 text-sand shadow-[inset_3px_0_0_0_#0066FF]"
                    : "text-mist hover:bg-sand/[0.04] hover:text-sand"
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition duration-300 ${
                    active
                      ? "border-crimson/40 bg-crimson/20 text-crimson-soft"
                      : "border-sand/10 bg-ink/40 text-olive group-hover:border-olive/40"
                  }`}
                >
                  <Icon size={14} />
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-sand/10 px-5 py-3">
          <p className="truncate text-center text-xs text-mist">{email}</p>
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
            <AdminNotifications />
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
              onClick={() => setLogoutOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-sand/20 bg-ink/40 px-2.5 py-1.5 text-xs tracking-wide text-sand uppercase transition hover:border-crimson/45 hover:text-crimson"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </header>

        <div className="px-5 py-8 md:px-8 md:py-10">{children}</div>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Sign out?"
        message="You will need to log in again to open the control room."
        confirmLabel="Yes, sign out"
        cancelLabel="No, stay"
        busyLabel="Signing out…"
        busy={loggingOut}
        onConfirm={() => void logout()}
        onCancel={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
      />
    </div>
  );
}
