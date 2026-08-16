import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { BLOG_CATEGORIES } from "./site";

/**
 * The content layer.
 *
 * To publish an article: drop a new `.mdx` file into /content/blog. The
 * frontmatter below is the whole contract — it is validated at build time, so
 * a typo fails loudly instead of rendering a broken page.
 *
 * The shape is deliberately CMS-like. Moving to a hosted CMS later means
 * replacing the two functions in this file, not the pages that use them.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  dek: z.string().min(1),
  category: z.enum(BLOG_CATEGORIES),
  author: z.string().min(1),
  authorRole: z.string().optional(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  heroCaption: z.string().optional(),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type Post = Frontmatter & {
  slug: string;
  body: string;
  readingMinutes: number;
};

function readingMinutes(body: string) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const posts = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);

      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/blog/${file}:\n` +
            parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n"),
        );
      }

      return {
        ...parsed.data,
        slug,
        body: content,
        readingMinutes: readingMinutes(content),
      } satisfies Post;
    })
    .filter((post) => !post.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  if (process.env.NODE_ENV === "production") cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getFeaturedPost(): Post | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    (post) => post.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getRelatedPosts(post: Post, limit = 2): Post[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  return [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}

export function getAdjacentPosts(post: Post) {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  return {
    // Posts are newest-first, so the "previous" article is the next index.
    previous: index >= 0 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined,
  };
}

export function categorySlug(category: string) {
  return category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
