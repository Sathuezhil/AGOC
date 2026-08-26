import { getContent } from "@/lib/content";
import TeamManager from "./TeamManager";

export default async function AdminTeamPage() {
  const content = await getContent();
  const { about } = content;

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        About page
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Team members</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Add, edit, reorder, or remove the founder and team shown on the public
        About page.
      </p>
      <TeamManager
        initialTeam={about.team}
        initialMembersTitle={about.membersTitle}
        initialTeamLabel={about.teamLabel}
        initialTeamTitle={about.teamTitle}
        initialTeamText={about.teamText}
      />
    </div>
  );
}
