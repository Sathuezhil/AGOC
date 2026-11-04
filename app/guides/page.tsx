import type { Metadata } from "next";
import Image from "next/image";
import LocaleLink from "@/components/LocaleLink";
import SeoJsonLd from "@/components/SeoJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import OpsCta from "@/components/home/OpsCta";
import OpsPageHero from "@/components/ops/OpsPageHero";
import { getGuides, localizeGuide } from "@/lib/guides";
import { getHomeOps } from "@/lib/home-ops";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dubai Security Company Guides | How to Hire Guards",
  description:
    "Practical guides from a licensed Dubai security company: how to hire security guards, what SIRA licensing means, and how tower, villa and site posts actually run.",
  path: "/guides",
  keywords: [
    "dubai security company",
    "hire security company dubai",
    "SIRA licensed security Dubai",
    "security guard services Dubai",
    "how to hire security guards Dubai",
  ],
});

export default async function GuidesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const home = getHomeOps(locale);
  const items = getGuides().map((guide) => localizeGuide(guide, locale));
  const arabic = locale === "ar";

  return (
    <>
      <SeoJsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: "/" },
          { name: dict.nav.guides, path: "/guides" },
        ])}
      />
      <OpsPageHero
        breadcrumb={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: "/" },
              { name: dict.nav.guides },
            ]}
          />
        }
        eyebrow={arabic ? "أدلة أمنية" : "Security guides"}
        title={arabic ? "كيف توظّف شركة أمن في دبي" : "How to hire a Dubai security company"}
        text={
          arabic
            ? "شروحات عملية من شركة أمن مرخّصة في دبي: الترخيص، عدد الحراس، الإشراف والتقرير الصباحي — قبل أن توقّع العقد."
            : "Plain guides from a licensed Dubai security company: licence, headcount, supervision and the morning report — before you sign."
        }
        primary={{ href: "/contact", label: home.cta.primary }}
        secondary={{ href: "/services", label: dict.servicesList.viewServices }}
      />

      <section className="ops-light pb-20 md:pb-28">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-3">
          {items.map((guide) => (
            <LocaleLink key={guide.slug} href={`/guides/${guide.slug}`} className="ops-seo-point !p-0 overflow-hidden">
              <span className="relative block aspect-[16/10] bg-[#0B1F2A]/5">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </span>
              <span className="block p-5">
                <span className="ops-seo-point-title">{guide.title}</span>
                <span className="ops-seo-point-text mt-2">{guide.excerpt}</span>
              </span>
            </LocaleLink>
          ))}
        </div>
      </section>

      <OpsCta copy={home.cta} />
    </>
  );
}
