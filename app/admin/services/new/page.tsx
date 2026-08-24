import Link from "next/link";
import ServiceForm from "../ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <Link href="/admin/services" className="text-sm text-mist hover:text-olive">
        ← Services
      </Link>
      <h1 className="mt-4 font-display text-4xl text-white">Add service</h1>
      <ServiceForm mode="create" />
    </div>
  );
}
