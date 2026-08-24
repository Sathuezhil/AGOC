"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent, TeamKind, TeamMember } from "@/lib/content";
import ImagePicker from "../ImagePicker";

function memberKind(member: TeamMember): TeamKind {
  if (member.kind) return member.kind;
  return member.founder ? "founder" : "member";
}

const field =
  "w-full border border-white/10 bg-ink px-3 py-2 text-sm text-sand outline-none focus:border-olive";

const tabs = [
  { id: "hero", label: "Hero" },
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "services", label: "Services page" },
  { id: "company", label: "Company" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs tracking-[0.16em] text-mist uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function ContentForm({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("hero");
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!data.ok) {
      setMessage(data.error || "Could not save.");
      return;
    }
    setMessage("Saved. Public site updated.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-3 py-1.5 text-xs tracking-wide uppercase ${
              tab === item.id
                ? "bg-crimson text-white"
                : "border border-white/15 text-mist hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <div className="max-w-3xl space-y-4">
          <Field label="Eyebrow">
            <input
              className={field}
              value={form.hero.eyebrow}
              onChange={(e) =>
                setForm({ ...form, hero: { ...form.hero, eyebrow: e.target.value } })
              }
            />
          </Field>
          <Field label="Title">
            <input
              className={field}
              value={form.hero.title}
              onChange={(e) =>
                setForm({ ...form, hero: { ...form.hero, title: e.target.value } })
              }
            />
          </Field>
          <Field label="Italic line">
            <input
              className={field}
              value={form.hero.titleItalic}
              onChange={(e) =>
                setForm({
                  ...form,
                  hero: { ...form.hero, titleItalic: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Intro text">
            <textarea
              rows={4}
              className={field}
              value={form.hero.text}
              onChange={(e) =>
                setForm({ ...form, hero: { ...form.hero, text: e.target.value } })
              }
            />
          </Field>
          {form.hero.slides.map((slide, i) => (
            <div key={i} className="border border-white/10 p-4">
              <p className="mb-3 text-xs text-mist uppercase">Slide {i + 1}</p>
              <ImagePicker
                label="Image"
                value={slide.src}
                onChange={(src) => {
                  const slides = [...form.hero.slides];
                  slides[i] = { ...slides[i], src };
                  setForm({ ...form, hero: { ...form.hero, slides } });
                }}
              />
              <Field label="Alt text">
                <input
                  className={`${field} mt-3`}
                  value={slide.alt}
                  onChange={(e) => {
                    const slides = [...form.hero.slides];
                    slides[i] = { ...slides[i], alt: e.target.value };
                    setForm({ ...form, hero: { ...form.hero, slides } });
                  }}
                />
              </Field>
            </div>
          ))}
        </div>
      )}

      {tab === "home" && (
        <div className="max-w-3xl space-y-4">
          <Field label="Intro label">
            <input
              className={field}
              value={form.home.introLabel}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, introLabel: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Intro title">
            <input
              className={field}
              value={form.home.introTitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, introTitle: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Intro text">
            <textarea
              rows={4}
              className={field}
              value={form.home.introText}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, introText: e.target.value },
                })
              }
            />
          </Field>
          <ImagePicker
            label="Intro image"
            value={form.home.introImage}
            onChange={(src) =>
              setForm({ ...form, home: { ...form.home, introImage: src } })
            }
          />
          <Field label="Intro caption">
            <input
              className={field}
              value={form.home.introCaption}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, introCaption: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Services section label">
            <input
              className={field}
              value={form.home.servicesLabel}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, servicesLabel: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Services section title">
            <input
              className={field}
              value={form.home.servicesTitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, servicesTitle: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Why label">
            <input
              className={field}
              value={form.home.whyLabel}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, whyLabel: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Why title">
            <input
              className={field}
              value={form.home.whyTitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, whyTitle: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Why text">
            <textarea
              rows={4}
              className={field}
              value={form.home.whyText}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, whyText: e.target.value },
                })
              }
            />
          </Field>
          <ImagePicker
            label="Why image"
            value={form.home.whyImage}
            onChange={(src) =>
              setForm({ ...form, home: { ...form.home, whyImage: src } })
            }
          />
          <Field label="Contact label">
            <input
              className={field}
              value={form.home.contactLabel}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, contactLabel: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Contact title">
            <input
              className={field}
              value={form.home.contactTitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, contactTitle: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Contact text">
            <textarea
              rows={3}
              className={field}
              value={form.home.contactText}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, contactText: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Contact note">
            <input
              className={field}
              value={form.home.contactNote}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: { ...form.home, contactNote: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Reasons (one per line)">
            <textarea
              rows={4}
              className={field}
              value={form.home.reasons.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  home: {
                    ...form.home,
                    reasons: e.target.value.split("\n").filter(Boolean),
                  },
                })
              }
            />
          </Field>
          {form.home.pillars.map((item, i) => (
            <div key={i} className="grid gap-2 border border-white/10 p-3 md:grid-cols-2">
              <input
                className={field}
                placeholder="Pillar title"
                value={item.title}
                onChange={(e) => {
                  const pillars = [...form.home.pillars];
                  pillars[i] = { ...pillars[i], title: e.target.value };
                  setForm({ ...form, home: { ...form.home, pillars } });
                }}
              />
              <input
                className={field}
                placeholder="Pillar text"
                value={item.text}
                onChange={(e) => {
                  const pillars = [...form.home.pillars];
                  pillars[i] = { ...pillars[i], text: e.target.value };
                  setForm({ ...form, home: { ...form.home, pillars } });
                }}
              />
            </div>
          ))}
          {form.home.features.map((item, i) => (
            <div key={i} className="grid gap-2 border border-white/10 p-3 md:grid-cols-2">
              <input
                className={field}
                placeholder="Feature title"
                value={item.title}
                onChange={(e) => {
                  const features = [...form.home.features];
                  features[i] = { ...features[i], title: e.target.value };
                  setForm({ ...form, home: { ...form.home, features } });
                }}
              />
              <input
                className={field}
                placeholder="Feature text"
                value={item.text}
                onChange={(e) => {
                  const features = [...form.home.features];
                  features[i] = { ...features[i], text: e.target.value };
                  setForm({ ...form, home: { ...form.home, features } });
                }}
              />
            </div>
          ))}
          {form.home.stats.map((item, i) => (
            <div key={i} className="grid gap-2 border border-white/10 p-3 md:grid-cols-2">
              <input
                className={field}
                placeholder="Stat value"
                value={item.value}
                onChange={(e) => {
                  const stats = [...form.home.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  setForm({ ...form, home: { ...form.home, stats } });
                }}
              />
              <input
                className={field}
                placeholder="Stat label"
                value={item.label}
                onChange={(e) => {
                  const stats = [...form.home.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  setForm({ ...form, home: { ...form.home, stats } });
                }}
              />
            </div>
          ))}
          {form.home.whyItems.map((item, i) => (
            <div key={i} className="grid gap-2 border border-white/10 p-3 md:grid-cols-2">
              <input
                className={field}
                value={item.title}
                onChange={(e) => {
                  const whyItems = [...form.home.whyItems];
                  whyItems[i] = { ...whyItems[i], title: e.target.value };
                  setForm({ ...form, home: { ...form.home, whyItems } });
                }}
              />
              <input
                className={field}
                value={item.text}
                onChange={(e) => {
                  const whyItems = [...form.home.whyItems];
                  whyItems[i] = { ...whyItems[i], text: e.target.value };
                  setForm({ ...form, home: { ...form.home, whyItems } });
                }}
              />
            </div>
          ))}
        </div>
      )}

      {tab === "about" && (
        <div className="max-w-3xl space-y-4">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "Title"],
              ["text", "Hero text"],
              ["whoLabel", "Who label"],
              ["whoTitle", "Who title"],
              ["whoText1", "Who text 1"],
              ["whoText2", "Who text 2"],
              ["missionTitle", "Mission title"],
              ["missionText", "Mission text"],
              ["visionTitle", "Vision title"],
              ["visionText", "Vision text"],
              ["valuesTitle", "Values title"],
              ["valuesText", "Values text"],
              ["stayTitle", "Stay title"],
              ["teamLabel", "Team label"],
              ["teamTitle", "Team title"],
              ["teamText", "Team text"],
              ["membersTitle", "Team members heading"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              {key.includes("Text") || key === "text" || key === "teamText" ? (
                <textarea
                  rows={3}
                  className={field}
                  value={form.about[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      about: { ...form.about, [key]: e.target.value },
                    })
                  }
                />
              ) : (
                <input
                  className={field}
                  value={form.about[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      about: { ...form.about, [key]: e.target.value },
                    })
                  }
                />
              )}
            </Field>
          ))}
          <ImagePicker
            label="Office image"
            value={form.about.officeImage}
            onChange={(src) =>
              setForm({ ...form, about: { ...form.about, officeImage: src } })
            }
          />
          <ImagePicker
            label="Mission / vision background"
            value={form.about.missionImage}
            onChange={(src) =>
              setForm({ ...form, about: { ...form.about, missionImage: src } })
            }
          />
          {form.about.values.map((item, i) => (
            <div key={i} className="grid gap-2 border border-white/10 p-3 md:grid-cols-2">
              <input
                className={field}
                value={item.title}
                onChange={(e) => {
                  const values = [...form.about.values];
                  values[i] = { ...values[i], title: e.target.value };
                  setForm({ ...form, about: { ...form.about, values } });
                }}
              />
              <input
                className={field}
                value={item.text}
                onChange={(e) => {
                  const values = [...form.about.values];
                  values[i] = { ...values[i], text: e.target.value };
                  setForm({ ...form, about: { ...form.about, values } });
                }}
              />
            </div>
          ))}
          {form.about.stayItems.map((item, i) => (
            <div key={i} className="grid gap-2 border border-white/10 p-3 md:grid-cols-2">
              <input
                className={field}
                value={item.title}
                onChange={(e) => {
                  const stayItems = [...form.about.stayItems];
                  stayItems[i] = { ...stayItems[i], title: e.target.value };
                  setForm({ ...form, about: { ...form.about, stayItems } });
                }}
              />
              <input
                className={field}
                value={item.text}
                onChange={(e) => {
                  const stayItems = [...form.about.stayItems];
                  stayItems[i] = { ...stayItems[i], text: e.target.value };
                  setForm({ ...form, about: { ...form.about, stayItems } });
                }}
              />
            </div>
          ))}
          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-xs tracking-[0.16em] text-mist uppercase">
              Founder & team
            </p>
            <div className="space-y-4">
              {(form.about.team ?? []).map((member, i) => (
                <div key={i} className="space-y-3 border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-sand">
                      {memberKind(member) === "founder"
                        ? "Founder"
                        : memberKind(member) === "coordinator"
                          ? "Coordinator"
                          : "Team member"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const team = form.about.team.filter((_, index) => index !== i);
                        setForm({ ...form, about: { ...form.about, team } });
                      }}
                      className="text-xs tracking-wide text-crimson uppercase"
                    >
                      Remove
                    </button>
                  </div>
                  <ImagePicker
                    label="Photo"
                    value={member.image}
                    onChange={(src) => {
                      const team = [...form.about.team];
                      team[i] = { ...team[i], image: src };
                      setForm({ ...form, about: { ...form.about, team } });
                    }}
                  />
                  <input
                    className={field}
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => {
                      const team = [...form.about.team];
                      team[i] = { ...team[i], name: e.target.value };
                      setForm({ ...form, about: { ...form.about, team } });
                    }}
                  />
                  <input
                    className={field}
                    placeholder="Position / role"
                    value={member.role}
                    onChange={(e) => {
                      const team = [...form.about.team];
                      team[i] = { ...team[i], role: e.target.value };
                      setForm({ ...form, about: { ...form.about, team } });
                    }}
                  />
                  <textarea
                    rows={3}
                    className={field}
                    placeholder="Short description"
                    value={member.bio}
                    onChange={(e) => {
                      const team = [...form.about.team];
                      team[i] = { ...team[i], bio: e.target.value };
                      setForm({ ...form, about: { ...form.about, team } });
                    }}
                  />
                  <label className="block text-xs tracking-wide text-mist uppercase">
                    Role on page
                    <select
                      className={`${field} mt-2`}
                      value={memberKind(member)}
                      onChange={(e) => {
                        const next = e.target.value as TeamKind;
                        const team = form.about.team.map((item, index) => {
                          if (index === i) {
                            return {
                              ...item,
                              kind: next,
                              founder: next === "founder",
                            };
                          }
                          if (next === "founder" && memberKind(item) === "founder") {
                            return { ...item, kind: "member" as const, founder: false };
                          }
                          if (
                            next === "coordinator" &&
                            memberKind(item) === "coordinator"
                          ) {
                            return { ...item, kind: "member" as const, founder: false };
                          }
                          return item;
                        });
                        setForm({ ...form, about: { ...form.about, team } });
                      }}
                    >
                      <option value="founder">Founder (separate section)</option>
                      <option value="coordinator">Coordinator (under Team Members)</option>
                      <option value="member">Team member</option>
                    </select>
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    about: {
                      ...form.about,
                      team: [
                        ...(form.about.team ?? []),
                        {
                          name: "",
                          role: "",
                          bio: "",
                          image: "/images/office.jpg",
                          kind: "member",
                          founder: false,
                        },
                      ],
                    },
                  })
                }
                className="text-xs tracking-wide text-olive uppercase"
              >
                Add team member
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "contact" && (
        <div className="max-w-3xl space-y-4">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "Title"],
              ["text", "Text"],
              ["formTitle", "Form title"],
              ["formText", "Form text"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              {key === "text" || key === "formText" ? (
                <textarea
                  rows={3}
                  className={field}
                  value={form.contactPage[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactPage: {
                        ...form.contactPage,
                        [key]: e.target.value,
                      },
                    })
                  }
                />
              ) : (
                <input
                  className={field}
                  value={form.contactPage[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactPage: {
                        ...form.contactPage,
                        [key]: e.target.value,
                      },
                    })
                  }
                />
              )}
            </Field>
          ))}
        </div>
      )}

      {tab === "services" && (
        <div className="max-w-3xl space-y-4">
          <Field label="Eyebrow">
            <input
              className={field}
              value={form.servicesPage.eyebrow}
              onChange={(e) =>
                setForm({
                  ...form,
                  servicesPage: {
                    ...form.servicesPage,
                    eyebrow: e.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="Title">
            <input
              className={field}
              value={form.servicesPage.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  servicesPage: {
                    ...form.servicesPage,
                    title: e.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="Text">
            <textarea
              rows={3}
              className={field}
              value={form.servicesPage.text}
              onChange={(e) =>
                setForm({
                  ...form,
                  servicesPage: {
                    ...form.servicesPage,
                    text: e.target.value,
                  },
                })
              }
            />
          </Field>
        </div>
      )}

      {tab === "company" && (
        <div className="max-w-3xl space-y-4">
          {(
            [
              ["name", "Company name"],
              ["legalName", "Legal name"],
              ["tagline", "Tagline"],
              ["description", "SEO description"],
              ["email", "Email"],
              ["whatsapp", "WhatsApp (digits)"],
              ["address", "Address"],
              ["footerBlurb", "Footer blurb"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              {key === "description" || key === "footerBlurb" || key === "address" ? (
                <textarea
                  rows={3}
                  className={field}
                  value={form.site[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      site: { ...form.site, [key]: e.target.value },
                    })
                  }
                />
              ) : (
                <input
                  className={field}
                  value={form.site[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      site: { ...form.site, [key]: e.target.value },
                    })
                  }
                />
              )}
            </Field>
          ))}
          <Field label="Phones (one per line)">
            <textarea
              rows={3}
              className={field}
              value={form.site.phones.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  site: {
                    ...form.site,
                    phones: e.target.value.split("\n").filter(Boolean),
                  },
                })
              }
            />
          </Field>
          {form.site.hours.map((row, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-2">
              <input
                className={field}
                value={row.days}
                onChange={(e) => {
                  const hours = [...form.site.hours];
                  hours[i] = { ...hours[i], days: e.target.value };
                  setForm({ ...form, site: { ...form.site, hours } });
                }}
              />
              <input
                className={field}
                value={row.time}
                onChange={(e) => {
                  const hours = [...form.site.hours];
                  hours[i] = { ...hours[i], time: e.target.value };
                  setForm({ ...form, site: { ...form.site, hours } });
                }}
              />
            </div>
          ))}
        </div>
      )}

      {message && <p className="text-sm text-olive">{message}</p>}
      <button
        type="submit"
        disabled={busy}
        className="btn-shine bg-crimson px-6 py-3 text-sm tracking-wide text-white uppercase hover:bg-crimson-dark disabled:opacity-70"
      >
        {busy ? "Saving…" : "Save texts"}
      </button>
    </form>
  );
}
