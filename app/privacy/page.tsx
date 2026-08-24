import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        text="How AGOC Security handles the information you share with us."
      />
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-sm leading-relaxed text-mist">
        <p>
          AGOC General Security Guard Services LLC (“AGOC”, “we”) collects only
          what is needed to respond to enquiries and to deliver contracted
          security services.
        </p>
        <h2 className="font-display text-2xl text-white">What we collect</h2>
        <p>
          Name, email, phone number, service interest, and the message you
          submit through this website. If we work together, we may also hold
          site details, access lists, and operational reports as required by
          the contract and UAE law.
        </p>
        <h2 className="font-display text-2xl text-white">How we use it</h2>
        <p>
          To reply to you, prepare proposals, staff a post, and meet legal and
          licensing obligations. We do not sell personal data.
        </p>
        <h2 className="font-display text-2xl text-white">Contact</h2>
        <p>
          Questions: {site.email} · {site.address}
        </p>
      </article>
    </>
  );
}
