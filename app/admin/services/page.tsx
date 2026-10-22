import Link from "next/link";
import { Plus, Shield } from "lucide-react";
import { getServices } from "@/lib/services";
import ServicesList from "./ServicesList";

export default async function AdminServicesPage() {
  const items = await getServices();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-[#C9A227] uppercase">
            Service Catalogue
          </p>
          <h1 className="mt-2 font-display text-3xl text-sand sm:text-4xl">
            Services
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-mist">
            Manage public security, facility management, and cleaning services. Grouped into categories just like the user website.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0066FF] px-5 py-2.5 text-xs font-semibold tracking-wider text-white uppercase shadow-lg shadow-[#0066FF]/25 hover:bg-[#0052CC] transition"
        >
          <Plus size={16} /> Add new service
        </Link>
      </div>

      <ServicesList items={items} />
    </div>
  );
}
