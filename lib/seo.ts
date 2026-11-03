import type { Metadata } from "next";
import { site } from "./site";

/** Target search phrases for Dubai / UAE security. Primary query first. */
export const seoKeywords = [
  "dubai security company",
  "security company Dubai",
  "security company in Dubai",
  "licensed security company Dubai",
  "best security company in Dubai",
  "AGOC security Dubai",
  "AGOC Security",
  "private security Dubai",
  "security guard services Dubai",
  "SIRA licensed security Dubai",
  "CCTV monitoring Dubai",
  "event security Dubai",
  "facility management Dubai",
  "housekeeping services Dubai",
  "licensed security guards UAE",
  "Al Muteena security company",
] as const;

export const defaultTitle =
  "Dubai Security Company | Licensed Guards & CCTV | AGOC";

export const defaultDescription =
  "AGOC is a licensed Dubai security company providing security guards, CCTV monitoring, event security and facility management across the UAE. SIRA licence 1308900. Based in Al Muteena, Dubai.";

export const defaultOgImage = {
  url: "/images/security-guards.png",
  width: 1200,
  height: 630,
  alt: "AGOC Dubai security company — licensed security guards on duty",
} as const;

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  locale?: "en" | "ar";
};

/** Build consistent Metadata for public pages. */
export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [...seoKeywords],
  noIndex = false,
  locale = "en",
}: PageSeoInput): Metadata {
  const enUrl = path === "/" ? site.url : `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
  const arPath = path === "/" || path === "" ? "/ar" : `/ar${path.startsWith("/") ? path : `/${path}`}`;
  const arUrl = `${site.url}${arPath}`;
  const url = locale === "ar" ? arUrl : enUrl;

  const ogTitle = title.includes("AGOC") ? title : `${title} | AGOC Security Dubai`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: url,
      languages: {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: site.name,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: ["ar_AE"],
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [defaultOgImage.url],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: ["en-AE", "ar-AE"],
    publisher: { "@id": `${site.url}/#organization` },
    description: defaultDescription,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}${brandLogoPath()}`,
    image: `${site.url}${brandLogoPath()}`,
    email: site.email,
    telephone: site.phones,
    slogan: site.tagline,
    description: defaultDescription,
    priceRange: "$$",
    currenciesAccepted: "AED",
    paymentAccepted: "Bank transfer, Cash, Cheque",
    identifier: {
      "@type": "PropertyValue",
      name: "SIRA Licence",
      value: "1308900",
    },
    knowsAbout: [
      "Dubai security company services",
      "Security guard services",
      "CCTV monitoring",
      "Event security",
      "Facility management",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dubai security company services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private guarding services in Dubai" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lady security guard services in Dubai" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "CCTV control and monitoring in Dubai" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Event security and club bouncers in Dubai" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Facility management in Dubai" } },
      ],
    },
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
      { "@type": "AdministrativeArea", name: "Deira" },
      { "@type": "AdministrativeArea", name: "Al Muteena" },
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
    parentOrganization: {
      "@type": "Organization",
      name: site.legalName,
    },
  };
}

function brandLogoPath() {
  return "/footer-admin-logo.png";
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
