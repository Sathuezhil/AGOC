import Link from "next/link";
import { FileText, ImageIcon, Inbox, Shield, ArrowRight } from "lucide-react";
import { listEnquiries } from "@/lib/enquiries";
import { getServices } from "@/lib/services";

export default async function AdminHomePage() {
  const [enquiries, services] = await Promise.all([
    listEnquiries(),
    getServices(),
  ]);
  const fresh = enquiries.filter((item) => item.status === "new").length;
  const live = services.filter((item) => !item.hidden).length;
  const hidden = services.length - live;

  const cards = [
    { label: "New enquiries", value: String(fresh), href: "/admin/enquiries" },
    { label: "All enquiries", value: String(enquiries.length), href: "/admin/enquiries" },
    { label: "Live services", value: String(live), href: "/admin/services" },
    { label: "Hidden services", value: String(hidden), href: "/admin/services" },
  ];

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Overview
      </p>
      <h1 className="mt-4 font-display text-4xl text-white">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Manage the public website from here — enquiries, services, texts, and
        images.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-white/10 bg-night p-5 transition hover:border-olive/40"
          >
            <p className="text-xs tracking-[0.18em] text-mist uppercase">
              {card.label}
            </p>
            <p className="mt-3 font-display text-4xl text-white">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/services"
          className="border border-white/10 bg-night p-6 transition hover:border-olive/40"
        >
          <Shield className="text-olive" size={20} />
          <h2 className="mt-3 font-display text-2xl text-white">Services</h2>
          <p className="mt-2 text-sm text-mist">Add, edit, delete, and hide service pages.</p>
        </Link>
        <Link
          href="/admin/content"
          className="border border-white/10 bg-night p-6 transition hover:border-olive/40"
        >
          <FileText className="text-olive" size={20} />
          <h2 className="mt-3 font-display text-2xl text-white">Texts</h2>
          <p className="mt-2 text-sm text-mist">Edit hero, home, about, and contact copy.</p>
        </Link>
        <Link
          href="/admin/media"
          className="border border-white/10 bg-night p-6 transition hover:border-olive/40"
        >
          <ImageIcon className="text-olive" size={20} />
          <h2 className="mt-3 font-display text-2xl text-white">Images</h2>
          <p className="mt-2 text-sm text-mist">Upload and pick photos used across the site.</p>
        </Link>
      </div>

      <section className="mt-10 border border-white/10 bg-night p-6">
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl text-white">
            <Inbox size={18} className="text-olive" />
            Latest enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs tracking-wide text-olive uppercase"
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
              className="border-b border-white/10 pb-3 text-sm last:border-0"
            >
              <p className="text-white">{item.name}</p>
              <p className="text-mist">
                {item.service} · {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
