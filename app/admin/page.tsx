import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ImageIcon,
  Inbox,
  Shield,
  BadgeCheck,
  Users,
} from "lucide-react";
import { listEnquiries } from "@/lib/enquiries";
import { getServices } from "@/lib/services";
import { getContent } from "@/lib/content";

export default async function AdminHomePage() {
  const [enquiries, services, content] = await Promise.all([
    listEnquiries(),
    getServices(),
    getContent(),
  ]);
  const fresh = enquiries.filter((item) => item.status === "new").length;
  const live = services.filter((item) => !item.hidden).length;
  const teamCount = content.about.team.length;

  const cards = [
    {
      label: "New enquiries",
      value: String(fresh),
      href: "/admin/enquiries",
      accent: "crimson",
      icon: Inbox,
    },
    {
      label: "All enquiries",
      value: String(enquiries.length),
      href: "/admin/enquiries",
      accent: "olive",
      icon: BadgeCheck,
    },
    {
      label: "Live services",
      value: String(live),
      href: "/admin/services",
      accent: "olive",
      icon: Shield,
    },
    {
      label: "Team members",
      value: String(teamCount),
      href: "/admin/team",
      accent: "olive",
      icon: Users,
    },
  ] as const;

  const shortcuts = [
    {
      href: "/admin/services/new",
      title: "Add service",
      text: "Create a new service page for the public site.",
      icon: Shield,
    },
    {
      href: "/admin/team",
      title: "Team",
      text: "Manage founder and team members on the About page.",
      icon: Users,
    },
    {
      href: "/admin/content",
      title: "Texts",
      text: "Edit hero, home, about, and contact copy.",
      icon: FileText,
    },
    {
      href: "/admin/media",
      title: "Images",
      text: "Upload and pick photos used across the site.",
      icon: ImageIcon,
    },
  ];

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Overview
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand md:text-5xl">
        Dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-mist">
        Manage the public website from here — enquiries, services, texts, and
        images.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="admin-card group relative overflow-hidden border border-sand/10 bg-night/80 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-olive/40"
            >
              <div
                className={`absolute inset-x-0 top-0 h-0.5 ${
                  card.accent === "crimson"
                    ? "bg-crimson"
                    : card.accent === "olive"
                      ? "bg-olive"
                      : "bg-mist/50"
                }`}
              />
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs tracking-[0.18em] text-mist uppercase">
                  {card.label}
                </p>
                <Icon
                  size={16}
                  className={
                    card.accent === "crimson"
                      ? "text-crimson-soft"
                      : "text-olive"
                  }
                />
              </div>
              <p className="mt-3 font-display text-4xl text-sand transition group-hover:text-olive">
                {card.value}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="admin-card group border border-sand/10 bg-night/80 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-olive/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-olive/25 bg-olive/10 text-olive transition group-hover:border-olive/50 group-hover:bg-olive/20">
                <Icon size={18} />
              </span>
              <h2 className="mt-4 font-display text-2xl text-sand">{item.title}</h2>
              <p className="mt-2 text-sm text-mist">{item.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs tracking-wide text-olive uppercase opacity-0 transition group-hover:opacity-100">
                Open
                <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="admin-card mt-10 border border-sand/10 bg-night/80 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl text-sand">
            <Inbox size={18} className="text-olive" />
            Latest enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs tracking-wide text-olive uppercase transition hover:text-crimson"
          >
            Open
            <ArrowRight size={12} />
          </Link>
        </div>
        <ul className="mt-5 space-y-3">
          {enquiries.slice(0, 5).length === 0 && (
            <li className="text-sm text-mist">
              No enquiries yet. Submissions from the contact page appear here.
            </li>
          )}
          {enquiries.slice(0, 5).map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-sand/10 pb-3 text-sm last:border-0"
            >
              <div>
                <p className="text-sand">{item.name}</p>
                <p className="text-mist">
                  {item.service} · {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[0.65rem] tracking-wide uppercase ${
                  item.status === "new"
                    ? "bg-crimson/15 text-crimson-soft"
                    : item.status === "done"
                      ? "bg-olive/15 text-olive"
                      : "bg-sand/10 text-mist"
                }`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
