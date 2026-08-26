import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Reveal from "@/components/Reveal";
import Card3D from "@/components/Card3D";
import { getAdminSession } from "@/lib/admin-guard";
import { sameMediaSrc, uniqueMediaSrcs } from "@/lib/media-path";
import { getService, getServices, getVisibleServices } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getServices();
  return items.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const session = await getAdminSession();
  if (service.hidden && !session) notFound();

  const photos = uniqueMediaSrcs(service.gallery).filter(
    (src) => !sameMediaSrc(src, service.image),
  );
  const sidePhoto = photos[0] ?? "";
  const groundPhotos = photos.filter((src) => !sameMediaSrc(src, sidePhoto)).slice(0, 3);
  const others = (await getVisibleServices())
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-ink pt-[4.6rem]">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 md:py-8">
          <p className="mb-3 text-xs tracking-[0.22em] text-olive uppercase sm:mb-4 sm:text-sm">
            <Link href="/services" className="hover:text-sand">
              Services
            </Link>
            <span className="mx-2 text-sand/30">/</span>
            {service.title}
          </p>
          <div className="media-frame relative overflow-hidden bg-night">
            <CoverImage
              src={service.image}
              alt={service.title}
              priority
              bounce={false}
              objectPosition="center"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-8">
              <p className="olive-label text-xs tracking-[0.3em] text-olive uppercase sm:text-sm">
                Service
              </p>
              <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl md:text-5xl">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-10 lg:py-20">
        <Reveal motion="left">
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            How we cover it
          </p>
          <h2 className="mt-3 font-display text-3xl text-sand sm:text-4xl">
            Built for the post, not a brochure.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-sand/90 sm:text-lg">
            {service.summary}
          </p>
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="btn-shine mt-8 inline-flex items-center gap-2 bg-crimson px-6 py-3 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-crimson-dark"
          >
            Book this service
            <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Reveal delay={120} motion="right">
          {sidePhoto ? (
            <div className="media-frame relative overflow-hidden border border-sand/10 bg-night">
              <CoverImage
                src={sidePhoto}
                alt={`${service.title} on site`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                bounce={false}
                objectPosition="center"
              />
            </div>
          ) : null}
        </Reveal>
      </section>

      <section className="bg-night py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              Included
            </p>
            <h2 className="mt-3 font-display text-3xl text-sand md:text-4xl">
              What you get
            </h2>
          </Reveal>
          <div className="include-grid mt-6 grid gap-3 sm:grid-cols-2">
            {service.points.map((point, i) => (
              <Reveal key={point} delay={i * 60} className="h-full">
                <article className="include-card group relative flex h-full items-start gap-3 overflow-hidden rounded-xl border border-sand/10 bg-coal/55 p-4 transition duration-300 sm:gap-4 sm:p-5">
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] bg-gold/70 transition group-hover:bg-gold"
                  />
                  <span className="shrink-0 font-display text-xl leading-none text-gold md:text-2xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-sand">
                    {point}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {groundPhotos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              On the ground
            </p>
            <h2 className="mt-3 font-display text-3xl text-sand sm:text-4xl">
              The look of the work
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:grid-cols-3">
            {groundPhotos.map((src, i) => (
              <Reveal key={src} delay={i * 90} className="h-full">
                <div className="media-frame relative overflow-hidden border border-sand/10 bg-night">
                  <CoverImage
                    src={src}
                    alt={`${service.title} photograph ${i + 1}`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    bounce={false}
                    objectPosition="center"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="bg-night py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
                    Also available
                  </p>
                  <h2 className="mt-3 font-display text-4xl text-sand">
                    Other coverage
                  </h2>
                </div>
                <Link
                  href="/services"
                  className="text-sm tracking-wide text-sand underline-offset-4 hover:text-olive hover:underline"
                >
                  View all services
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {others.map((item, i) => (
                <Reveal key={item.slug} delay={i * 80} className="h-full">
                  <Card3D>
                    <Link
                      href={`/services/${item.slug}`}
                      className="group flex h-full flex-col overflow-hidden border border-sand/10 bg-coal transition-colors duration-500 hover:border-olive/50"
                    >
                      <div className="media-frame relative overflow-hidden">
                        <CoverImage
                          src={item.image}
                          alt={item.title}
                          bounce={false}
                          objectPosition="center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-2xl text-sand">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-mist">
                          {item.short}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm tracking-wide text-olive">
                          Learn more
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </Link>
                  </Card3D>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-navy py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
              Ready to staff the post
            </p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
              Tell us the site. We will send a clear plan.
            </h2>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="btn-shine inline-flex shrink-0 items-center gap-2 bg-crimson px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition duration-300 hover:bg-crimson-dark"
          >
            Book this service
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
