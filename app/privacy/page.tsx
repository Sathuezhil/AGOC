import type { Metadata } from "next";
import OpsLegal from "@/components/ops/OpsLegal";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { getLegalDoc } from "@/lib/legal";
import { getPagesOps } from "@/lib/pages-ops";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How AGOC Security Dubai collects, uses and protects personal data from enquiries, clients and job applicants.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = getPagesOps(locale);

  return (
    <OpsLegal
      eyebrow={dict.privacy.eyebrow}
      title={dict.privacy.title}
      text={dict.privacy.text}
      doc={getLegalDoc("privacy", locale)}
      updated={p.legal.updated}
      contents={p.legal.contents}
      other={{ href: "/terms", label: dict.terms.title }}
      contactLabel={dict.hero.contactUs}
    />
  );
}
