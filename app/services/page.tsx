import type { Metadata } from "next";
import OpsCta from "@/components/home/OpsCta";
import OpsTrust from "@/components/home/OpsTrust";
import OpsPageHero from "@/components/ops/OpsPageHero";
import OpsProcess from "@/components/ops/OpsProcess";
import OpsServiceGrid from "@/components/ops/OpsServiceGrid";
import OpsStatusPanel from "@/components/ops/OpsStatusPanel";
import { getContent } from "@/lib/content";
import { getHomeOps } from "@/lib/home-ops";
import {
  getDictionary,
  localizeContent,
  localizeOffers,
  localizeServices,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { listOffers, offerBadgeByService } from "@/lib/offers";
import { getPagesOps } from "@/lib/pages-ops";
import { pageMetadata } from "@/lib/seo";
import { getVisibleServices } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Security Services in Dubai & UAE",
  description:
    "Security services in Dubai from AGOC: private security guards, lady security guards, CCTV monitoring, event security, facility management, housekeeping and cleaning across the UAE.",
  path: "/services",
  keywords: [
    "security services Dubai",
    "security guard services Dubai",
    "private security Dubai",
    "lady security guard Dubai",
    "CCTV monitoring Dubai",
    "event security Dubai",
    "facility management Dubai",
    "cleaning services Dubai",
  ],
});

export default async function ServicesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = getPagesOps(locale);
  const home = getHomeOps(locale);
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
      <OpsPageHero
        eyebrow={content.servicesPage.eyebrow}
        title={content.servicesPage.title}
        text={content.servicesPage.text}
        primary={{ href: "/contact", label: home.cta.primary }}
        secondary={{ href: "#services-list", label: dict.servicesList.viewServices }}
        visual={
          <OpsStatusPanel
            title={p.services.heroPanelTitle}
            badge={p.common.sample}
            rows={p.services.heroPanelRows}
            numbered
          />
        }
      />

      <section id="services-list" className="ops-light scroll-mt-24 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-5">
          <OpsServiceGrid
            services={services.map(({ slug, title, short, image }) => ({ slug, title, short, image }))}
            badges={badges}
            copy={p.services}
            learnMore={dict.servicesList.learnMore}
          />
        </div>
      </section>

      <OpsProcess
        label={p.process.label}
        title={p.process.title}
        accent={p.process.accent}
        text={p.process.text}
        steps={p.process.steps}
      />

      <OpsTrust copy={home.trust} />

      <OpsCta copy={{ ...p.ctaBand, whatsapp: home.cta.whatsapp }} primaryHref="/contact" />
    </>
  );
}
