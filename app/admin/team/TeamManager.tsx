"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Users } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { TeamKind, TeamMember } from "@/lib/content";

type TeamRow = TeamMember & { _key: string };

function memberKind(member: TeamMember): TeamKind {
  if (member.kind) return member.kind;
  return member.founder ? "founder" : "member";
}

const field =
  "w-full border border-sand/10 bg-ink px-3 py-2 text-sm text-sand outline-none focus:border-olive";

function emptyPerson(key: string, kind: TeamKind): TeamRow {
  return {
    _key: key,
    name: "",
    role: "",
    bio: "",
    education: kind === "founder" || kind === "coordinator" ? "" : undefined,
    closing: kind === "founder" || kind === "coordinator" ? "" : undefined,
    image: "",
    kind,
    founder: kind === "founder",
  };
}

function PersonForm({
  member,
  title,
  messageLabel,
  onUpdate,
  onRemove,
}: {
  member: TeamRow;
  title: string;
  messageLabel: string;
  onUpdate: (key: string, patch: Partial<TeamMember>) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <article className="admin-card border border-sand/10 bg-night/80 p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium tracking-wide text-sand">
          {title}
          {member.name ? ` · ${member.name}` : ""}
        </p>
        <button
          type="button"
          onClick={() => onRemove(member._key)}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs tracking-wide text-crimson uppercase hover:text-crimson-soft"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Name
          </span>
          <input
            required
            className={field}
            value={member.name}
            onChange={(e) => onUpdate(member._key, { name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Position / role
          </span>
          <input
            required
            className={field}
            value={member.role}
            onChange={(e) => onUpdate(member._key, { role: e.target.value })}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Education
          </span>
          <input
            className={field}
            placeholder="e.g. BSc in Human Resources Management"
            value={member.education ?? ""}
            onChange={(e) =>
              onUpdate(member._key, { education: e.target.value })
            }
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            {messageLabel}
          </span>
          <textarea
            rows={4}
            className={field}
            value={member.bio}
            onChange={(e) => onUpdate(member._key, { bio: e.target.value })}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
            Closing line
          </span>
          <input
            className={field}
            placeholder="Leading with Integrity..."
            value={member.closing ?? ""}
            onChange={(e) =>
              onUpdate(member._key, { closing: e.target.value })
            }
          />
        </label>
      </div>
    </article>
  );
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
  const [pendingRemoveKey, setPendingRemoveKey] = useState<string | null>(null);

  const founder = team.find((m) => memberKind(m) === "founder");
  const coordinator = team.find((m) => memberKind(m) === "coordinator");
  const members = team.filter((m) => memberKind(m) === "member");

  function updateByKey(key: string, patch: Partial<TeamMember>) {
    setTeam((prev) =>
      prev.map((item) => (item._key === key ? { ...item, ...patch } : item)),
    );
  }

  function addPerson(kind: TeamKind) {
    setTeam((prev) => {
      if (kind === "founder" && prev.some((m) => memberKind(m) === "founder")) {
        return prev;
      }
      if (
        kind === "coordinator" &&
        prev.some((m) => memberKind(m) === "coordinator")
      ) {
        return prev;
      }
      const row = emptyPerson(nextKey(), kind);
      if (kind === "founder") return [row, ...prev];
      if (kind === "coordinator") {
        const founderIdx = prev.findIndex((m) => memberKind(m) === "founder");
        if (founderIdx >= 0) {
          const copy = [...prev];
          copy.splice(founderIdx + 1, 0, row);
          return copy;
        }
        return [row, ...prev];
      }
      return [...prev, row];
    });
  }

  function removeByKey(key: string) {
    setTeam((prev) => prev.filter((item) => item._key !== key));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const payload = team.map(({ _key: _unused, ...member }) => {
        void _unused;
        const kind = memberKind(member);
        return {
          ...member,
          kind,
          founder: kind === "founder",
        };
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

  const pending = team.find((m) => m._key === pendingRemoveKey);

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-10">
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

      {/* Founder */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-olive uppercase">
              Separate section
            </p>
            <h3 className="mt-1 font-display text-2xl text-sand">Founder</h3>
          </div>
          {!founder && (
            <button
              type="button"
              onClick={() => addPerson("founder")}
              className="btn-shine inline-flex items-center gap-2 bg-crimson px-5 py-2.5 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark"
            >
              <Plus size={16} />
              Add founder
            </button>
          )}
        </div>
        {founder ? (
          <PersonForm
            member={founder}
            title="Founder"
            messageLabel="Founder message (first person)"
            onUpdate={updateByKey}
            onRemove={setPendingRemoveKey}
          />
        ) : (
          <div className="admin-card border border-dashed border-sand/20 bg-night/40 p-8 text-center text-sm text-mist">
            No founder yet. Click Add founder.
          </div>
        )}
      </section>

      {/* Coordinator — same style as founder */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-olive uppercase">
              Separate section
            </p>
            <h3 className="mt-1 font-display text-2xl text-sand">Coordinator</h3>
          </div>
          {!coordinator && (
            <button
              type="button"
              onClick={() => addPerson("coordinator")}
              className="btn-shine inline-flex items-center gap-2 bg-crimson px-5 py-2.5 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark"
            >
              <Plus size={16} />
              Add coordinator
            </button>
          )}
        </div>
        {coordinator ? (
          <PersonForm
            member={coordinator}
            title="Coordinator"
            messageLabel="Coordinator message"
            onUpdate={updateByKey}
            onRemove={setPendingRemoveKey}
          />
        ) : (
          <div className="admin-card border border-dashed border-sand/20 bg-night/40 p-8 text-center text-sm text-mist">
            No coordinator yet. Click Add coordinator.
          </div>
        )}
      </section>

      {/* Team members */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-sm text-mist">
              <Users size={16} className="text-olive" />
              {members.length} team member{members.length === 1 ? "" : "s"}
            </p>
            <h3 className="mt-1 font-display text-2xl text-sand">
              Team members
            </h3>
          </div>
          <button
            type="button"
            onClick={() => addPerson("member")}
            className="btn-shine inline-flex items-center gap-2 bg-crimson px-5 py-2.5 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark"
          >
            <Plus size={16} />
            Add team member
          </button>
        </div>

        {members.length === 0 && (
          <div className="admin-card border border-dashed border-sand/20 bg-night/40 p-8 text-center text-sm text-mist">
            No team members yet.
          </div>
        )}

        <div className="space-y-4">
          {members.map((member) => (
            <article
              key={member._key}
              className="admin-card border border-sand/10 bg-night/80 p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-sand">
                  Team member{member.name ? ` · ${member.name}` : ""}
                </p>
                <button
                  type="button"
                  onClick={() => setPendingRemoveKey(member._key)}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs tracking-wide text-crimson uppercase hover:text-crimson-soft"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                    Name
                  </span>
                  <input
                    required
                    className={field}
                    value={member.name}
                    onChange={(e) =>
                      updateByKey(member._key, { name: e.target.value })
                    }
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                    Position / role
                  </span>
                  <input
                    required
                    className={field}
                    value={member.role}
                    onChange={(e) =>
                      updateByKey(member._key, { role: e.target.value })
                    }
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
                    Brief message (first person)
                  </span>
                  <textarea
                    rows={3}
                    className={field}
                    placeholder="Short message suited to their role…"
                    value={member.bio}
                    onChange={(e) =>
                      updateByKey(member._key, { bio: e.target.value })
                    }
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

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
        open={Boolean(pendingRemoveKey)}
        title="Remove person?"
        message={
          pending
            ? `Remove “${pending.name || "this person"}”? Save team to apply on the website.`
            : "Remove this person?"
        }
        confirmLabel="Yes, remove"
        cancelLabel="No"
        onCancel={() => setPendingRemoveKey(null)}
        onConfirm={() => {
          if (!pendingRemoveKey) return;
          removeByKey(pendingRemoveKey);
          setPendingRemoveKey(null);
        }}
      />
    </form>
  );
}
