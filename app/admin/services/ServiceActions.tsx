"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      <div className="flex items-center gap-3">
        <Link
          href={`/services/${slug}`}
          target="_blank"
          className="text-xs tracking-wide text-sand uppercase hover:text-olive"
        >
          View
        </Link>
        <Link
          href={`/admin/services/${slug}/edit`}
          className="text-xs tracking-wide text-olive uppercase hover:text-sand"
        >
          Edit
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => setAskDelete(true)}
          className="text-xs tracking-wide text-crimson uppercase hover:text-crimson-soft"
        >
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={askDelete}
        title="Delete service?"
        message={`Delete “${title}”? This removes it from the website.`}
        confirmLabel="Yes, delete"
        cancelLabel="No"
        busy={busy}
        onCancel={() => setAskDelete(false)}
        onConfirm={remove}
      />
    </>
  );
}
