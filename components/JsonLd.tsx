import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function JsonLd() {
  const data = [organizationJsonLd(), websiteJsonLd()];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
