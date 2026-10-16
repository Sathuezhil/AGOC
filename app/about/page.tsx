import type { Metadata } from "next";
import Image from "next/image";
import {
  Award,
  Building2,
  Cctv,
  ClipboardList,
  Clock3,
  Eye,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Hotel,
  House,
  MapPin,
  Quote,
  Target,
  Warehouse,
} from "lucide-react";
import DirectorMessage from "@/components/DirectorMessage";
import Reveal from "@/components/Reveal";
import OpsCta from "@/components/home/OpsCta";
import OpsMediaCard from "@/components/ops/OpsMediaCard";
import OpsPageHero from "@/components/ops/OpsPageHero";
import OpsSectionHead from "@/components/ops/OpsSectionHead";
import { getContent, teamKind, type TeamMember } from "@/lib/content";
import { getHomeOps } from "@/lib/home-ops";
import { getDictionary, localizeContent } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { getPagesOps } from "@/lib/pages-ops";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About AGOC Security Dubai",
  description:
    "About AGOC Security, a licensed security company in Dubai: founder-led private guarding, CCTV monitoring and facility teams protecting homes, towers and sites across the UAE.",
  path: "/about",
  keywords: [
    "about AGOC Security",
    "security company Dubai",
    "licensed security guards UAE",
    "private guarding Dubai",
    "Al Muteena security company",
  ],
});

const siteIcons = [Building2, Building2, Hotel, Hospital, Warehouse, House];
const stayIcons = [Award, ClipboardList, Cctv, Clock3, GraduationCap, HeartHandshake];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function MessageCard({
  member,
  heading,
  quoteFrom,
  flip = false,
}: {
  member: TeamMember;
  heading: string;
  quoteFrom: string;
  flip?: boolean;
}) {
  return (
    <article className={`ops-quote ${flip ? "ops-quote-flip" : ""}`}>
      <div className="ops-quote-side">
        <span className="ops-avatar ops-avatar-lg">{initials(member.name)}</span>
        <p className="ops-mono mt-5 text-[0.65rem] tracking-[0.2em] text-white/55 uppercase rtl:tracking-normal">
          {quoteFrom}
        </p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{member.name}</h3>
        <p className="mt-1 text-sm font-medium text-[#E0C35A]">{member.role}</p>
        {member.education ? <p className="mt-2 text-[0.82rem] text-white/60">{member.education}</p> : null}
      </div>
      <div className="ops-quote-body">
        <p className="ops-eyebrow">{heading}</p>
        <Quote size={34} className="mt-5 text-[#0066FF]/25" />
        {member.bio ? (
          <p className="mt-3 text-[1.08rem] leading-relaxed text-[#2E3F50] md:text-[1.15rem]">{member.bio}</p>
        ) : null}
        {member.closing ? (
          <p className="ops-accent mt-6 text-lg font-bold leading-snug">{member.closing}</p>
        ) : null}
      </div>
    </article>
  );
}

