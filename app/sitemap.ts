import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/services", "/contact", "/privacy", "/terms"];
  const now = new Date();

  return [
    ...paths.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
    })),
    ...services.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified: now,
    })),
  ];
}
