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
import Card3D from "@/components/Card3D";
import { getContent } from "@/lib/content";
import { getServices, getVisibleServices } from "@/lib/services";

const pillarIcons = [ShieldCheck, Eye, Clock3];
const featureIcons = [ShieldCheck, Eye, Sparkles];
const statIcons = {
  shield: ShieldCheck,
  clock: Clock3,
  map: MapPin,
  check: BadgeCheck,
} as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const [content, services, allServices] = await Promise.all([
    getContent(),
    getVisibleServices(),
    getServices(),
  ]);
  const { home } = content;
  const selectedService = params.service?.trim() ?? "";

  return (
    <>
      <Hero content={content.hero} />

      <section className="hero-pillars border-y border-sand/10 bg-night">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 md:grid-cols-3 md:gap-5 md:py-9">
          {home.pillars.map((item, i) => {
            const Icon = pillarIcons[i] ?? ShieldCheck;
            return (
              <Reveal key={item.title} delay={i * 90}>
                <div className="pillar-card flex h-full gap-3 rounded-xl border border-sand/10 bg-coal/35 p-5">
                  <Icon
                    className="mt-0.5 shrink-0 text-olive"
                    size={20}
                  />
                  <div>
                    <h2 className="text-[1rem] font-semibold tracking-wide text-sand">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed text-mist">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <Reveal motion="left">
          <div className="service-image-float media-frame group relative overflow-hidden rounded-xl">
            <CoverImage
              src={home.introImage}
              alt={home.introCaption}
              sizes="(max-width: 1024px) 100vw, 50vw"
              bounce={false}
              objectPosition="center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <p className="absolute bottom-6 left-6 z-[1] max-w-xs text-sm text-white">
              {home.introCaption}
            </p>
            <div className="service-image-shine pointer-events-none absolute inset-0" />
            <div className="service-image-outline pointer-events-none absolute inset-0" />
          </div>
        </Reveal>
        <Reveal delay={120} motion="right">
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            {home.introLabel}
          </p>
          <h2 className="mt-4 font-display text-4xl text-sand md:text-5xl">
            {home.introTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mist">{home.introText}</p>
          <ul className="mt-8 space-y-3">
            {home.reasons.map((reason) => (
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
                  {home.servicesLabel}
                </p>
                <h2 className="mt-3 font-display text-4xl text-sand md:text-5xl">
                  {home.servicesTitle}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#enquire"
                  className="btn-shine inline-flex bg-crimson px-5 py-2.5 text-sm font-medium tracking-[0.14em] text-white uppercase transition duration-300 hover:bg-crimson-dark"
                >
                  Book a service
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sand/20 bg-transparent px-4 py-2.5 text-sm font-medium tracking-[0.12em] text-sand uppercase transition duration-300 hover:border-olive/50 hover:text-olive"
                >
                  All services
                  <span aria-hidden className="text-base leading-none">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60} className="h-full">
                <Card3D>
                  <article className="service-card group flex h-full flex-col overflow-hidden border border-sand/10 bg-coal transition-colors duration-500 ease-out hover:border-olive/50">
                    <Link
                      href={`/services/${service.slug}`}
                      className="service-image-float media-frame relative w-full shrink-0 overflow-hidden"
                    >
                      <CoverImage
                        src={service.image}
                        alt={service.title}
                        bounce={false}
                        objectPosition="center"
                        className="service-image-media"
                      />
                      <div className="service-image-shine pointer-events-none absolute inset-0" />
                      <div className="service-image-outline pointer-events-none absolute inset-0" />
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <Link href={`/services/${service.slug}`}>
                        <h3 className="font-display text-2xl text-sand transition hover:text-olive">
                          {service.title}
                        </h3>
                      </Link>
                      <p className="mt-2 min-h-[2.75rem] flex-1 text-sm leading-relaxed text-mist">
                        {service.short}
                      </p>
                      <Link
                        href={`/?service=${encodeURIComponent(service.title)}#enquire`}
                        className="btn-shine mt-5 inline-flex w-full items-center justify-center bg-crimson px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition duration-300 hover:bg-crimson-dark"
                      >
                        Book now
                      </Link>
                    </div>
                  </article>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-24 lg:grid-cols-3">
        {home.features.map((item, i) => {
          const Icon = featureIcons[i] ?? Sparkles;
          return (
            <Reveal key={item.title} delay={i * 80}>
              <Card3D intensity={9}>
                <article className="h-full border border-sand/10 bg-night/40 p-8 transition-colors duration-500 hover:border-crimson/40 hover:bg-coal">
                  <Icon className="text-crimson" size={28} />
                  <h3 className="mt-5 font-display text-3xl text-sand">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{item.text}</p>
                </article>
              </Card3D>
            </Reveal>
          );
        })}
      </section>

      <section className="relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {home.stats.map((stat, i) => {
              const Icon = statIcons[stat.icon] ?? ShieldCheck;
              return (
                <Reveal key={stat.label} delay={i * 110} className="h-full">
                  <Card3D intensity={8}>
                    <article className="group flex h-full flex-col items-center rounded-sm bg-black/40 px-3 py-5 text-center shadow-md shadow-black/20 transition-colors duration-500 hover:bg-black/55 hover:shadow-xl">
                      <Icon
                        size={16}
                        className="text-olive transition duration-300 group-hover:text-crimson"
                      />
                      <p className="mt-2 font-display text-3xl leading-none text-white md:text-4xl">
                        {stat.value}
                      </p>
                      <span className="mt-2 block h-px w-6 bg-crimson/80 transition-all duration-500 group-hover:w-10 group-hover:bg-olive" />
                      <p className="mt-2 text-[0.6rem] tracking-[0.18em] text-white/65 uppercase">
                        {stat.label}
                      </p>
                    </article>
                  </Card3D>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              {home.whyLabel}
            </p>
            <h2 className="mt-3 font-display text-4xl text-sand md:text-5xl">
              {home.whyTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist">{home.whyText}</p>
            <div className="mt-8 space-y-5">
              {home.whyItems.map((row) => (
                <div
                  key={row.title}
                  className="border-l-2 border-crimson pl-4 transition-all duration-300 hover:border-olive hover:pl-5"
                >
                  <h3 className="text-sand">{row.title}</h3>
                  <p className="mt-1 text-sm text-mist">{row.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="service-image-float media-frame group relative overflow-hidden rounded-xl">
              <CoverImage
                src={home.whyImage}
                alt={home.whyTitle}
                sizes="(max-width: 1024px) 100vw, 50vw"
                bounce={false}
                objectPosition="center"
              />
              <div className="service-image-shine pointer-events-none absolute inset-0" />
              <div className="service-image-outline pointer-events-none absolute inset-0" />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-28 bg-night py-14 sm:py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              {home.contactLabel}
            </p>
            <h2 className="mt-3 font-display text-3xl text-sand sm:text-4xl md:text-[2.75rem] md:leading-tight">
              {home.contactTitle}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mist sm:text-base">
              {home.contactText}
            </p>
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-sand/10 bg-coal/40 px-4 py-3.5 text-sm text-sand">
              <Users size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>{home.contactNote}</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="contact-form-panel enquire-panel rounded-2xl border border-sand/10 bg-night/40 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.18)] sm:p-6 md:p-7">
              <ContactForm
                services={allServices}
                defaultService={selectedService}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
