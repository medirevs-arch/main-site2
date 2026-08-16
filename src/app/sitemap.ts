import type { MetadataRoute } from "next";
import { categorySlug, getAllPosts } from "@/lib/blog";
import { PRODUCTS, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  const routes = [
    { url: "/", priority: 1, changeFrequency: "monthly" as const },
    { url: "/products", priority: 0.9, changeFrequency: "monthly" as const },
    ...PRODUCTS.map((product) => ({
      url: product.href,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
    { url: "/labs", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/labs/low-cost-microscope", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/mission", priority: 0.7, changeFrequency: "yearly" as const },
    { url: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
    { url: "/demo", priority: 0.7, changeFrequency: "yearly" as const },
    { url: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { url: "/legal/terms", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    ...route,
    url: `${SITE.url}${route.url}`,
    lastModified: now,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = [
    ...new Set(posts.map((post) => post.category)),
  ].map((category) => ({
    url: `${SITE.url}/blog/category/${categorySlug(category)}`,
    lastModified: now,
    priority: 0.5,
    changeFrequency: "weekly" as const,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
    priority: 0.7,
    changeFrequency: "yearly" as const,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
