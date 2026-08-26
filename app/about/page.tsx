import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MissionVision from "@/components/MissionVision";
import CoverImage from "@/components/CoverImage";
import Card3D from "@/components/Card3D";
import { getContent, teamKind } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AGOC Security is a Dubai-based protection firm providing certified guards, surveillance, and tailored security across the UAE.",
};

export default async function AboutPage() {
  const { about } = await getContent();
  const founder = about.team.find((member) => teamKind(member) === "founder");
  const coordinator = about.team.find((member) => teamKind(member) === "coordinator");
  const members = about.team.filter((member) => teamKind(member) === "member");
  const teamMembers = [coordinator, ...members].filter(Boolean) as typeof about.team;

  return (
    <>
      <PageHero eyebrow={about.eyebrow} title={about.title} text={about.text} />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <Reveal>
          <div className="service-image-float media-frame group relative overflow-hidden rounded-xl">
            <CoverImage
              src={about.officeImage}
              alt="AGOC office"
              sizes="(max-width: 1024px) 100vw, 50vw"
              bounce={false}
              objectPosition="center"
            />
            <div className="service-image-shine pointer-events-none absolute inset-0" />
            <div className="service-image-outline pointer-events-none absolute inset-0" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            {about.whoLabel}
          </p>
          <h2 className="mt-3 font-display text-4xl text-sand">{about.whoTitle}</h2>
          <p className="mt-5 leading-relaxed text-mist">{about.whoText1}</p>
          <p className="mt-4 leading-relaxed text-mist">{about.whoText2}</p>
        </Reveal>
      </section>

      <MissionVision
        missionTitle={about.missionTitle}
        missionText={about.missionText}
        visionTitle={about.visionTitle}
        visionText={about.visionText}
        image={about.missionImage}
      />

      {about.team.length > 0 && (
        <section className="bg-ink py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
                {about.teamLabel}
              </p>
              <h2 className="mt-4 font-display text-4xl text-sand md:text-5xl">
                {about.teamTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-mist">{about.teamText}</p>
            </Reveal>

            {founder && (
              <Reveal delay={80}>
                <div className="mt-12">
                  <h3 className="mb-6 text-center font-display text-3xl text-sand">
                    Founder’s Message
                  </h3>
                  <div className="mx-auto max-w-3xl">
                    <Card3D intensity={6}>
                      <article className="border border-sand/10 bg-night px-8 py-12 text-center md:px-14 md:py-14">
                        <h3 className="font-display text-4xl text-sand md:text-5xl">
                          {founder.name}
                        </h3>
                        <p className="mt-3 text-xs font-semibold tracking-[0.22em] text-mist uppercase">
                          {founder.role}
                        </p>
                        {founder.education ? (
                          <p className="mt-2 text-sm text-olive">
                            {founder.education}
                          </p>
                        ) : null}
                        {founder.bio ? (
                          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-mist md:text-base">
                            “{founder.bio}”
                          </p>
                        ) : null}
                        {founder.closing ? (
                          <p className="mx-auto mt-8 max-w-xl text-sm font-semibold leading-relaxed text-sand md:text-base">
                            {founder.closing}
                          </p>
                        ) : null}
                      </article>
                    </Card3D>
                  </div>
                </div>
              </Reveal>
            )}

            {teamMembers.length > 0 && (
              <div className="mt-16">
                <Reveal>
                  <h3 className="font-display text-3xl text-sand md:text-4xl">
                    {about.membersTitle || "Team Members"}
                  </h3>
                </Reveal>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {teamMembers.map((member, i) => (
                    <Reveal key={`${member.name}-${i}`} delay={i * 90}>
                      <Card3D>
                        <article className="group flex h-full flex-col border border-sand/10 bg-night p-6 transition-colors duration-500 hover:border-olive/40 md:p-7">
                          <p className="text-[0.65rem] tracking-[0.2em] text-crimson uppercase">
                            {teamKind(member) === "coordinator"
                              ? "Coordinator"
                              : "Team member"}
                          </p>
                          <h3 className="mt-3 font-display text-2xl text-sand">
                            {member.name}
                          </h3>
                          <p className="mt-1 text-xs tracking-[0.18em] text-olive uppercase">
                            {member.role}
                          </p>
                          <p className="mt-4 flex-1 text-sm leading-relaxed text-mist">
                            {member.bio}
                          </p>
                        </article>
                      </Card3D>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-night py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-4xl text-sand">{about.valuesTitle}</h2>
            <p className="mt-3 max-w-2xl text-mist">{about.valuesText}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {about.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <Card3D intensity={9}>
                  <article className="h-full border border-sand/10 p-8 transition-colors duration-500 hover:border-olive/35">
                    <p className="font-display text-xl text-olive">0{i + 1}</p>
                    <h3 className="mt-4 font-display text-3xl text-sand">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist">
                      {value.text}
                    </p>
                  </article>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="stay-section mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            Retention
          </p>
          <h2 className="mt-4 font-display text-4xl text-sand md:text-5xl">
            {about.stayTitle}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {about.stayItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="stay-card group h-full rounded-xl border border-sand/10 bg-night/40 p-6 transition duration-300 md:p-7">
                <div className="mb-4 h-0.5 w-10 bg-gold transition-all duration-300 group-hover:w-16" />
                <h3 className="text-lg font-semibold tracking-wide text-sand">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
