import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CoverImage from "@/components/CoverImage";
import LocaleLink from "@/components/LocaleLink";
import { ServiceOfferBadge } from "@/components/OffersHighlight";
import { getContent } from "@/lib/content";
import {
  getDictionary,
  localizeContent,
  localizeOffers,
  localizeServices,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { listOffers, offerBadgeByService } from "@/lib/offers";
import { pageMetadata } from "@/lib/seo";
import { getVisibleServices } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Security Services in Dubai & UAE",
  description:
    "AGOC Security services in Dubai: private guards, lady security, CCTV control, facility management, housekeeping, lifeguard, and event security across the UAE.",
  path: "/services",
  keywords: [
    "security services Dubai",
    "private guards UAE",
    "CCTV monitoring Dubai",
    "facility management Dubai",
    "housekeeping Dubai",
    "AGOC security services",
  ],
});

export default async function ServicesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [rawContent, rawServices, rawOffers] = await Promise.all([
    getContent(),
    getVisibleServices(),
    listOffers(),
  ]);
  const content = localizeContent(rawContent, locale);
  const services = localizeServices(rawServices, locale);
  const badges = offerBadgeByService(localizeOffers(rawOffers, locale));

  return (
    <>
      <PageHero
        eyebrow={content.servicesPage.eyebrow}
        title={content.servicesPage.title}
        text={content.servicesPage.text}
        primaryLabel={dict.hero.speakWithUs}
        secondaryHref="#services-list"
        secondaryLabel={dict.servicesList.viewServices}
      />

      <section
        id="services-list"
        className="scroll-mt-28 mx-auto max-w-6xl space-y-12 px-4 py-14 sm:space-y-16 sm:px-6 sm:py-24"
      >
        {services.map((service, i) => (
          <Reveal key={service.slug}>
            <article
              className={`grid items-center gap-6 sm:gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="service-image-float media-frame relative overflow-hidden rounded-xl border border-sand/15 bg-night shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
                <CoverImage
                  src={service.image}
                  alt={`${service.title} — AGOC Security Dubai`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  bounce={false}
                  objectPosition="center"
                  className="service-image-media"
                />
                <ServiceOfferBadge badge={badges[service.slug] || ""} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-80" />
                <div className="service-image-shine pointer-events-none absolute inset-0" />
                <div className="service-image-outline pointer-events-none absolute inset-0" />
              </div>
              <div>
                <p className="olive-label text-sm tracking-[0.22em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-3xl text-sand sm:text-4xl">
                  {service.title}
                </h2>
                <p className="mt-4 leading-relaxed text-mist">{service.summary}</p>
                <LocaleLink
                  href={`/services/${service.slug}`}
                  className="mt-6 inline-block bg-crimson px-5 py-2.5 text-sm text-white hover:bg-crimson-dark"
                >
                  {dict.servicesList.learnMore}
                </LocaleLink>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
