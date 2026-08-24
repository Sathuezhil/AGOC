"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FileText,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Shield,
  ExternalLink,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/services", label: "Services", icon: Shield },
  { href: "/admin/content", label: "Texts", icon: FileText },
  { href: "/admin/media", label: "Images", icon: ImageIcon },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-svh bg-ink text-sand">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-night lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs tracking-[0.22em] text-olive uppercase">AGOC</p>
          <p className="mt-1 font-display text-2xl text-white">Control room</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
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
                className={`flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide transition ${
                  active
                    ? "border-l-2 border-crimson bg-white/5 text-white"
                    : "border-l-2 border-transparent text-mist hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-6 py-5">
          <p className="truncate text-xs text-mist">{email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 inline-flex items-center gap-2 text-sm text-sand hover:text-crimson"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-ink/90 px-5 py-3 backdrop-blur md:px-8">
          <div className="flex gap-4 lg:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-wide uppercase ${
                  pathname === link.href ? "text-crimson" : "text-mist"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs tracking-wide text-mist uppercase hover:text-olive"
            >
              View site
              <ExternalLink size={12} />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-xs tracking-wide text-mist uppercase hover:text-crimson lg:hidden"
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
