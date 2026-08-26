import Link from "next/link";
import { Plus } from "lucide-react";
import { getServices } from "@/lib/services";
import ServiceActions from "./ServiceActions";

export default async function AdminServicesPage() {
  const items = await getServices();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            Catalogue
          </p>
          <h1 className="mt-4 font-display text-4xl text-sand">Services</h1>
          <p className="mt-2 max-w-2xl text-mist">
            Add, edit, or delete services. Changes show on the public website.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="btn-shine inline-flex items-center gap-2 bg-crimson px-5 py-3 text-sm font-medium tracking-wide text-white uppercase shadow-lg shadow-crimson/20 hover:bg-crimson-dark"
        >
          <Plus size={16} />
          Add new service
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {items.length === 0 && (
          <div className="admin-card border border-dashed border-sand/20 bg-night/50 p-10 text-center">
            <p className="text-sm text-mist">No services yet. Add the first one.</p>
            <Link
              href="/admin/services/new"
              className="btn-shine mt-5 inline-flex items-center gap-2 bg-crimson px-5 py-3 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark"
            >
              <Plus size={16} />
              Add new service
            </Link>
          </div>
        )}
        {items.map((service) => (
          <article
            key={service.slug}
            className="admin-card flex flex-col gap-4 border border-sand/10 bg-night/80 p-5 transition duration-300 hover:border-olive/35 md:flex-row md:items-center"
          >
            <div className="relative h-20 w-32 shrink-0 overflow-hidden bg-ink">
              {service.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl text-sand">{service.title}</p>
              <p className="mt-1 text-sm text-mist">{service.short}</p>
              <p className="mt-2 text-xs tracking-wide uppercase">
                {service.hidden ? (
                  <span className="text-crimson-soft">Hidden</span>
                ) : (
                  <span className="text-olive">Live</span>
                )}
              </p>
            </div>
            <ServiceActions slug={service.slug} title={service.title} />
          </article>
        ))}
      </div>
    </div>
  );
}
