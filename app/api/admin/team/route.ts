import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import {
  getContent,
  saveContent,
  teamKind,
  type TeamMember,
} from "@/lib/content";
import { revalidateSite } from "@/lib/revalidate";

function normalizeTeam(team: TeamMember[]): TeamMember[] {
  let founderSeen = false;
  let coordinatorSeen = false;
  return team.map((member) => {
    let kind = teamKind(member);
    if (kind === "founder") {
      if (founderSeen) kind = "member";
      else founderSeen = true;
    }
    if (kind === "coordinator") {
      if (coordinatorSeen) kind = "member";
      else coordinatorSeen = true;
    }
    return {
      name: member.name?.trim() ?? "",
      role: member.role?.trim() ?? "",
      bio: member.bio?.trim() ?? "",
      education: member.education?.trim() ?? "",
      closing: member.closing?.trim() ?? "",
      image: "",
      kind,
      founder: kind === "founder",
    };
  });
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const content = await getContent();
  return NextResponse.json({
    ok: true,
    team: content.about.team,
    membersTitle: content.about.membersTitle,
    teamLabel: content.about.teamLabel,
    teamTitle: content.about.teamTitle,
    teamText: content.about.teamText,
  });
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;
  try {
    const body = (await request.json()) as {
      team?: TeamMember[];
      membersTitle?: string;
      teamLabel?: string;
      teamTitle?: string;
      teamText?: string;
    };

    if (!Array.isArray(body.team)) {
      return NextResponse.json(
        { ok: false, error: "Team list is required." },
        { status: 400 },
      );
    }

    for (const member of body.team) {
      if (!member.name?.trim() || !member.role?.trim()) {
        return NextResponse.json(
          { ok: false, error: "Every member needs a name and role." },
          { status: 400 },
        );
      }
    }

    const content = await getContent();
    const next = {
      ...content,
      about: {
        ...content.about,
        team: normalizeTeam(body.team),
        membersTitle:
          body.membersTitle?.trim() || content.about.membersTitle,
        teamLabel: body.teamLabel?.trim() || content.about.teamLabel,
        teamTitle: body.teamTitle?.trim() || content.about.teamTitle,
        teamText: body.teamText?.trim() || content.about.teamText,
      },
    };

    await saveContent(next);
    revalidateSite();
    return NextResponse.json({
      ok: true,
      team: next.about.team,
      membersTitle: next.about.membersTitle,
      teamLabel: next.about.teamLabel,
      teamTitle: next.about.teamTitle,
      teamText: next.about.teamText,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not save team." },
      { status: 500 },
    );
  }
}
