import type { Metadata } from "next";
import LocaleLink from "@/components/LocaleLink";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  {
    title: "Use of the site",
    body: "You may browse and submit a genuine enquiry. Do not misuse forms, attempt to disrupt the site, or scrape content for competing use.",
  },
  {
    title: "Enquiries and proposals",
    body: "Submitting a form does not create a contract. Any proposal, roster, or coverage commitment is confirmed only in a written service agreement.",
  },
  {
    title: "Liability",
    body: "Website content is general. It is not a quote, a guarantee of availability, or professional advice for a specific site. Operational terms are set out in the service contract.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of the United Arab Emirates. Disputes relating to this website are subject to the competent courts in Dubai, unless a separate contract says otherwise.",
  },
];

export default async function TermsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.terms.eyebrow}
        title={dict.terms.title}
        text={dict.terms.text}
        primaryLabel={dict.hero.speakWithUs}
        secondaryLabel={dict.servicesList.viewServices}
      />

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <Reveal>
          <article className="legal-doc rounded-2xl border border-sand/10 bg-night/40 p-7 md:p-10">
            <p className="text-sm leading-relaxed text-mist md:text-base">
              This website is provided by {site.legalName} for information and
              enquiry only. Security services are delivered under a separate
              written agreement.
            </p>

            <div className="mt-10 space-y-8">
              {sections.map((section, i) => (
                <section key={section.title}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="font-display text-lg text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl text-sand md:text-3xl">
                      {section.title}
                    </h2>
                  </div>
                  <div className="h-px w-12 bg-gold/70" />
                  <p className="mt-4 text-sm leading-relaxed text-mist md:text-[0.95rem]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-sand/10 bg-ink/40 p-5 md:p-6">
              <h2 className="font-display text-2xl text-sand">Questions</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Reach us at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-olive transition hover:text-crimson"
                >
                  {site.email}
                </a>{" "}
                or visit {site.address}.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <LocaleLink
                href="/privacy"
                className="inline-flex rounded-lg border border-sand/20 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-sand uppercase transition hover:border-olive/50 hover:text-olive rtl:tracking-normal rtl:normal-case"
              >
                {dict.privacy.title}
              </LocaleLink>
              <LocaleLink
                href="/contact"
                className="btn-shine inline-flex rounded-lg bg-crimson px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-white uppercase transition hover:bg-crimson-dark rtl:tracking-normal rtl:normal-case"
              >
                {dict.hero.contactUs}
              </LocaleLink>
            </div>
          </article>
        </Reveal>
      </section>
    </>
  );
}
