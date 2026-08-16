import { ArticleCard, MEDIREVS_ASSETS } from "medirevs-v2";

// The three articles in /content/blog, with their real frontmatter. None of
// them set heroImage, which is the interesting case: ArticleCard draws a
// deterministic optical field from the slug instead, so every card differs.
const posts = [
  {
    slug: "the-cost-of-paper",
    title: "The real cost of a paper record",
    dek: "A folder in a filing room is not a cheap way to keep someone's history. It is an expensive one. The cost just gets paid somewhere other than the budget.",
    category: "Healthcare Systems",
    publishedAt: "2026-07-22",
    readingMinutes: 7,
  },
  {
    slug: "designing-for-the-network-you-have",
    title: "Designing for the network you actually have",
    dek: "Most health software assumes the connection is always there. Across much of the continent, that is the one thing you cannot assume.",
    category: "Digital Health",
    publishedAt: "2026-06-18",
    readingMinutes: 6,
  },
  {
    slug: "why-we-started-a-hardware-lab",
    title: "Why a software company started a hardware lab",
    dek: "Introducing Medirevs Labs and our first project, a low cost microscope built with a student team from the University of Ghana School of Engineering Sciences.",
    category: "Medirevs Labs",
    publishedAt: "2026-05-14",
    readingMinutes: 9,
  },
] as const;

/**
 * How the blog index lays them out at `default` size. The index itself is
 * `sm:grid-cols-2 lg:grid-cols-3`; the card stage is under `lg`, so the
 * three-up is asked for directly here rather than being silently reflowed
 * into a clipped second row.
 */
export const Grid = () => (
  <div className="grid gap-x-8 gap-y-14 sm:grid-cols-3">
    {posts.map((post) => (
      <ArticleCard key={post.slug} post={post as never} />
    ))}
  </div>
);

/** `size="large"` is the featured slot — 16/9 crop and the h2 type scale. */
export const Featured = () => (
  <div className="max-w-3xl">
    <ArticleCard post={posts[0] as never} size="large" />
  </div>
);

/**
 * With a hero image set, the generated field gives way to the photograph.
 * ArticleCard renders a plain <img>, not next/image, so the src has to be a
 * real URL — MEDIREVS_ASSETS carries /public as data URIs for exactly this.
 */
export const WithHeroImage = () => (
  <div className="max-w-md">
    <ArticleCard
      post={
        {
          ...posts[2],
          heroImage: MEDIREVS_ASSETS["/media/labs-objective-poster.jpg"],
          heroAlt: "A microscope objective on the Medirevs Labs bench",
        } as never
      }
    />
  </div>
);
