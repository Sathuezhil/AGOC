import { ArrowRight, Mail, MapPin } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import Reveal from "@/components/Reveal";
import OpsPageHero from "@/components/ops/OpsPageHero";
import type { LegalDoc } from "@/lib/legal";
import { site } from "@/lib/site";

export default function OpsLegal({
  eyebrow,
  title,
  text,
  doc,
  updated,
  contents,
  other,
  contactLabel,
}: {
  eyebrow: string;
  title: string;
  text: string;
  doc: LegalDoc;
  updated: string;
  contents: string;
  other: { href: string; label: string };
  contactLabel: string;
}) {
  return (
    <>
      <OpsPageHero eyebrow={eyebrow} title={title} text={text} chips={[updated, site.legalName]} />

      <section className="ops-light pb-24 md:pb-32">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[15rem_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <nav className="ops-toc" aria-label={contents}>
              <p className="ops-mono text-[0.66rem] tracking-[0.2em] text-[#8593A3] uppercase rtl:tracking-normal">
                {contents}
              </p>
              <ol className="mt-4 space-y-1">
                {doc.sections.map((section, i) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="ops-toc-link">
                      <span className="ops-mono text-[0.7rem] text-[#0066FF]">{String(i + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-6 border-t border-[#E3E8EF] pt-5">
                <LocaleLink href={other.href} className="ops-toc-link">
                  {other.label}
                  <ArrowRight size={14} className="ms-auto rtl:rotate-180" />
                </LocaleLink>
              </div>
            </nav>
          </aside>

          <Reveal>
            <article className="ops-doc">
              <p className="text-[1.08rem] leading-relaxed text-[#2A3B4D]">{doc.intro}</p>

              <div className="mt-10 space-y-10">
                {doc.sections.map((section, i) => (
                  <section key={section.id} id={section.id} className="ops-doc-section scroll-mt-32">
                    <div className="flex items-baseline gap-4">
                      <span className="ops-step-num">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="text-[1.4rem] font-semibold tracking-[-0.015em] text-[#0B1F2A] md:text-[1.6rem]">
                        {section.title}
                      </h2>
                    </div>
                    <div className="mt-4 space-y-3 ps-14">
                      {section.body.map((para) => (
                        <p key={para} className="text-[1rem] leading-relaxed text-[#4A5A6B]">
                          {para}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="ops-doc-contact mt-12">
                <div className="min-w-0">
                  <h2 className="text-[1.2rem] font-semibold text-white">{doc.contactTitle}</h2>
                  <p className="mt-1.5 text-[0.95rem] text-white/70">{doc.contactText}</p>
                  <div className="mt-4 flex flex-col gap-2 text-[0.92rem] text-white/85 sm:flex-row sm:flex-wrap sm:gap-6">
                    <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition hover:text-white">
                      <Mail size={15} className="text-[#C9A227]" />
                      <span dir="ltr">{site.email}</span>
                    </a>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={15} className="shrink-0 text-[#C9A227]" />
                      {site.address}
                    </span>
                  </div>
                </div>
                <LocaleLink href="/contact" className="ops-btn ops-btn-primary shrink-0">
                  {contactLabel}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </LocaleLink>
              </div>

              <div className="mt-6 lg:hidden">
                <LocaleLink href={other.href} className="ops-btn ops-btn-ghost">
                  {other.label}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </LocaleLink>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
