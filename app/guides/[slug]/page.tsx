import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import LocaleLink from "@/components/LocaleLink";
import SeoJsonLd from "@/components/SeoJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import OpsCta from "@/components/home/OpsCta";
import { getGuide, getGuides, localizeGuide } from "@/lib/guides";
import { getHomeOps } from "@/lib/home-ops";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { articleJsonLd, breadcrumbJsonLd, howToJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide" };
  const copy = localizeGuide(guide, locale);
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/guides/${slug}`,
    locale,
    keywords: copy.keywords,
  });
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const home = getHomeOps(locale);
  const raw = getGuide(slug);
  if (!raw) notFound();
  const guide = localizeGuide(raw, locale);
  const others = getGuides()
    .filter((item) => item.slug !== slug)
    .map((item) => localizeGuide(item, locale));

  const json: Record<string, unknown>[] = [
    articleJsonLd({
      title: guide.title,
      description: guide.description,
      path: `/guides/${slug}`,
      image: guide.image,
      datePublished: guide.published,
      dateModified: guide.updated,
    }),
    breadcrumbJsonLd([
      { name: dict.nav.home, path: "/" },
      { name: dict.nav.guides, path: "/guides" },
      { name: guide.title, path: `/guides/${slug}` },
    ]),
  ];

  if (slug === "hire-security-company-dubai") {
    json.push(
      howToJsonLd({
        name: guide.title,
        description: guide.description,
        steps: guide.sections.slice(0, 4).map((section) => ({
          name: section.heading,
          text: section.paragraphs.join(" "),
        })),
      }),
    );
  }

  return (
    <>
      <SeoJsonLd data={json} />
      <article className="ops-light">
        <div className="mx-auto max-w-3xl px-5 pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="ops-mono mb-5 text-[0.72rem] text-[#5B6B7C]">
            <Breadcrumbs
              items={[
                { name: dict.nav.home, href: "/" },
                { name: dict.nav.guides, href: "/guides" },
                { name: guide.title },
              ]}
            />
          </div>
          <p className="ops-pill">
            <span className="ops-pill-dot" aria-hidden />
            {dict.nav.guides}
          </p>
          <h1 className="ops-h1 ops-h1-page mt-6">{guide.title}</h1>
          <p className="mt-5 text-[1.08rem] leading-relaxed text-[#3E4F61]">{guide.excerpt}</p>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-[#0B1F2A]/5">
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <div className="ops-prose mt-12">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <p className="mt-10">
            <LocaleLink href="/contact" className="ops-btn ops-btn-primary">
              {home.cta.primary}
            </LocaleLink>
          </p>
        </div>
      </article>

      {others.length ? (
        <section className="ops-light pb-20">
          <div className="mx-auto max-w-3xl px-5">
            <p className="ops-eyebrow">{locale === "ar" ? "أدلة أخرى" : "More guides"}</p>
            <ul className="ops-seo-points mt-6">
              {others.map((item) => (
                <li key={item.slug}>
                  <LocaleLink href={`/guides/${item.slug}`} className="ops-seo-point">
                    <span className="ops-seo-point-title">{item.title}</span>
                    <span className="ops-seo-point-text">{item.excerpt}</span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <OpsCta copy={home.cta} />
    </>
  );
}
