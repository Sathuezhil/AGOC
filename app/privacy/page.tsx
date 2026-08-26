import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "What we collect",
    body: "Name, email, phone number, service interest, and the message you submit through this website. If we work together, we may also hold site details, access lists, and operational reports as required by the contract and UAE law.",
  },
  {
    title: "How we use it",
    body: "To reply to you, prepare proposals, staff a post, and meet legal and licensing obligations. We do not sell personal data.",
  },
  {
    title: "How we protect it",
    body: "Access to enquiry and client information is limited to people who need it for operations. We keep records only as long as needed for service delivery, disputes, and legal requirements.",
  },
  {
    title: "Your choices",
    body: "You may ask us to update or remove enquiry details that are no longer needed, subject to any lawful retention duties. Contact us using the details below.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        text="How AGOC Security handles the information you share with us."
      />

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <Reveal>
          <article className="legal-doc rounded-2xl border border-sand/10 bg-night/40 p-7 md:p-10">
            <p className="text-sm leading-relaxed text-mist md:text-base">
              AGOC General Security Guard Services LLC (“AGOC”, “we”) collects
              only what is needed to respond to enquiries and to deliver
              contracted security services across Dubai and the UAE.
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
              <h2 className="font-display text-2xl text-sand">Contact</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Privacy questions:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-olive transition hover:text-crimson"
                >
                  {site.email}
                </a>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {site.address}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/terms"
                className="inline-flex rounded-lg border border-sand/20 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-sand uppercase transition hover:border-olive/50 hover:text-olive"
              >
                Terms of service
              </Link>
              <Link
                href="/contact"
                className="btn-shine inline-flex rounded-lg bg-crimson px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-white uppercase transition hover:bg-crimson-dark"
              >
                Contact us
              </Link>
            </div>
          </article>
        </Reveal>
      </section>
    </>
  );
}
