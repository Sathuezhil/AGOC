import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getVisibleServices } from "@/lib/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["", "/about", "/services", "/contact", "/privacy", "/terms"];
  const now = new Date();
  const live = await getVisibleServices();

  return [
    ...paths.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
    })),
    ...live.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified: now,
    })),
  ];
}
