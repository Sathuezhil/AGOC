import { ArrowRight } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import OpsServiceCard, { type OpsServiceCardData } from "@/components/ops/OpsServiceCard";

export default function OpsServiceTrack({
  label,
  title,
  accent,
  services,
  total,
  allLabel,
  learnMore,
  book,
}: {
  label: string;
  title: string;
  accent: string;
  services: OpsServiceCardData[];
  total: number;
  allLabel: string;
  learnMore: string;
  book: string;
}) {
  return (
    <section data-hx-scene className="ops-light ops-hx relative">
      <div className="ops-hx-stage">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="ops-eyebrow">{label}</p>
              <h2 className="ops-h2 mt-4 max-w-2xl">
                {title} <span className="ops-accent">{accent}</span>
              </h2>
            </div>
            <LocaleLink href="/services" className="ops-btn ops-btn-ghost self-start md:self-auto">
              {allLabel}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </LocaleLink>
          </div>
        </div>

        <div data-hx className="ops-hx-track">
          {services.map((service, i) => (
            <div key={service.slug} className="ops-hx-item">
              <OpsServiceCard service={service} index={i} learnMore={learnMore} book={book} />
            </div>
          ))}
          <LocaleLink href="/services" className="ops-hx-item ops-hx-end group">
            <span className="ops-mono text-[0.7rem] tracking-[0.2em] text-[#e0c35a] uppercase rtl:tracking-normal">
              {String(total).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="mt-auto block text-[1.9rem] font-bold leading-[1.1] tracking-[-0.03em] text-white">
              {allLabel}
            </span>
            <span className="ops-round-btn mt-6 bg-white text-[#0B1F2A] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <ArrowRight size={20} className="rtl:rotate-180" />
            </span>
          </LocaleLink>
        </div>

        <div className="mx-auto hidden w-full max-w-6xl items-center gap-4 px-5 lg:flex">
          <span className="ops-mono text-[0.7rem] text-[#5B6B7C]">01</span>
          <div className="ops-hx-bar">
            <span />
          </div>
          <span className="ops-mono text-[0.7rem] text-[#5B6B7C]">{String(total).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
