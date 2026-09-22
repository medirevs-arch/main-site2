import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArticleCard } from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";
import WaitlistInline from "@/components/WaitlistInline";
import { Arrow } from "@/components/ui";
import {
  categorySlug,
  formatDate,
  getAdjacentPosts,
  getAllPosts,
  getPost,
  getRelatedPosts,
} from "@/lib/blog";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.heroImage ? [post.heroImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.dek,
      images: post.heroImage ? [post.heroImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const { previous, next } = getAdjacentPosts(post);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.dek,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    ...(post.heroImage ? { image: `${SITE.url}${post.heroImage}` } : {}),
  };

  return (
    <>
      <Reveal />

      <article>
        {/* Header */}
        <header className="shell pb-14 pt-40 sm:pt-48">
          <p className="label mb-8 flex flex-wrap items-center gap-3 text-slate">
            <Link
              href={`/blog/category/${categorySlug(post.category)}`}
              className="transition-colors hover:text-ink"
              style={{ color: "var(--color-brand)" }}
            >
              {post.category}
            </Link>
            <span className="text-mist">·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span className="text-mist">·</span>
            <span>{post.readingMinutes} min read</span>
          </p>

          <h1 className="h1 max-w-[20ch] text-balance">{post.title}</h1>
          <p className="lede mt-8 max-w-[58ch]">{post.dek}</p>

          <div className="mt-12 flex items-center gap-4 border-t border-line pt-6">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-brand)" }} />
            </span>
            <span>
              <span className="block text-[0.9375rem] font-medium text-ink">{post.author}</span>
              {post.authorRole && <span className="label block text-slate">{post.authorRole}</span>}
            </span>
          </div>
        </header>

        {/* Hero image */}
        {post.heroImage && (
          <figure className="shell mb-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.heroImage}
              alt={post.heroAlt ?? ""}
              className="w-full rounded-sm object-cover"
              loading="eager"
            />
            {post.heroCaption && (
              <figcaption className="label mt-4 text-slate">{post.heroCaption}</figcaption>
            )}
          </figure>
        )}

        {/* Body */}
        <div className="shell">
          <div className="prose measure">
            <MDXRemote
              source={post.body}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        </div>

        {/* Prev / next */}
        {(previous || next) && (
          <nav className="shell mt-24" aria-label="More articles">
            <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2">
              {previous ? (
                <Link href={`/blog/${previous.slug}`} className="group/link bg-page py-8 pr-6">
                  <span className="label mb-4 flex items-center gap-2 text-slate">
                    <Arrow className="rotate-180" /> Previous
                  </span>
                  <span className="block max-w-[30ch] text-lg font-medium leading-snug text-ink">
                    {previous.title}
                  </span>
                </Link>
              ) : (
                <span className="bg-page" />
              )}
              {next && (
                <Link href={`/blog/${next.slug}`} className="group/link bg-page py-8 sm:pl-8 sm:text-right">
                  <span className="label mb-4 flex items-center gap-2 text-slate sm:justify-end">
                    Next <Arrow />
                  </span>
                  <span className="block max-w-[30ch] text-lg font-medium leading-snug text-ink sm:ml-auto">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>

      {/* The waitlist sits here rather than at the foot of the page because
          these articles are where LinkedIn sends people, and the moment
          someone finishes reading one is the moment they are most willing to
          act. The newsletter stays at the bottom: a different, smaller ask. */}
      <aside className="shell mt-20">
        <div className="border-t border-line pt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <p className="label mb-4" style={{ color: "var(--color-brand)" }}>
                Waitlist
              </p>
              <p className="text-lg leading-snug tracking-[-0.015em] text-ink">
                We are opening access to what we are building, in stages.
              </p>
            </div>
            <WaitlistInline compact placement={`blog-${post.slug}`} />
          </div>
        </div>
      </aside>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24 bg-wash">
          <div className="shell band">
            <p className="label mb-12 text-slate">Related reading</p>
            <div className="grid gap-14 sm:grid-cols-2 lg:gap-x-12">
              {related.map((item) => (
                <ArticleCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-lab">
        <div className="shell band">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <div>
              <p className="label mb-6 text-white/40">Newsletter</p>
              <h2 className="h3 max-w-[22ch] text-white">
                Notes on building health technology in Africa.
              </h2>
            </div>
            <div className="lg:pt-10">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
