import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, ArticleRow } from "@/components/ArticleCard";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getAllPosts, getFeaturedPost, categorySlug } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "What the Medirevs team is learning about digital health, clinical systems, health data and the work of Medirevs Labs.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const rest = posts.filter((post) => post.slug !== featured?.slug);
  const usedCategories = new Set(posts.map((post) => post.category));

  return (
    <>
      <Reveal />

      <PageHero
        kicker="Blog"
        title="Notes on building health technology."
        lede="What we are learning about digital health, clinical systems, health data and the work going on in Medirevs Labs."
      />

      {/* Categories */}
      <nav className="rule" aria-label="Article categories">
        <div className="shell flex flex-wrap gap-x-8 gap-y-3 py-6">
          <span className="label text-ink">All</span>
          {BLOG_CATEGORIES.filter((category) => usedCategories.has(category)).map((category) => (
            <Link
              key={category}
              href={`/blog/category/${categorySlug(category)}`}
              className="label text-slate transition-colors hover:text-ink"
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>

      {posts.length === 0 ? (
        <section className="rule">
          <div className="shell band">
            <p className="lede text-slate">No articles published yet.</p>
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section className="rule">
              <div className="shell band">
                <p className="label mb-10 text-slate">Featured</p>
                <div data-reveal="rise">
                  <ArticleCard post={featured} size="large" />
                </div>
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="rule bg-wash">
              <div className="shell band">
                <p className="label mb-12 text-slate">Latest</p>
                <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
                  {rest.map((post, index) => (
                    <div
                      key={post.slug}
                      data-reveal="rise"
                      style={{ ["--delay" as string]: `${index * 70}ms` }}
                    >
                      <ArticleCard post={post} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="rule">
            <div className="shell band">
              <p className="label mb-8 text-slate">Index</p>
              <div>
                {posts.map((post) => (
                  <ArticleRow key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