export default async function AboutPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = getPagesOps(locale);
  const home = getHomeOps(locale);
  const { about } = localizeContent(await getContent(), locale);
  const founder = about.team.find((member) => teamKind(member) === "founder");
  const coordinator = about.team.find((member) => teamKind(member) === "coordinator");
  const members = about.team.filter((member) => teamKind(member) === "member");
  const hasPeople = Boolean(founder || coordinator || members.length);

  return (
    <>
      <OpsPageHero
        eyebrow={about.eyebrow}
        title={about.title}
        text={about.text}
        primary={{ href: "/contact", label: dict.hero.speakWithUs }}
        secondary={{ href: "/services", label: dict.servicesList.viewServices }}
        chips={p.about.chips}
        visual={
          <OpsMediaCard
            src={about.officeImage}
            alt="AGOC Security office in Al Muteena, Dubai"
            priority
            card={{
              icon: <MapPin size={18} />,
              title: p.about.officeCard.title,
              meta: p.about.officeCard.meta,
              tone: "live",
            }}
          />
        }
      />

      <section className="ops-light py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="ops-eyebrow">{about.whoLabel}</p>
            <h2 className="ops-h2 mt-4">{about.whoTitle}</h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-[#3E4F61]">{about.whoText1}</p>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-[#3E4F61]">{about.whoText2}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="ops-panel p-6 sm:p-7">
              <p className="ops-mono text-[0.65rem] tracking-[0.2em] text-[#8593A3] uppercase rtl:tracking-normal">
                {p.about.sitesLabel}
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                {p.about.sites.map((label, i) => {
                  const Icon = siteIcons[i] ?? Building2;
                  return (
                    <li key={label} className="ops-site-chip">
                      <span className="ops-icon-sq">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 text-[0.92rem] font-semibold text-[#0B1F2A]">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="ops-light pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-5">
          <OpsSectionHead label={p.about.missionLabel} title={`${about.missionTitle} &`} accent={about.visionTitle} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              { title: about.missionTitle, text: about.missionText, Icon: Target, skin: "ops-feature-blue" },
              { title: about.visionTitle, text: about.visionText, Icon: Eye, skin: "ops-feature-navy" },
            ].map(({ title, text, Icon, skin }, i) => (
              <Reveal key={title} delay={i * 120} className="h-full">
                <article className={`ops-feature ops-static h-full ${skin}`}>
                  <span className="ops-feature-check !h-12 !w-12 !rounded-2xl">
                    <Icon size={22} />
                  </span>
                  <h3 className="ops-feature-title mt-6">{title}</h3>
                  <p className="ops-feature-text mt-4">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ops-dark relative overflow-hidden py-20 md:py-28">
        <div className="relative mx-auto max-w-6xl px-5">
          <OpsSectionHead label={p.about.valuesLabel} title={about.valuesTitle} text={about.valuesText} dark />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {about.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 100} className="h-full">
                <article className="ops-trust-card h-full">
                  <span className="ops-mono text-5xl font-bold text-white/15">0{i + 1}</span>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">{value.title}</h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-white/75">{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {hasPeople ? (
        <section className="ops-light py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <OpsSectionHead label={about.teamLabel || p.about.leadershipEyebrow} title={about.teamTitle} text={about.teamText} />

            <div className="mt-12 space-y-6">
              {founder ? (
                <DirectorMessage
                  member={founder}
                  heading={dict.about.founderMessage}
                  quoteFrom={p.about.quoteFrom}
                  className="pb-10"
                />
              ) : null}
              {coordinator ? (
                <Reveal delay={80}>
                  <MessageCard
                    member={coordinator}
                    heading={dict.about.coordinatorMessage}
                    quoteFrom={p.about.quoteFrom}
                    flip
                  />
                </Reveal>
              ) : null}
            </div>

            {members.length > 0 ? (
              <div className="mt-16">
                <Reveal>
                  <h3 className="text-2xl font-bold tracking-tight text-[#0B1F2A] md:text-3xl">
                    {about.membersTitle || "Team Members"}
                  </h3>
                </Reveal>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member, i) => (
                    <Reveal key={`${member.name}-${i}`} delay={i * 90} className="h-full">
                      <article className="ops-tile h-full">
                        <div className="flex items-center gap-4">
                          {member.image ? (
                            <span className="ops-avatar relative overflow-hidden">
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                                unoptimized={member.image.startsWith("/api/media")}
                              />
                            </span>
                          ) : (
                            <span className="ops-avatar">{initials(member.name)}</span>
                          )}
                          <div className="min-w-0">
                            <h4 className="truncate text-lg font-bold text-[#0B1F2A]">{member.name}</h4>
                            <p className="truncate text-sm font-medium text-[#0066FF]">{member.role}</p>
                          </div>
                        </div>
                        {member.bio ? (
                          <p className="mt-5 text-[0.94rem] leading-relaxed text-[#3E4F61]">{member.bio}</p>
                        ) : null}
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className={`ops-light pb-4 ${hasPeople ? "" : "pt-20 md:pt-28"}`}>
        <div className="mx-auto max-w-6xl px-5">
          <OpsSectionHead label={p.about.stayLabel} title={about.stayTitle} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {about.stayItems.map((item, i) => {
              const Icon = stayIcons[i] ?? Award;
              return (
                <Reveal key={item.title} delay={i * 70} className="h-full">
                  <article className="ops-tile h-full">
                    <span className="ops-icon-sq">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1F2A]">{item.title}</h3>
                    <p className="mt-2 text-[0.94rem] leading-relaxed text-[#3E4F61]">{item.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <OpsCta copy={{ ...p.ctaBand, whatsapp: home.cta.whatsapp }} primaryHref="/contact" />
    </>
  );
}
