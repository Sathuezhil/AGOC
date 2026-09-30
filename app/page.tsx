import type { Metadata } from "next";
import LocaleLink from "@/components/LocaleLink";
import {
  BadgeCheck,
  Clock3,
  Eye,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import CoverImage from "@/components/CoverImage";
import Card3D from "@/components/Card3D";
import ClientMarquee from "@/components/ClientMarquee";
import OffersHighlight from "@/components/OffersHighlight";
import { getClientLogos } from "@/lib/clients";
import { getContent } from "@/lib/content";
import {
  getDictionary,
  localizeContent,
  localizeOffers,
  localizeServices,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { listOffers } from "@/lib/offers";
import { defaultDescription, pageMetadata } from "@/lib/seo";
import { getServices, getVisibleServices } from "@/lib/services";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "AGOC Security Dubai",
    description: defaultDescription,
    path: "/",
    keywords: [
      "AGOC security Dubai",
      "security company Dubai",
      "private guards UAE",
      "licensed security guards Dubai",
      "CCTV control Dubai",
    ],
  }),
  title: {
    absolute: "AGOC Security Dubai",
  },
};

const pillarIcons = [ShieldCheck, Eye, Clock3];
const featureIcons = [ShieldCheck, Eye, Sparkles];

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const clientLogos = getClientLogos();
  const [rawContent, rawServices, rawAllServices, rawOffers] = await Promise.all([
    getContent(),
    getVisibleServices(),
    getServices(),
    listOffers(),
  ]);
  const content = localizeContent(rawContent, locale);
  const services = localizeServices(rawServices, locale);
  const allServices = localizeServices(rawAllServices, locale);
  const offers = localizeOffers(rawOffers, locale);
  const { home } = content;
  const selectedService = params.service?.trim() ?? "";
  /** Home preview: two grid rows (3 cols × 2 on desktop). */
  const homeServices = services.slice(0, 6);
  const hasMoreServices = services.length > homeServices.length;

  return (
    <>
      <Hero content={content.hero} />

      <section className="hero-pillars border-y border-sand/10 bg-night">
        <div className="site-wrap grid gap-cards section-y-tight md:grid-cols-3">
          {home.pillars.map((item, i) => {
            const Icon = pillarIcons[i] ?? ShieldCheck;
            return (
              <Reveal key={item.title} delay={i * 90}>
                <div className="pillar-card flex h-full gap-3 rounded-xl border border-sand/15 bg-white p-5">
                  <Icon
                    className="mt-0.5 shrink-0 text-olive"
                    size={20}
                  />
                  <div>
                    <h2 className="text-[1rem] font-semibold tracking-wide text-navy">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 type-body-sm text-steel">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="site-wrap grid items-center gap-section section-y lg:grid-cols-2">
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
            <p className="absolute bottom-6 left-6 z-[1] max-w-xs type-body-sm text-white">
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
          <h2 className="type-section mt-4 text-sand">
            {home.introTitle}
          </h2>
          <p className="type-body measure mt-5 text-mist">{home.introText}</p>
          <ul className="mt-8 space-y-3">
            {home.reasons.map((reason) => (
              <li key={reason} className="flex gap-3 type-body-sm text-sand">
                <BadgeCheck className="mt-0.5 shrink-0 text-crimson" size={18} />
                {reason}
              </li>
            ))}
          </ul>
          <LocaleLink
            href="/about"
            className="mt-8 inline-block border-b border-olive pb-1 text-sm tracking-wide text-olive transition duration-300 hover:border-crimson hover:text-crimson"
          >
            {dict.home.readStory}
          </LocaleLink>
        </Reveal>
      </section>

      <section className="bg-night section-y">
        <div className="site-wrap">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
                  {home.servicesLabel}
                </p>
                <h2 className="type-section mt-3 text-sand">
                  {home.servicesTitle}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LocaleLink
                  href="#enquire"
                  className="btn-shine inline-flex bg-crimson px-5 py-2.5 text-sm font-medium tracking-[0.14em] text-white uppercase transition duration-300 hover:bg-crimson-dark rtl:tracking-normal rtl:normal-case"
                >
                  {dict.home.bookService}
                </LocaleLink>
                <LocaleLink
                  href="/services"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sand/20 bg-transparent px-4 py-2.5 text-sm font-medium tracking-[0.12em] text-sand uppercase transition duration-300 hover:border-olive/50 hover:text-olive rtl:tracking-normal rtl:normal-case"
                >
                  {dict.home.allServices}
                  <span aria-hidden className="text-base leading-none rtl:rotate-180">
                    →
                  </span>
                </LocaleLink>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid auto-rows-fr gap-cards sm:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60} className="h-full">
                <Card3D>
                  <article className="service-card group flex h-full flex-col overflow-hidden border border-sand/15 bg-white transition-colors duration-500 ease-out hover:border-olive/50">
                    <LocaleLink
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
                    </LocaleLink>
                    <div className="flex flex-1 flex-col p-6">
                      <LocaleLink href={`/services/${service.slug}`}>
                        <h3 className="type-card text-navy transition hover:text-olive">
                          {service.title}
                        </h3>
                      </LocaleLink>
                      <p className="mt-2 min-h-[2.75rem] flex-1 type-body-sm text-steel">
                        {service.short}
                      </p>
                      <LocaleLink
                        href={`/?service=${encodeURIComponent(service.slug)}#enquire`}
                        className="btn-shine mt-5 inline-flex w-full items-center justify-center bg-crimson px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition duration-300 hover:bg-crimson-dark rtl:tracking-normal rtl:normal-case"
                      >
                        {dict.home.bookNow}
                      </LocaleLink>
                    </div>
                  </article>
                </Card3D>
              </Reveal>
            ))}
          </div>

          {hasMoreServices ? (
            <Reveal delay={120}>
              <div className="mt-10 flex justify-center">
                <LocaleLink
                  href="/services"
                  className="inline-flex items-center gap-2 border-b border-olive pb-1 text-sm tracking-[0.14em] text-olive uppercase transition duration-300 hover:border-crimson hover:text-crimson rtl:tracking-normal rtl:normal-case"
                >
                  {dict.home.allServices}
                  <span aria-hidden className="text-base leading-none rtl:rotate-180">
                    →
                  </span>
                </LocaleLink>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {offers.length > 0 ? (
        <OffersHighlight
          offers={offers}
          label={dict.home.offersLabel}
          title={dict.home.offersTitle}
          viewServiceLabel={dict.home.viewService}
        />
      ) : null}

      <section className="site-wrap grid gap-cards section-y lg:grid-cols-3">
        {home.features.map((item, i) => {
          const Icon = featureIcons[i] ?? Sparkles;
          return (
            <Reveal key={item.title} delay={i * 80}>
              <Card3D intensity={9}>
                <article className="h-full border border-sand/10 bg-night/40 p-8 transition-colors duration-500 hover:border-crimson/40 hover:bg-coal">
                  <Icon className="text-crimson" size={28} />
                  <h3 className="type-card mt-5 text-sand">
                    {item.title}
                  </h3>
                  <p className="mt-3 type-body-sm text-mist">{item.text}</p>
                </article>
              </Card3D>
            </Reveal>
          );
        })}
      </section>

      <section className="trust-strip border-y border-sand/10 bg-night">
        <div className="site-wrap section-y-tight">
          <ul className="trust-strip-row">
            {home.stats.map((stat) => (
              <li key={stat.label} className="trust-strip-card">
                <span className="trust-strip-value">{stat.value}</span>
                <span className="trust-strip-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-wrap section-y">
        <div className="grid items-start gap-section lg:grid-cols-2">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              {home.whyLabel}
            </p>
            <h2 className="type-section mt-3 text-sand">
              {home.whyTitle}
            </h2>
            <p className="type-body measure mt-5 text-mist">{home.whyText}</p>
            <div className="mt-8 space-y-5">
              {home.whyItems.map((row) => (
                <div
                  key={row.title}
                  className="border-l-2 border-crimson pl-4 transition-all duration-300 hover:border-olive hover:pl-5"
                >
                  <h3 className="text-sand">{row.title}</h3>
                  <p className="mt-1 type-body-sm text-mist">{row.text}</p>
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

      <ClientMarquee logos={clientLogos} />

      <section id="enquire" className="scroll-mt-28 bg-night section-y">
        <div className="site-wrap grid items-center gap-section lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              {home.contactLabel}
            </p>
            <h2 className="type-section mt-3 text-sand">
              {home.contactTitle}
            </h2>
            <p className="type-body measure mt-4 text-mist">
              {home.contactText}
            </p>
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-sand/10 bg-coal/40 px-4 py-3.5 type-body-sm text-sand">
              <Users size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>{home.contactNote}</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="contact-form-panel enquire-panel rounded-2xl border border-sand/10 bg-night/40 p-5 shadow-[0_14px_34px_rgba(11, 31, 42,0.18)] sm:p-6 md:p-7">
              <ContactForm
                services={allServices}
                defaultService={selectedService}
                dict={dict}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
