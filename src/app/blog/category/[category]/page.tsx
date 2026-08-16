import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { categorySlug, getAllPosts } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/site";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ category: categorySlug(category) }));
}

function resolveCategory(slug: string) {
  return BLOG_CATEGORIES.find((category) => categorySlug(category) === slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: slug } = await params;
  const category = resolveCategory(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: `${category} | Blog`,
    description: `Articles from the Medirevs team on ${category.toLowerCase()}.`,
    alternates: { canonical: `/blog/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const category = resolveCategory(slug);
  if (!category) notFound();

  const posts = getAllPosts().filter((post) => post.category === category);
  const usedCategories = new Set(getAllPosts().map((post) => post.category));

  return (
    <>
      <Reveal />

      <PageHero
        kicker="Blog"
        title={category}
        lede={`Articles from the Medirevs team on ${category.toLowerCase()}.`}
      />

      <nav className="rule" aria-label="Article categories">
        <div className="shell flex flex-wrap gap-x-8 gap-y-3 py-6">
          <Link href="/blog" className="label text-slate transition-colors hover:text-ink">
            All
          </Link>
          {BLOG_CATEGORIES.filter((item) => usedCategories.has(item)).map((item) => (
            <Link
              key={item}
              href={`/blog/category/${categorySlug(item)}`}
              className={`label transition-colors hover:text-ink ${
                item === category ? "text-ink" : "text-slate"
              }`}
              aria-current={item === category ? "page" : undefined}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      <section className="rule">
        <div className="shell band">
          {posts.length === 0 ? (
            <p className="lede text-slate">No articles in this category yet.</p>
          ) : (
            <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
              {posts.map((post, index) => (
                <div
                  key={post.slug}
                  data-reveal="rise"
                  style={{ ["--delay" as string]: `${index * 70}ms` }}
                >
                  <ArticleCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
