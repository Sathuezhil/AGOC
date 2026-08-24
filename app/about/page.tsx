import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MissionVision from "@/components/MissionVision";
import CoverImage from "@/components/CoverImage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AGOC Security is a Dubai-based protection firm providing certified guards, surveillance, and tailored security across the UAE.",
};

const values = [
  {
    title: "Discipline",
    text: "Posts run on time, in uniform, with notes that a manager can actually use.",
  },
  {
    title: "Discretion",
    text: "Private clients and premium venues need presence without spectacle.",
  },
  {
    title: "Judgement",
    text: "We hire people who can de-escalate first and act firmly when they must.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AGOC"
        title="Protection with a human face."
        text="We look after people, property, and assets with trained officers, modern systems, and plans written for the site — not copied from a brochure."
      />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <Reveal>
          <div className="group relative h-[420px] overflow-hidden">
            <CoverImage
              src="/images/office.jpg"
              alt="Modern Dubai workplace interior"
              sizes="(max-width: 1024px) 100vw, 50vw"
              float="up"
            />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            Who we are
          </p>
          <h2 className="mt-3 font-display text-4xl text-white">
            AGOC General Security Guard Services LLC
          </h2>
          <p className="mt-5 leading-relaxed text-mist">
            Based in Al Muteena, Dubai, AGOC provides licensed security
            officers and supporting services across the UAE. Our work is
            straightforward: understand the risk, staff the post properly, and
            stay reachable.
          </p>
          <p className="mt-4 leading-relaxed text-mist">
            From residential compounds to hotels, hospitals, warehouses, and
            private households, the same standard applies — verified people,
            clear reporting, and technology that supports the officer rather
            than replacing them.
          </p>
        </Reveal>
      </section>

      <MissionVision />

      <section className="bg-night py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-4xl text-white">How we work</h2>
            <p className="mt-3 max-w-2xl text-mist">
              Years on the ground across industries, with plans that match the
              building, the hours, and the people who live or work there.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <article className="border border-white/10 p-8">
                  <p className="font-display text-xl text-olive">0{i + 1}</p>
                  <h3 className="mt-4 font-display text-3xl text-white">
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
          <h2 className="font-display text-4xl text-white">Why clients stay</h2>
        </Reveal>
        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {[
            ["Expertise", "Reliable coverage across commercial, residential, and event environments."],
            ["Tailored plans", "Every site gets its own roster, SOP, and escalation path."],
            ["Modern tools", "CCTV, access control, and monitoring used with purpose."],
            ["24/7 protection", "Round-the-clock posts and a live operations line."],
            ["Trained officers", "People prepared for the post they are actually standing."],
            ["Peace of mind", "You run the business. We keep the perimeter quiet."],
          ].map(([title, text]) => (
            <div key={title} className="border-t border-white/10 pt-5">
              <h3 className="text-lg text-white">{title}</h3>
              <p className="mt-2 text-sm text-mist">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
