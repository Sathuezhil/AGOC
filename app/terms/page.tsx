import type { Metadata } from "next";
import OpsLegal from "@/components/ops/OpsLegal";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { getLegalDoc } from "@/lib/legal";
import { getPagesOps } from "@/lib/pages-ops";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms for using the AGOC Security Dubai website, sending enquiries and receiving security service proposals in the UAE.",
  path: "/terms",
});

export default async function TermsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = getPagesOps(locale);

  return (
    <OpsLegal
      eyebrow={dict.terms.eyebrow}
      title={dict.terms.title}
      text={dict.terms.text}
      doc={getLegalDoc("terms", locale)}
      updated={p.legal.updated}
      contents={p.legal.contents}
      other={{ href: "/privacy", label: dict.privacy.title }}
      contactLabel={dict.hero.contactUs}
    />
  );
}
