import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CoverImage from "@/components/CoverImage";
import { getContent } from "@/lib/content";
import { getVisibleServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Private security, guards, transport protection, surveillance, club door teams, defense training, and building cleaning across Dubai and the UAE.",
};

export default async function ServicesPage() {
  const [content, services] = await Promise.all([
    getContent(),
    getVisibleServices(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={content.servicesPage.eyebrow}
        title={content.servicesPage.title}
        text={content.servicesPage.text}
        secondaryHref="#services-list"
        secondaryLabel="View services"
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
                  alt={service.title}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  bounce={false}
                  objectPosition="center"
                  className="service-image-media"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-80" />
                <div className="service-image-shine pointer-events-none absolute inset-0" />
                <div className="service-image-outline pointer-events-none absolute inset-0" />
              </div>
              <div>
                <p className="olive-label text-sm tracking-[0.22em] text-olive uppercase">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-3xl text-sand sm:text-4xl">
                  {service.title}
                </h2>
                <p className="mt-4 leading-relaxed text-mist">{service.summary}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-6 inline-block bg-crimson px-5 py-2.5 text-sm text-white hover:bg-crimson-dark"
                >
                  Learn more
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
