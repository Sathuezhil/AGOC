import Link from "next/link";

export default function PageHero({
  eyebrow,
  title,
  text,
  secondaryHref = "/services",
  secondaryLabel = "View services",
}: {
  eyebrow: string;
  title: string;
  text: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-night pt-40 pb-20 md:pt-48">
      <div
        className="absolute inset-0 scale-105 opacity-55 animate-kenburns"
        style={{
          backgroundImage: "url(/images/city.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-vignette pointer-events-none absolute inset-0 opacity-80" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="hero-copy max-w-3xl">
          <p
            className="olive-label animate-fadeUp text-sm font-semibold tracking-[0.32em] text-olive uppercase opacity-0"
            style={{ animationDelay: "80ms" }}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-4 max-w-3xl animate-fadeUp font-display text-4xl leading-tight text-white opacity-0 md:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            {title}
          </h1>
          <p
            className="mt-5 max-w-2xl animate-fadeUp text-base leading-relaxed text-white/80 opacity-0 md:text-lg"
            style={{ animationDelay: "340ms" }}
          >
            {text}
          </p>
          <div
            className="mt-8 flex animate-fadeUp flex-wrap gap-3 opacity-0"
            style={{ animationDelay: "480ms" }}
          >
            <Link
              href="/contact"
              className="btn-shine bg-crimson px-6 py-3 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-crimson-dark"
            >
              Speak with us
            </Link>
            <Link
              href={secondaryHref}
              className="border border-white/35 px-6 py-3 text-sm font-medium tracking-wide text-white transition duration-300 hover:border-olive hover:text-olive"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
