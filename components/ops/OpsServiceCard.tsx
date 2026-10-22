import { ArrowRight } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import LocaleLink from "@/components/LocaleLink";
import { ServiceOfferBadge } from "@/components/OffersHighlight";
import type { ServiceCategory } from "@/lib/pages-ops";

export type OpsServiceCardData = {
  slug: string;
  title: string;
  short: string;
  image: string;
  category?: ServiceCategory;
};

export default function OpsServiceCard({
  service,
  index,
  badge = "",
  learnMore,
  book,
}: {
  service: OpsServiceCardData;
  index?: number;
  badge?: string;
  learnMore: string;
  book: string;
}) {
  return (
    <article className="ops-service-card group">
      <LocaleLink href={`/services/${service.slug}`} className="media-frame relative block overflow-hidden">
        <CoverImage
          src={service.image}
          alt={`${service.title} — AGOC Security Dubai`}
          bounce={false}
          objectPosition="center"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <ServiceOfferBadge badge={badge} />
        {index !== undefined ? (
          <span className="ops-service-num">{String(index + 1).padStart(2, "0")}</span>
        ) : null}
      </LocaleLink>
      <div className="flex flex-1 flex-col p-6">
        <LocaleLink href={`/services/${service.slug}`}>
          <h3 className="text-[1.2rem] font-bold leading-snug tracking-tight text-[#0B1F2A] transition-colors group-hover:text-[#0066FF]">
            {service.title}
          </h3>
        </LocaleLink>
        <p className="mt-2 flex-1 text-[0.94rem] leading-relaxed text-[#4A5B6C]">{service.short}</p>
        <div className="mt-6 flex items-center gap-3">
          <LocaleLink
            href={`/contact?service=${encodeURIComponent(service.slug)}`}
            className="ops-btn ops-btn-primary flex-1 !px-4 !py-2.5 text-sm"
          >
            {book}
          </LocaleLink>
          <LocaleLink
            href={`/services/${service.slug}`}
            aria-label={`${learnMore}: ${service.title}`}
            className="ops-btn ops-btn-ghost !px-4 !py-2.5 text-sm"
          >
            {learnMore}
            <ArrowRight size={15} className="rtl:rotate-180" />
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}
