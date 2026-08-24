import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/hizmetler", priority: 0.9 },
    { path: "/projeler", priority: 0.9 },
    { path: "/surec", priority: 0.7 },
    { path: "/hakkimizda", priority: 0.7 },
    { path: "/sss", priority: 0.6 },
    { path: "/teklif-al", priority: 0.9 },
    { path: "/iletisim", priority: 0.8 },
  ].map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${site.url}/hizmetler/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${site.url}/projeler/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
