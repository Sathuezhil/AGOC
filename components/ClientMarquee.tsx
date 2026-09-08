import Image from "next/image";
import type { ClientLogo } from "@/lib/clients";

export default function ClientMarquee({ logos }: { logos: ClientLogo[] }) {
  if (!logos.length) return null;

  const base =
    logos.length < 6 ? [...logos, ...logos, ...logos] : [...logos, ...logos];
  const track = [...base, ...base];

  return (
    <section className="clients-marquee relative overflow-hidden border-y border-sand/10 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 clients-marquee-glow" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="olive-label mx-auto text-sm font-semibold tracking-[0.3em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
          Trusted by
        </p>
        <h2 className="mt-3 font-display text-3xl text-sand sm:text-4xl">
          Our clients
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-mist" dir="auto">
          Organisations across Dubai and the UAE that rely on AGOC every day.
        </p>
      </div>

      {/* Force LTR so the scroll animation stays visible in Arabic (RTL) pages */}
      <div
        className="clients-marquee-mask relative mt-9 overflow-hidden sm:mt-11"
        dir="ltr"
      >
        <div className="clients-marquee-track flex w-max items-center gap-4 sm:gap-6">
          {track.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="clients-marquee-item group relative flex h-[4.75rem] w-[10rem] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white px-4 py-3 sm:h-[5.25rem] sm:w-[11.5rem]"
              title={logo.name}
            >
              <span className="clients-marquee-shine pointer-events-none absolute inset-0" />
              <Image
                src={logo.src}
                alt={logo.name}
                width={168}
                height={68}
                className="relative z-[1] max-h-12 w-auto max-w-full object-contain transition duration-500 group-hover:scale-105 sm:max-h-[3.4rem]"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
