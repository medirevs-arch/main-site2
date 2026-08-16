import Link from "next/link";
import type { Post } from "@/lib/blog";
import { formatDate } from "@/lib/blog";

/**
 * Editorial thumbnail. When a post has no hero image we draw a deterministic
 * optical field from the slug instead of shipping a placeholder photograph.
 */
function GeneratedThumb({ seed, className = "" }: { seed: string; className?: string }) {
  const n = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rings = 3 + (n % 3);
  const offsetX = 30 + (n % 40);
  const offsetY = 30 + ((n >> 2) % 40);

  return (
    <svg
      viewBox="0 0 400 260"
      // slice + an oversized backdrop so the field always fills the frame,
      // whatever aspect ratio the card is using.
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect x="-300" y="-300" width="1000" height="860" fill="var(--color-lab)" />
      <g stroke="var(--color-brand-bright)" opacity="0.45">
        {Array.from({ length: rings }).map((_, i) => (
          <circle
            key={i}
            cx={offsetX + i * 34 + 140}
            cy={offsetY + 60}
            r={38 + i * 26}
            strokeWidth="0.75"
          />
        ))}
      </g>
      <g stroke="var(--color-optic)" opacity="0.3" strokeWidth="0.6">
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1="0" y1={30 + i * 40} x2="400" y2={30 + i * 40 - 20} />
        ))}
      </g>
    </svg>
  );
}

export function ArticleCard({ post, size = "default" }: { post: Post; size?: "default" | "large" }) {
  const large = size === "large";

  return (
    <article className="group/link">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative overflow-hidden rounded-sm bg-paper">
          {post.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.heroImage}
              alt={post.heroAlt ?? ""}
              className={`w-full object-cover transition-transform duration-[900ms] ease-out group-hover/link:scale-[1.02] ${
                large ? "aspect-[16/9]" : "aspect-[3/2]"
              }`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <GeneratedThumb
              seed={post.slug}
              className={`w-full transition-transform duration-[900ms] ease-out group-hover/link:scale-[1.02] ${
                large ? "aspect-[16/9]" : "aspect-[3/2]"
              }`}
            />
          )}
        </div>

        <p className="label mt-6 flex flex-wrap items-center gap-3 text-charcoal/70">
          <span style={{ color: "var(--color-brand)" }}>{post.category}</span>
          <span className="text-mist">·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="text-mist">·</span>
          <span>{post.readingMinutes} min read</span>
        </p>

        <h3 className={`mt-4 text-balance font-medium tracking-[-0.02em] text-ink ${large ? "h2" : "h3"}`}>
          <span className="relative">
            {post.title}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
          </span>
        </h3>

        <p className={`mt-4 leading-relaxed text-charcoal ${large ? "lede max-w-[54ch]" : "max-w-[46ch] text-[0.9375rem]"}`}>
          {post.dek}
        </p>
      </Link>
    </article>
  );
}

export function ArticleRow({ post }: { post: Post }) {
  return (
    <article className="group/link border-t border-line">
      <Link href={`/blog/${post.slug}`} className="flex items-baseline gap-6 py-7">
        <span className="label hidden w-40 shrink-0 text-brand-dark sm:block">{post.category}</span>
        <span className="flex-1">
          <span className="block text-lg font-medium leading-snug tracking-[-0.015em] text-ink">
            {post.title}
          </span>
          <span className="label mt-2 block text-slate sm:hidden">{post.category}</span>
        </span>
        <span className="label hidden shrink-0 text-slate md:block">
          {post.readingMinutes} min
        </span>
      </Link>
    </article>
  );
}
