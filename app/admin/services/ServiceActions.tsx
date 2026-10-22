"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ServiceActions({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [askDelete, setAskDelete] = useState(false);

  async function remove() {
    setBusy(true);
    await fetch(`/api/admin/services/${slug}`, { method: "DELETE" });
    setAskDelete(false);
    router.refresh();
    setBusy(false);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/services/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 rounded-lg border border-sand/15 bg-night/50 px-2.5 py-1.5 text-xs font-medium text-mist hover:text-sand hover:border-sand/30 transition"
          title="View on live website"
        >
          <ExternalLink size={12} /> View
        </Link>
        <Link
          href={`/admin/services/${slug}/edit`}
          className="inline-flex items-center gap-1 rounded-lg border border-[#0066FF]/30 bg-[#0066FF]/10 px-2.5 py-1.5 text-xs font-medium text-[#3D96FF] hover:bg-[#0066FF]/20 hover:text-white transition"
          title="Edit service details"
        >
          <Pencil size={12} /> Edit
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => setAskDelete(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition"
          title="Delete service"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>

      <ConfirmDialog
        open={askDelete}
        title="Delete service?"
        message={`Are you sure you want to delete “${title}”? This removes it from the public website and catalogue.`}
        confirmLabel="Yes, delete service"
        cancelLabel="Cancel"
        busy={busy}
        onCancel={() => setAskDelete(false)}
        onConfirm={remove}
      />
    </>
  );
}
