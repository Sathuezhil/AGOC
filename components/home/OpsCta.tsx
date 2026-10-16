import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import Reveal from "@/components/Reveal";
import type { HomeOps } from "@/lib/home-ops";
import { site } from "@/lib/site";

export default function OpsCta({
  copy,
  primaryHref = "#enquire",
}: {
  copy: HomeOps["cta"];
  primaryHref?: string;
}) {
  return (
    <section className="ops-light py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="ops-cta">
            <div className="ops-cta-glow" aria-hidden />
            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="ops-h2 text-white">
                {copy.title} <span className="ops-accent-dark">{copy.accent}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-white/80">{copy.text}</p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <LocaleLink href={primaryHref} className="ops-btn ops-btn-primary w-full sm:w-auto">
                  {copy.primary}
                  <ArrowRight size={17} className="rtl:rotate-180" />
                </LocaleLink>
                <a href={`tel:${site.phoneLinks[0]}`} className="ops-btn ops-btn-glass w-full sm:w-auto">
                  <Phone size={16} />
                  <span dir="ltr">{site.phones[0]}</span>
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ops-btn ops-btn-glass w-full sm:w-auto"
                >
                  <MessageCircle size={16} />
                  {copy.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
