import { getAdminSession } from "@/lib/admin-guard";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Control room
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Settings</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Manage admin login credentials and this control-room session.
      </p>
      <SettingsForm email={session.email} />
    </div>
  );
}
