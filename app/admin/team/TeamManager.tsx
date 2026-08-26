"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2, Users } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { TeamKind, TeamMember } from "@/lib/content";

type TeamRow = TeamMember & { _key: string };

function memberKind(member: TeamMember): TeamKind {
  if (member.kind) return member.kind;
  return member.founder ? "founder" : "member";
}

const field =
  "w-full border border-sand/10 bg-ink px-3 py-2 text-sm text-sand outline-none focus:border-olive";

function emptyMember(key: string): TeamRow {
  return {
    _key: key,
    name: "",
    role: "",
    bio: "",
    image: "",
    kind: "member",
    founder: false,
  };
}

export default function TeamManager({
  initialTeam,
  initialMembersTitle,
  initialTeamLabel,
  initialTeamTitle,
  initialTeamText,
}: {
  initialTeam: TeamMember[];
  initialMembersTitle: string;
  initialTeamLabel: string;
  initialTeamTitle: string;
  initialTeamText: string;
}) {
  const router = useRouter();
  const keyRef = useRef(0);
  const nextKey = () => {
    keyRef.current += 1;
    return `team-${keyRef.current}`;
  };

  const [team, setTeam] = useState<TeamRow[]>(() =>
    initialTeam.map((member) => ({ ...member, _key: nextKey() })),
  );
  const [membersTitle, setMembersTitle] = useState(initialMembersTitle);
  const [teamLabel, setTeamLabel] = useState(initialTeamLabel);
  const [teamTitle, setTeamTitle] = useState(initialTeamTitle);
  const [teamText, setTeamText] = useState(initialTeamText);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [pendingRemove, setPendingRemove] = useState<number | null>(null);

  function updateMember(index: number, patch: Partial<TeamMember>) {
    setTeam((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function setKind(index: number, next: TeamKind) {
    setTeam((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return { ...item, kind: next, founder: next === "founder" };
        }
        if (next === "founder" && memberKind(item) === "founder") {
          return { ...item, kind: "member", founder: false };
        }
        if (next === "coordinator" && memberKind(item) === "coordinator") {
          return { ...item, kind: "member", founder: false };
        }
        return item;
      }),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= team.length) return;
    setTeam((prev) => {
      const copy = [...prev];
      const [row] = copy.splice(index, 1);
      copy.splice(target, 0, row);
      return copy;
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const payload = team.map(({ _key: _unused, ...member }) => {
        void _unused;
        return member;
      });
      const response = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team: payload,
          membersTitle,
          teamLabel,
          teamTitle,
          teamText,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not save team.");
      }
      setStatus("ok");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-8">
      <div className="admin-card grid gap-4 border border-sand/10 bg-night/80 p-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Section label
          </span>
          <input
            className={field}
            value={teamLabel}
            onChange={(e) => setTeamLabel(e.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Section title
          </span>
          <input
            className={field}
            value={teamTitle}
            onChange={(e) => setTeamTitle(e.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Section text
          </span>
          <textarea
            rows={3}
            className={field}
            value={teamText}
            onChange={(e) => setTeamText(e.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Team members heading
          </span>
          <input
            className={field}
            value={membersTitle}
            onChange={(e) => setMembersTitle(e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm text-mist">
          <Users size={16} className="text-olive" />
          {team.length} people on the About page
        </p>
        <button
          type="button"
          onClick={() => setTeam((prev) => [...prev, emptyMember(nextKey())])}
          className="btn-shine inline-flex items-center gap-2 bg-crimson px-5 py-2.5 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark"
        >
          <Plus size={16} />
          Add team member
        </button>
      </div>

      {team.length === 0 && (
        <div className="admin-card border border-dashed border-sand/20 bg-night/50 p-10 text-center">
          <p className="text-sm text-mist">No team members yet.</p>
          <button
            type="button"
            onClick={() => setTeam([emptyMember(nextKey())])}
            className="btn-shine mt-4 inline-flex items-center gap-2 bg-crimson px-5 py-2.5 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark"
          >
            <Plus size={16} />
            Add first member
          </button>
        </div>
      )}

      <div className="space-y-4">
        {team.map((member, i) => (
          <article
            key={member._key}
            className="admin-card border border-sand/10 bg-night/80 p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-sand">
                {memberKind(member) === "founder"
                  ? "Founder"
                  : memberKind(member) === "coordinator"
                    ? "Coordinator"
                    : "Team member"}
                {member.name ? ` · ${member.name}` : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="inline-flex h-8 w-8 items-center justify-center border border-sand/15 text-mist transition hover:text-sand disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() => move(i, 1)}
                  disabled={i === team.length - 1}
                  className="inline-flex h-8 w-8 items-center justify-center border border-sand/15 text-mist transition hover:text-sand disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingRemove(i)}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs tracking-wide text-crimson uppercase hover:text-crimson-soft"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-1">
                  <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                    Name
                  </span>
                  <input
                    required
                    className={field}
                    value={member.name}
                    onChange={(e) => updateMember(i, { name: e.target.value })}
                  />
                </label>
                <label className="block sm:col-span-1">
                  <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                    Position / role
                  </span>
                  <input
                    required
                    className={field}
                    value={member.role}
                    onChange={(e) => updateMember(i, { role: e.target.value })}
                  />
                </label>
                {memberKind(member) === "founder" && (
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                      Education
                    </span>
                    <input
                      className={field}
                      placeholder="e.g. BSc in Human Resources Management"
                      value={member.education ?? ""}
                      onChange={(e) =>
                        updateMember(i, { education: e.target.value })
                      }
                    />
                  </label>
                )}
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                    {memberKind(member) === "founder"
                      ? "Founder message (first person)"
                      : "Short description"}
                  </span>
                  <textarea
                    rows={4}
                    className={field}
                    value={member.bio}
                    onChange={(e) => updateMember(i, { bio: e.target.value })}
                  />
                </label>
                {memberKind(member) === "founder" && (
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                      Closing line
                    </span>
                    <input
                      className={field}
                      placeholder="Leading with Integrity..."
                      value={member.closing ?? ""}
                      onChange={(e) =>
                        updateMember(i, { closing: e.target.value })
                      }
                    />
                  </label>
                )}
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                    Role on About page
                  </span>
                  <select
                    className={field}
                    value={memberKind(member)}
                    onChange={(e) => setKind(i, e.target.value as TeamKind)}
                  >
                    <option value="founder">Founder (separate section)</option>
                    <option value="coordinator">
                      Coordinator (under Team Members)
                    </option>
                    <option value="member">Team member</option>
                  </select>
                </label>
              </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-sand/10 pt-6">
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-shine bg-crimson px-6 py-3 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-70"
        >
          {status === "saving" ? "Saving…" : "Save team"}
        </button>
        {status === "ok" && (
          <p className="text-sm text-olive">Saved. About page updated.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-crimson-soft">{error}</p>
        )}
      </div>

      <ConfirmDialog
        open={pendingRemove !== null}
        title="Remove team member?"
        message={
          pendingRemove !== null && team[pendingRemove]
            ? `Remove “${team[pendingRemove].name || "this member"}” from the team list? Save team to apply on the website.`
            : "Remove this team member?"
        }
        confirmLabel="Yes, remove"
        cancelLabel="No"
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (pendingRemove === null) return;
          setTeam((prev) => prev.filter((_, index) => index !== pendingRemove));
          setPendingRemove(null);
        }}
      />
    </form>
  );
}
