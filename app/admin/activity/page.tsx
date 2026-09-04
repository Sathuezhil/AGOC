import { listActivity } from "@/lib/activity";
import ActivityLog from "./ActivityLog";

export default async function AdminActivityPage() {
  const items = await listActivity({ limit: 300 });

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Audit
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Activity log</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Recent admin actions — enquiries, offers, careers, services, media, and
        sign-in. Newest first.
      </p>
      <ActivityLog initialItems={items} />
    </div>
  );
}
