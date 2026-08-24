import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of service"
        text="The conditions that apply when you use this website or engage AGOC Security."
      />
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-sm leading-relaxed text-mist">
        <p>
          This website is provided by {site.legalName} for information and
          enquiry only. Security services are delivered under a separate written
          agreement.
        </p>
        <h2 className="font-display text-2xl text-white">Use of the site</h2>
        <p>
          You may browse and submit a genuine enquiry. Do not misuse forms,
          attempt to disrupt the site, or scrape content for competing use.
        </p>
        <h2 className="font-display text-2xl text-white">Liability</h2>
        <p>
          Website content is general. It is not a quote, a guarantee of
          availability, or professional advice for a specific site. Operational
          terms are set out in the service contract.
        </p>
        <h2 className="font-display text-2xl text-white">Governing law</h2>
        <p>These terms are governed by the laws of the United Arab Emirates.</p>
      </article>
    </>
  );
}
