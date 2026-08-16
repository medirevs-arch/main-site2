import { ArticleRow } from "medirevs-v2";

// Real frontmatter from /content/blog.
const posts = [
  {
    slug: "the-cost-of-paper",
    title: "The real cost of a paper record",
    category: "Healthcare Systems",
    readingMinutes: 7,
  },
  {
    slug: "designing-for-the-network-you-have",
    title: "Designing for the network you actually have",
    category: "Digital Health",
    readingMinutes: 6,
  },
  {
    slug: "why-we-started-a-hardware-lab",
    title: "Why a software company started a hardware lab",
    category: "Medirevs Labs",
    readingMinutes: 9,
  },
] as const;

/**
 * The compact index form. Each row draws its own top rule, so a stacked list
 * needs no separators of its own — this is how the blog archive reads.
 */
export const List = () => (
  <div className="max-w-4xl">
    {posts.map((post) => (
      <ArticleRow key={post.slug} post={post as never} />
    ))}
  </div>
);

/** A single row, to show the three-column baseline alignment on its own. */
export const Single = () => (
  <div className="max-w-4xl">
    <ArticleRow post={posts[1] as never} />
  </div>
);
