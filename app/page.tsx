import type { Metadata } from "next";
import { Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import ClientMarquee from "@/components/ClientMarquee";
import OffersHighlight from "@/components/OffersHighlight";
import OpsHero from "@/components/home/OpsHero";
import OpsStatement from "@/components/home/OpsStatement";
import OpsDashboard from "@/components/home/OpsDashboard";
import OpsFeatures from "@/components/home/OpsFeatures";
import OpsTimeline from "@/components/home/OpsTimeline";
import OpsReport from "@/components/home/OpsReport";
import OpsCompare from "@/components/home/OpsCompare";
import OpsTrust from "@/components/home/OpsTrust";
import OpsCta from "@/components/home/OpsCta";
import OpsServiceTrack from "@/components/home/OpsServiceTrack";
import { getClientLogos } from "@/lib/clients";
import DirectorMessage from "@/components/DirectorMessage";
import { getContent, teamKind } from "@/lib/content";
import { getHomeOps } from "@/lib/home-ops";
import { getPagesOps } from "@/lib/pages-ops";
import {
  getDictionary,
  isRtl,
  localizeContent,
  localizeOffers,
  localizeServices,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { listOffers } from "@/lib/offers";
import { pageMetadata } from "@/lib/seo";
import { getServices, getVisibleServices } from "@/lib/services";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "AGOC Security Dubai",
    description:
      "Security company in Dubai providing licensed security guards, CCTV monitoring, event security and facility management across the UAE. Every post covered, every night reported.",
    path: "/",
    keywords: [
      "security company Dubai",
      "security guard services Dubai",
      "licensed security guards UAE",
      "private security Dubai",
      "CCTV monitoring Dubai",
      "event security Dubai",
      "lady security guard Dubai",
      "facility management Dubai",
      "AGOC security Dubai",
    ],
  }),
  title: {
    absolute: "AGOC Security Dubai | Licensed Security Guard Services",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ops = getHomeOps(locale);
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
  const director = content.about.team.find((member) => teamKind(member) === "founder");
  const selectedService = params.service?.trim() ?? "";
  const homeServices = services.slice(0, 8);

  return (
    <>
      <OpsHero copy={ops.hero} rtl={isRtl(locale)} />
      {director ? (
        <section id="director" className="ops-light py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <DirectorMessage
              member={director}
              heading={dict.about.founderMessage}
              quoteFrom={getPagesOps(locale).about.quoteFrom}
            />
          </div>
        </section>
      ) : null}

      <OpsStatement copy={ops.statement} />
      <OpsDashboard copy={ops.demo} />
      <OpsFeatures copy={ops.features} />
      <OpsTimeline copy={ops.timeline} />
      <OpsReport copy={ops.report} />
      <OpsCompare copy={ops.compare} rtl={isRtl(locale)} />
      <OpsTrust copy={ops.trust} />

      <OpsServiceTrack
        label={ops.servicesIntro.label}
        title={ops.servicesIntro.title}
        accent={ops.servicesIntro.accent}
        services={homeServices}
        total={services.length}
        allLabel={dict.home.allServices}
        learnMore={dict.serviceDetail.learnMore}
        book={dict.home.bookNow}
      />

      {offers.length > 0 ? (
        <OffersHighlight
          offers={offers}
          label={dict.home.offersLabel}
          title={dict.home.offersTitle}
          viewServiceLabel={dict.home.viewService}
        />
      ) : null}

      <ClientMarquee logos={clientLogos} copy={ops.clients} />

      <OpsCta copy={ops.cta} />

      <section id="enquire" className="ops-light scroll-mt-28 pb-20 pt-4 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="ops-eyebrow">{home.contactLabel}</p>
            <h2 className="ops-h2 mt-4">{home.contactTitle}</h2>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-[#3E4F61]">
              {home.contactText}
            </p>
            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-[#0B1F2A]/10 bg-white px-4 py-3.5 text-[0.95rem] font-medium text-[#0B1F2A] shadow-[0_10px_30px_-18px_rgba(11,31,42,0.35)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#A6851F]">
                <Users size={16} />
              </span>
              {home.contactNote}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="ops-form contact-form-panel enquire-panel p-5 sm:p-7 md:p-8">
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
