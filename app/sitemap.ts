import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getVisibleServices } from "@/lib/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];
  const now = new Date();
  const live = await getVisibleServices();

  const enPages = paths.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${site.url}${path || "/"}`,
        ar: `${site.url}/ar${path || ""}`,
      },
    },
  }));

  const arPages = paths.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}/ar${path || ""}`,
    lastModified: now,
    changeFrequency,
    priority: Math.max(0.2, priority - 0.05),
    alternates: {
      languages: {
        en: `${site.url}${path || "/"}`,
        ar: `${site.url}/ar${path || ""}`,
      },
    },
  }));

  const servicePages = live.flatMap((service) => [
    {
      url: `${site.url}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: {
        languages: {
          en: `${site.url}/services/${service.slug}`,
          ar: `${site.url}/ar/services/${service.slug}`,
        },
      },
    },
    {
      url: `${site.url}/ar/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${site.url}/services/${service.slug}`,
          ar: `${site.url}/ar/services/${service.slug}`,
        },
      },
    },
  ]);

  return [...enPages, ...arPages, ...servicePages];
}
