import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const site = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${base}/listings`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
  ];

  /* Try/catch so a sleeping Neon DB can never break `next build` */
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const properties = await prisma.property.findMany({
      select: { id: true, createdAt: true },
    });
    propertyRoutes = properties.map((p) => ({
      url: `${base}/property/${p.id}`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: p.createdAt,
    }));
  } catch {
    console.warn("[sitemap] DB unreachable — shipping static routes only.");
  }

  return [...staticRoutes, ...propertyRoutes];
}