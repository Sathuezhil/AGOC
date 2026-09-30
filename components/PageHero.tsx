import LocaleLink from "./LocaleLink";

export default function PageHero({
  eyebrow,
  title,
  text,
  primaryHref = "/contact",
  primaryLabel = "Speak with us",
  secondaryHref = "/services",
  secondaryLabel = "View services",
}: {
  eyebrow: string;
  title: string;
  text: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-night pt-36 pb-16 md:pt-44 md:pb-20">
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
      <div className="site-wrap relative">
        <div className="hero-copy measure">
          <p
            className="olive-label animate-fadeUp text-sm font-semibold tracking-[0.32em] text-olive uppercase opacity-0 rtl:tracking-normal rtl:normal-case"
            style={{ animationDelay: "80ms" }}
          >
            {eyebrow}
          </p>
          <h1
            className="type-page mt-4 animate-fadeUp text-white opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            {title}
          </h1>
          <p
            className="type-body mt-5 animate-fadeUp text-white/85 opacity-0"
            style={{ animationDelay: "340ms" }}
          >
            {text}
          </p>
          <div
            className="mt-8 flex animate-fadeUp flex-wrap gap-3 opacity-0"
            style={{ animationDelay: "480ms" }}
          >
            <LocaleLink
              href={primaryHref}
              className="btn-shine bg-crimson px-6 py-3 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-crimson-dark"
            >
              {primaryLabel}
            </LocaleLink>
            <LocaleLink
              href={secondaryHref}
              className="border border-white/35 px-6 py-3 text-sm font-medium tracking-wide text-white transition duration-300 hover:border-olive hover:text-olive"
            >
              {secondaryLabel}
            </LocaleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
