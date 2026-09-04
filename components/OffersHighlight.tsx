import LocaleLink from "@/components/LocaleLink";
import Reveal from "@/components/Reveal";
import type { Offer } from "@/lib/offers";

function OfferCta({
  offer,
  className,
}: {
  offer: Offer;
  className: string;
}) {
  const href = offer.ctaHref?.startsWith("http")
    ? offer.ctaHref
    : offer.ctaHref || "#enquire";
  const isExternal = href.startsWith("http");
  const isHash = href.startsWith("#");
  const label = offer.ctaLabel || "Book now";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    );
  }
  if (isHash) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <LocaleLink href={href} className={className}>
      {label}
    </LocaleLink>
  );
}

/** Crimson offer % / badge for overlaying on service images. */
export function ServiceOfferBadge({
  badge,
  className = "",
}: {
  badge: string;
  className?: string;
}) {
  if (!badge.trim()) return null;
  return (
    <span
      className={`offer-badge absolute start-3 top-3 z-[2] inline-flex max-w-[88%] items-center rounded-md bg-crimson px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase shadow-lg shadow-crimson/35 sm:start-4 sm:top-4 sm:px-3 sm:text-[11px] rtl:tracking-normal rtl:normal-case ${className}`}
    >
      {badge}
    </span>
  );
}

export default function OffersHighlight({
  offers,
  label,
  title,
  viewServiceLabel,
  compact = false,
}: {
  offers: Offer[];
  label: string;
  title: string;
  viewServiceLabel?: string;
  compact?: boolean;
}) {
  if (offers.length === 0) return null;

  return (
    <section
      id={compact ? undefined : "offers"}
      className={`offers-highlight relative scroll-mt-28 overflow-hidden ${
        compact ? "py-12 sm:py-14" : "py-20 md:py-24"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="offers-glow offers-glow-a" />
        <div className="offers-glow offers-glow-b" />
        <div className="offers-stripe" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <span className="offers-kicker inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase rtl:tracking-normal rtl:normal-case">
            <span className="offers-kicker-dot h-1.5 w-1.5 rounded-full bg-gold" />
            {label}
          </span>
          <h2
            className={`mt-4 font-display text-sand ${
              compact ? "text-3xl sm:text-4xl" : "text-4xl md:text-5xl"
            }`}
          >
            {title}
          </h2>
        </Reveal>

        <div
          className={`mt-8 grid gap-4 ${
            offers.length === 1
              ? "max-w-sm"
              : offers.length === 2
                ? "max-w-2xl sm:grid-cols-2"
                : "max-w-4xl sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 70}>
              <article className="offer-card group relative flex h-auto flex-col overflow-hidden rounded-2xl border border-gold/30 bg-coal/85 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.32)] transition duration-500 hover:border-gold/55 hover:shadow-[0_24px_52px_rgba(201,162,39,0.16)] sm:p-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 start-0 w-[3px] bg-gradient-to-b from-gold via-crimson to-transparent opacity-80" />

                {offer.badge ? (
                  <span className="offer-badge inline-flex w-fit rounded-md bg-crimson px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase shadow-md shadow-crimson/30 rtl:tracking-normal rtl:normal-case">
                    {offer.badge}
                  </span>
                ) : null}

                <h3 className="mt-3 font-display text-xl text-sand sm:text-2xl">
                  {offer.title}
                </h3>

                {!compact && offer.serviceSlug && viewServiceLabel ? (
                  <LocaleLink
                    href={`/services/${offer.serviceSlug}`}
                    className="mt-1.5 inline-flex w-fit text-[11px] tracking-[0.16em] text-olive uppercase transition hover:text-gold rtl:tracking-normal rtl:normal-case"
                  >
                    {viewServiceLabel}
                  </LocaleLink>
                ) : null}

                {(offer.description || offer.summary) && (
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    {offer.description || offer.summary}
                  </p>
                )}

                <OfferCta
                  offer={offer}
                  className="btn-shine mt-4 inline-flex w-full items-center justify-center rounded-lg bg-crimson px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-crimson-dark sm:w-auto rtl:tracking-normal rtl:normal-case"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
