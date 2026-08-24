import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Reveal from "@/components/Reveal";
import { getAdminSession } from "@/lib/admin-guard";
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

  const photos = service.gallery;
  const others = (await getVisibleServices())
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-ink pt-[4.6rem]">
        <div className="mx-auto max-w-6xl px-6 py-6 md:py-8">
          <p className="mb-4 text-sm tracking-[0.22em] text-olive uppercase">
            <Link href="/services" className="hover:text-sand">
              Services
            </Link>
            <span className="mx-2 text-sand/30">/</span>
            {service.title}
          </p>
          <div className="relative aspect-[16/10] overflow-hidden bg-night md:aspect-[16/9]">
            <CoverImage
              src={service.image}
              alt={service.title}
              priority
              bounce={false}
              objectPosition={service.focus ?? "center 28%"}
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="animate-heroPan"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-10 md:pb-8">
              <p className="olive-label text-sm tracking-[0.3em] text-olive uppercase">
                Service
              </p>
              <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <Reveal motion="left">
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
            How we cover it
          </p>
          <h2 className="mt-3 font-display text-4xl text-sand">
            Built for the post, not a brochure.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sand/90">{service.summary}</p>
          <Link
            href="/contact"
            className="btn-shine mt-8 inline-flex items-center gap-2 bg-crimson px-6 py-3 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-crimson-dark"
          >
            Request this service
            <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Reveal delay={120} motion="right">
          <div className="group relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
            <CoverImage
              src={photos[0] || service.image}
              alt={`${service.title} on site`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              float="up"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <p className="absolute bottom-5 left-5 max-w-xs text-sm text-white">
              {service.short}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-night py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              Included
            </p>
            <h2 className="mt-3 font-display text-4xl text-sand">What you get</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {service.points.map((point, i) => (
              <Reveal key={point} delay={i * 70}>
                <article className="flex h-full gap-4 border border-sand/10 bg-coal/60 p-6 transition duration-500 hover:-translate-y-1 hover:border-olive/40">
                  <span className="font-display text-2xl text-crimson">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-sand">{point}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
              On the ground
            </p>
            <h2 className="mt-3 font-display text-4xl text-sand">
              The look of the work
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {photos.slice(0, 3).map((src, i) => (
              <Reveal key={src} delay={i * 90} className="h-full">
                <div className="group relative aspect-[4/5] overflow-hidden">
                  <CoverImage
                    src={src}
                    alt={`${service.title} photograph ${i + 1}`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    float={i % 2 === 0 ? "up" : "down"}
                    delay={i * 160}
                    objectPosition={
                      i === 0 ? service.focus ?? "center 32%" : "center 32%"
                    }
                  />
                  <div className="absolute inset-0 bg-ink/20 transition-opacity duration-500 group-hover:bg-ink/5" />
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
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden border border-sand/10 bg-coal transition-all duration-500 hover:-translate-y-1.5 hover:border-olive/50"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <CoverImage
                        src={item.image}
                        alt={item.title}
                        objectPosition={item.focus ?? "center 32%"}
                        float={i % 2 === 0 ? "up" : "down"}
                      />
                      <div className="absolute inset-0 bg-ink/30 transition-opacity duration-500 group-hover:bg-ink/10" />
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
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-crimson py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-sand/80 uppercase">
              Ready to staff the post
            </p>
            <h2 className="mt-2 font-display text-3xl text-sand md:text-4xl">
              Tell us the site. We will send a clear plan.
            </h2>
          </div>
          <Link
            href="/contact"
            className="btn-shine inline-flex shrink-0 items-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold tracking-wide text-crimson-dark transition duration-300 hover:bg-sand"
          >
            Speak with us
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
