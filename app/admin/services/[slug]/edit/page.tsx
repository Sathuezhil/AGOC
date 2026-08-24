import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/lib/services";
import ServiceForm from "../../ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <div>
      <Link href="/admin/services" className="text-sm text-mist hover:text-olive">
        ← Services
      </Link>
      <h1 className="mt-4 font-display text-4xl text-white">Edit {service.title}</h1>
      <ServiceForm mode="edit" initial={service} />
    </div>
  );
}
