import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MissionVision from "@/components/MissionVision";
import CoverImage from "@/components/CoverImage";
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
          <div className="group relative h-[420px] overflow-hidden">
            <CoverImage
              src={about.officeImage}
              alt="AGOC office"
              sizes="(max-width: 1024px) 100vw, 50vw"
              float="up"
            />
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
                  <h3 className="font-display text-3xl text-sand">Founder</h3>
                  <article className="mt-6 grid items-center gap-8 border border-sand/10 bg-night lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="group relative aspect-[4/5] overflow-hidden md:aspect-[5/4] lg:aspect-auto lg:min-h-[420px]">
                      <CoverImage
                        src={founder.image}
                        alt={founder.name}
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        float="up"
                        objectPosition="top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    </div>
                    <div className="px-6 pb-10 pt-2 md:px-10 md:pb-12">
                      <h3 className="font-display text-4xl text-sand md:text-5xl">
                        {founder.name}
                      </h3>
                      <p className="mt-2 text-sm tracking-wide text-crimson">
                        {founder.role}
                      </p>
                      <p className="mt-5 max-w-xl text-base leading-relaxed text-mist">
                        {founder.bio}
                      </p>
                    </div>
                  </article>
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
                      <article className="group h-full overflow-hidden border border-sand/10 bg-night transition duration-500 hover:-translate-y-1 hover:border-olive/40">
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <CoverImage
                            src={member.image}
                            alt={member.name}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            float={i % 2 === 0 ? "up" : "down"}
                            delay={i * 120}
                            objectPosition="top"
                          />
                          <div className="absolute inset-0 bg-ink/20 transition-opacity duration-500 group-hover:bg-ink/5" />
                        </div>
                        <div className="p-6">
                          <p className="text-[0.65rem] tracking-[0.2em] text-crimson uppercase">
                            {teamKind(member) === "coordinator"
                              ? "Coordinator"
                              : "Team member"}
                          </p>
                          <h3 className="mt-2 font-display text-2xl text-sand">
                            {member.name}
                          </h3>
                          <p className="mt-1 text-xs tracking-[0.18em] text-olive uppercase">
                            {member.role}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-mist">
                            {member.bio}
                          </p>
                        </div>
                      </article>
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
                <article className="border border-sand/10 p-8">
                  <p className="font-display text-xl text-olive">0{i + 1}</p>
                  <h3 className="mt-4 font-display text-3xl text-sand">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">
                    {value.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="font-display text-4xl text-sand">{about.stayTitle}</h2>
        </Reveal>
        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {about.stayItems.map((item) => (
            <div key={item.title} className="border-t border-sand/10 pt-5">
              <h3 className="text-lg text-sand">{item.title}</h3>
              <p className="mt-2 text-sm text-mist">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
