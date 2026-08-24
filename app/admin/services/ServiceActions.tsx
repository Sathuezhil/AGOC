"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServiceActions({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`Delete “${title}”? This removes it from the website.`)) return;
    setBusy(true);
    await fetch(`/api/admin/services/${slug}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
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
        className="text-xs tracking-wide text-olive uppercase hover:text-white"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={busy}
        onClick={remove}
        className="text-xs tracking-wide text-crimson uppercase hover:text-crimson-soft"
      >
        Delete
      </button>
    </div>
  );
}
