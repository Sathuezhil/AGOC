import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CoverImage from "@/components/CoverImage";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Private security, guards, transport protection, surveillance, club door teams, defense training, and building cleaning across Dubai and the UAE.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="A full bench of protection."
        text="From a single villa gate to a multi-site commercial roster — officers, systems, and support that hold together."
      />

      <section className="mx-auto max-w-6xl space-y-16 px-6 py-24">
        {services.map((service, i) => (
          <Reveal key={service.slug}>
            <article
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="group relative aspect-[16/10] overflow-hidden md:aspect-[5/3]">
                <CoverImage
                  src={service.image}
                  alt={service.title}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  float={i % 2 === 0 ? "up" : "down"}
                  delay={i * 160}
                  objectPosition={service.focus ?? "center 32%"}
                />
              </div>
              <div>
                <p className="olive-label text-sm tracking-[0.22em] text-olive uppercase">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-4xl text-white">
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
