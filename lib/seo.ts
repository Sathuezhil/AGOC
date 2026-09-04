import type { Metadata } from "next";
import { site } from "./site";

/** Target search phrases for Dubai / UAE security. */
export const seoKeywords = [
  "AGOC security Dubai",
  "AGOC Security",
  "security company Dubai",
  "private guards UAE",
  "private security Dubai",
  "security guard services Dubai",
  "CCTV monitoring Dubai",
  "facility management Dubai",
  "housekeeping services Dubai",
  "event security Dubai",
  "licensed security guards UAE",
  "Al Muteena security company",
] as const;

export const defaultTitle = "AGOC Security Dubai";

export const defaultDescription =
  "AGOC Security — licensed private guards, CCTV control, facility and housekeeping services in Dubai and across the UAE. Trusted protection from Al Muteena, Dubai.";

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

/** Build consistent Metadata for public pages. */
export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [...seoKeywords],
  noIndex = false,
}: PageSeoInput): Metadata {
  const url = path === "/" ? site.url : `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
  const arPath = path === "/" || path === "" ? "/ar" : `/ar${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: url,
      languages: {
        en: url,
        ar: `${site.url}${arPath}`,
        "x-default": url,
      },
    },
  openGraph: {
    title: `${title} | AGOC Security Dubai`,
    description,
    url,
    siteName: site.name,
    locale: "en_AE",
    alternateLocale: ["ar_AE"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | AGOC Security Dubai`,
    description,
  },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "SecurityService"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}${site.url.endsWith("/") ? "" : ""}${brandLogoPath()}`,
    image: `${site.url}${brandLogoPath()}`,
    email: site.email,
    telephone: site.phones,
    slogan: site.tagline,
    description: defaultDescription,
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 315, Building Al Mulla 1, Al Muteena",
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.map.lat,
      longitude: site.map.lng,
    },
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    sameAs: [site.facebook, site.instagram, site.tiktok].filter(Boolean),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "17:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phones[0],
        contactType: "customer service",
        areaServed: "AE",
        availableLanguage: ["English", "Arabic"],
      },
    ],
    keywords: seoKeywords.join(", "),
  };
}

function brandLogoPath() {
  return encodeURI("/footer and admin logo.png");
}

export function serviceJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}) {
  const url = `${site.url}/services/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.title,
    description: input.description,
    url,
    provider: {
      "@id": `${site.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates",
    },
    serviceType: input.title,
    ...(input.image
      ? {
          image: input.image.startsWith("http")
            ? input.image
            : `${site.url}${input.image.startsWith("/") ? "" : "/"}${input.image}`,
        }
      : {}),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item:
        item.path === "/"
          ? site.url
          : `${site.url}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}
