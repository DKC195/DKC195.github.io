import type { MetadataRoute } from "next";
import { getProjects, getRecognition } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/experience/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/recognition/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact/`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy/`, changeFrequency: "yearly", priority: 0.3 }
  ];

  const projectRoutes: MetadataRoute.Sitemap = getProjects().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}/`,
    changeFrequency: "yearly",
    priority: 0.7
  }));

  const recognitionRoutes: MetadataRoute.Sitemap = getRecognition().map((item) => ({
    url: `${SITE_URL}/recognition/${item.slug}/`,
    changeFrequency: "yearly",
    priority: 0.6
  }));

  return [...staticRoutes, ...projectRoutes, ...recognitionRoutes];
}
