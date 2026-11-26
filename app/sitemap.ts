import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://nexora.app/customers", changeFrequency: "weekly", priority: 0.8 }];
}
