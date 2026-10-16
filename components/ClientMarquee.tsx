import Image from "next/image";
import type { ClientLogo } from "@/lib/clients";

type Copy = { label: string; title: string; accent: string; text: string };

function Row({ logos, reverse }: { logos: ClientLogo[]; reverse?: boolean }) {
  const base = logos.length < 6 ? [...logos, ...logos, ...logos] : logos;
  const track = [...base, ...base];
  return (
    <div className="ops-logos-mask" dir="ltr">
      <div className={`ops-logos-row ${reverse ? "ops-logos-row-rev" : ""}`}>
        {track.map((logo, i) => (
          <div key={`${logo.src}-${i}`} className="ops-logo-tile" title={logo.name} aria-hidden={i >= base.length}>
            <Image
              src={logo.src}
              alt={i >= base.length ? "" : logo.name}
              width={168}
              height={68}
              className="max-h-11 w-auto max-w-full object-contain sm:max-h-12"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientMarquee({ logos, copy }: { logos: ClientLogo[]; copy: Copy }) {
  if (!logos.length) return null;

  const half = Math.ceil(logos.length / 2);
  const first = logos.length >= 8 ? logos.slice(0, half) : logos;
  const second = logos.length >= 8 ? logos.slice(half) : [...logos].reverse();

  return (
    <section className="ops-light relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="ops-eyebrow">{copy.label}</p>
        <h2 className="ops-h2 mx-auto mt-4 max-w-3xl">
          {copy.title} <span className="ops-accent">{copy.accent}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-[#3E4F61]">{copy.text}</p>
      </div>

      <div className="mt-12 space-y-4 sm:mt-14 sm:space-y-5">
        <Row logos={first} />
        <Row logos={second} reverse />
      </div>
    </section>
  );
}
