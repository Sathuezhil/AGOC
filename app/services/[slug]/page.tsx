import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle, ShieldCheck } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Reveal from "@/components/Reveal";
import LocaleLink from "@/components/LocaleLink";
import OffersHighlight, { ServiceOfferBadge } from "@/components/OffersHighlight";
import SeoJsonLd from "@/components/SeoJsonLd";
import OpsCta from "@/components/home/OpsCta";
import OpsTag from "@/components/home/OpsTag";
import OpsMediaCard from "@/components/ops/OpsMediaCard";
import OpsPageHero from "@/components/ops/OpsPageHero";
import OpsProcess from "@/components/ops/OpsProcess";
import OpsSectionHead from "@/components/ops/OpsSectionHead";
import OpsServiceCard from "@/components/ops/OpsServiceCard";
import { getAdminSession } from "@/lib/admin-guard";
import { getHomeOps } from "@/lib/home-ops";
import {
  getDictionary,
  localizeOffers,
  localizeService,
  localizeServices,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { sameMediaSrc, uniqueMediaSrcs } from "@/lib/media-path";
import { listOffersForService } from "@/lib/offers";
import { getPagesOps, splitAccent } from "@/lib/pages-ops";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { getService, getVisibleServices } from "@/lib/services";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const service = await getService(slug);
  if (!service) return { title: "Service" };
  const localized = localizeService(service, locale);
  const description =
    localized.summary ||
    localized.short ||
    `${localized.title} by AGOC Security in Dubai and the UAE.`;
  return pageMetadata({
    title: `${localized.title} in Dubai`,
    description,
    path: `/services/${slug}`,
    keywords: [
      localized.title,
      `${localized.title} Dubai`,
      `${localized.title} UAE`,
      "security company Dubai",
      "AGOC security Dubai",
      "security services Dubai",
    ],
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = getPagesOps(locale);
  const home = getHomeOps(locale);
  const raw = await getService(slug);
  if (!raw) notFound();

  const session = await getAdminSession();
  if (raw.hidden && !session) notFound();

  const service = localizeService(raw, locale);
  const serviceOffers = localizeOffers(await listOffersForService(service.slug), locale);
  const offerBadge = serviceOffers.find((o) => o.badge?.trim())?.badge || "";
  const photos = uniqueMediaSrcs(service.gallery)
    .filter((src) => !sameMediaSrc(src, service.image))
    .slice(0, 4);
  const others = localizeServices(
    (await getVisibleServices()).filter((item) => item.slug !== service.slug),
    locale,
  ).slice(0, 3);
  const bookHref = `/contact?service=${encodeURIComponent(service.slug)}`;
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `${dict.whatsapp.message} (${service.title})`,
  )}`;

  return (
    <>
      <SeoJsonLd
        data={[
          serviceJsonLd({
            title: service.title,
            description: service.summary || service.short,
            slug: service.slug,
            image: service.image,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <OpsPageHero
        breadcrumb={
          <>
            <LocaleLink href="/services" className="transition hover:text-[#0066FF]">
              {dict.services.eyebrow}
            </LocaleLink>
            <span className="mx-2 opacity-40">/</span>
            <span className="text-[#0B1F2A]">{service.title}</span>
          </>
        }
        eyebrow={dict.services.service}
        title={service.title}
        text={service.summary || service.short}
        primary={{ href: bookHref, label: dict.services.bookThis }}
        secondary={{
          href: waHref,
          label: p.common.whatsapp,
          external: true,
          icon: <MessageCircle size={16} />,
        }}
        visual={
          <OpsMediaCard
            src={service.image}
            alt={`${service.title} by AGOC Security in Dubai`}
            priority
            badge={<ServiceOfferBadge badge={offerBadge} className="sm:px-3.5 sm:py-2 sm:text-xs" />}
            card={{
              icon: <ShieldCheck size={18} />,
              title: p.serviceDetail.heroCard[1].label,
              meta: p.serviceDetail.heroCard[1].meta,
              tag: p.serviceDetail.heroCard[1].tag,
              tone: "live",
            }}
          />
        }
      />

      <section className="ops-light pb-6">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-3">
          {p.serviceDetail.heroCard.map((row, i) => (
            <Reveal key={row.label} delay={i * 90}>
              <div className="ops-stat-strip">
                <span className="min-w-0">
                  <span className="ops-mono block text-[0.65rem] tracking-[0.18em] text-[#8593A3] uppercase rtl:tracking-normal">
                    {row.label}
                  </span>
                  <span className="mt-1 block truncate text-[0.98rem] font-semibold text-[#0B1F2A]">{row.meta}</span>
                </span>
                <OpsTag tone={row.tone}>{row.tag}</OpsTag>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {service.points.length > 0 ? (
        <section className="ops-light py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <OpsSectionHead
              label={dict.serviceDetail.included}
              title={dict.serviceDetail.whatYouGet}
              text={p.serviceDetail.includedText}
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {service.points.map((point, i) => (
                <Reveal key={point} delay={i * 60} className="h-full">
                  <div className="ops-point-row h-full">
                    <span className="ops-feature-check bg-[#0066FF]/10 text-[#0066FF]">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <p className="flex-1 text-[1rem] font-medium leading-relaxed text-[#0B1F2A]">{point}</p>
                    <span className="ops-mono text-[0.7rem] text-[#8593A3]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {serviceOffers.length > 0 ? (
        <OffersHighlight
          offers={serviceOffers}
          label={dict.services.offerLabel}
          title={dict.services.offerTitle}
          compact
        />
      ) : null}

      {photos.length > 0 ? (
        <section className="ops-light pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-5">
            <OpsSectionHead
              label={dict.serviceDetail.onTheGround}
              title={dict.serviceDetail.lookOfWork}
              text={p.serviceDetail.galleryText}
            />
            <div className={`ops-gallery ops-gallery-${Math.min(photos.length, 4)} mt-12`}>
              {photos.map((src, i) => (
                <Reveal key={src} delay={i * 90} className="ops-gallery-item">
                  <div className="ops-media h-full">
                    <CoverImage
                      src={src}
                      alt={`${service.title} in Dubai — photo ${i + 1}`}
                      bounce={false}
                      objectPosition="center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="transition-transform duration-700 hover:scale-[1.04]"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <OpsProcess
        label={p.process.label}
        title={p.process.title}
        accent={p.process.accent}
        text={p.process.text}
        steps={p.process.steps}
        dark
      />

      {others.length > 0 ? (
        <section className="ops-light py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <OpsSectionHead
              label={dict.serviceDetail.alsoAvailable}
              title={dict.services.otherServices}
              text={p.serviceDetail.otherText}
              action={
                <LocaleLink href="/services" className="ops-btn ops-btn-ghost">
                  {dict.serviceDetail.viewAll}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </LocaleLink>
              }
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item, i) => (
                <Reveal key={item.slug} delay={i * 80} className="h-full">
                  <OpsServiceCard
                    service={item}
                    learnMore={dict.serviceDetail.learnMore}
                    book={p.services.book}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <OpsCta
        copy={{
          title: splitAccent(dict.services.readyToStaff)[0],
          accent: splitAccent(dict.services.readyToStaff)[1],
          text: dict.services.tellUs,
          primary: dict.services.bookThis,
          whatsapp: home.cta.whatsapp,
        }}
        primaryHref={bookHref}
      />
    </>
  );
}
