import Link from "next/link";
import {
  BadgeCheck,
  Clock3,
  Eye,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import CoverImage from "@/components/CoverImage";
import { services } from "@/lib/services";

const reasons = [
  "Fully certified, 100% verified officers",
  "Coverage for homes, offices, hotels, events, and warehouses",
  "Serious protection without inflated retainers",
  "Guards trained for commercial, medical, and residential posts",
];

const stats = [
  { value: "9", label: "Service lines", icon: ShieldCheck },
  { value: "24/7", label: "Operations cover", icon: Clock3 },
  { value: "UAE", label: "Licensed to operate", icon: MapPin },
  { value: "100%", label: "Verified staff", icon: BadgeCheck },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="border-y border-white/10 bg-night">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Licensed in Dubai",
              text: "Compliant teams, documented procedures, and officers you can put on a gate.",
            },
            {
              icon: Eye,
              title: "Eyes on, always",
              text: "CCTV, patrols, and live reporting so nothing important sits in the dark.",
            },
            {
              icon: Clock3,
              title: "Rapid response",
              text: "A named team, a clear protocol, and people who show up when it counts.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="flex gap-4">
                <item.icon
                  className="mt-1 shrink-0 text-olive transition-transform duration-500 hover:scale-110"
                  size={22}
                />
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-mist">{item.text}</p>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <Reveal motion="left">
          <div className="group relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
            <CoverImage
              src="/images/briefing.jpg"
              alt="Client briefing with AGOC security leadership"
              sizes="(max-width: 1024px) 100vw, 50vw"
              float="up"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <p className="absolute bottom-6 left-6 max-w-xs text-sm text-sand">
              Quiet professionals. Clear communication. No theatrics.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120} motion="right">
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            One of Dubai’s trusted firms
          </p>
          <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
            Security that feels considered, not loud.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mist">
            AGOC Security is built on trust, trained people, and an unfussy
            commitment to keeping sites calm. We work residential compounds,
            commercial towers, hotels, hospitals, warehouses, and private
            households — with the same standard on every post.
          </p>
          <ul className="mt-8 space-y-3">
            {reasons.map((reason) => (
              <li key={reason} className="flex gap-3 text-sm text-sand">
                <BadgeCheck className="mt-0.5 shrink-0 text-crimson" size={18} />
                {reason}
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="mt-8 inline-block border-b border-olive pb-1 text-sm tracking-wide text-olive transition duration-300 hover:border-crimson hover:text-crimson"
          >
            Read our story
          </Link>
        </Reveal>
      </section>

      <section className="bg-night py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
                  What we do
                </p>
                <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
                  Protection, fitted to the place.
                </h2>
              </div>
              <Link
                href="/services"
                className="text-sm tracking-wide text-sand underline-offset-4 hover:text-olive hover:underline"
              >
                All services
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-white/10 bg-coal transition-all duration-500 ease-out hover:-translate-y-2 hover:border-olive/50 hover:shadow-glow"
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
                    <CoverImage
                      src={service.image}
                      alt={service.title}
                      float={i % 2 === 0 ? "up" : "down"}
                      delay={i * 180}
                      objectPosition={service.focus ?? "center 32%"}
                    />
                    <div className="absolute inset-0 bg-ink/35 transition-opacity duration-500 group-hover:bg-ink/10" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 min-h-[2.75rem] text-sm leading-relaxed text-mist">
                      {service.short}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-24 lg:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Property security",
            text: "Access control, patrols, and 24/7 presence that keeps assets and people unhurried.",
          },
          {
            icon: Eye,
            title: "Surveillance",
            text: "Live CCTV, alerts, and operators who actually watch — not just record.",
          },
          {
            icon: Sparkles,
            title: "Compliance & quality",
            text: "Licensed, certified, and inspected. The paperwork is as tidy as the uniform.",
          },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <article className="h-full border border-white/10 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-crimson/40 hover:bg-coal">
              <item.icon className="text-crimson" size={28} />
              <h3 className="mt-5 font-display text-3xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{item.text}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="relative overflow-hidden bg-crimson">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 110} className="h-full">
                <article className="group flex h-full flex-col items-center rounded-sm bg-ink px-3 py-5 text-center shadow-md shadow-black/20 transition-all duration-500 hover:-translate-y-1 hover:bg-coal hover:shadow-xl">
                  <stat.icon
                    size={16}
                    className="text-olive transition duration-300 group-hover:text-crimson"
                  />
                  <p className="mt-2 font-display text-3xl leading-none text-white md:text-4xl">
                    {stat.value}
                  </p>
                  <span className="mt-2 block h-px w-6 bg-crimson/80 transition-all duration-500 group-hover:w-10 group-hover:bg-olive" />
                  <p className="mt-2 text-[0.6rem] tracking-[0.18em] text-mist uppercase">
                    {stat.label}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              Why AGOC
            </p>
            <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
              People first. Then process. Then tech.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist">
              Clients stay because the officer on the door is calm, the
              supervisor answers, and the report arrives. We hire for character,
              train for the post, and only then layer cameras and access systems.
            </p>
            <div className="mt-8 space-y-5">
              {[
                {
                  title: "Verified staff",
                  text: "Background checks, licensing, and briefing before anyone wears the badge.",
                },
                {
                  title: "Made for the site",
                  text: "A villa is not a nightclub. Coverage, posture, and reporting change with the brief.",
                },
                {
                  title: "Always reachable",
                  text: "A real operations line — not a voicemail maze — from Sunday through Saturday.",
                },
              ].map((row) => (
                <div
                  key={row.title}
                  className="border-l-2 border-crimson pl-4 transition-all duration-300 hover:border-olive hover:pl-5"
                >
                  <h3 className="text-white">{row.title}</h3>
                  <p className="mt-1 text-sm text-mist">{row.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="group relative min-h-[420px] overflow-hidden">
              <CoverImage
                src="/images/surveillance.jpg"
                alt="Surveillance and monitoring systems"
                sizes="(max-width: 1024px) 100vw, 50vw"
                float="down"
                delay={200}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-night py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              Get in touch
            </p>
            <h2 className="mt-3 font-display text-4xl text-white">
              Stay secure. Stay connected.
            </h2>
            <p className="mt-4 text-mist">
              Tell us the site, the hours, and the risk. We will come back with
              a clear proposal — not a catalogue.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-sand">
              <Users size={18} className="text-olive" />
              A named supervisor from day one.
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="border border-white/10 bg-coal p-6 transition duration-500 hover:border-olive/30 md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
