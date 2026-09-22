import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/blog";

/**
 * Per-article social card.
 *
 * These matter more than the site-wide one: the articles are what gets posted
 * to LinkedIn, so an article link is the most-shared URL Medirevs has. A card
 * carrying the actual title reads as a publication; the same generic image on
 * every post reads as a template.
 */

export const alt = "An article from Medirevs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function ArticleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  const title = post?.title ?? "Medirevs";
  const category = post?.category ?? "Medirevs";
  const author = post?.author ?? "The Medirevs Team";

  // Long titles need to come down a step or they overflow the card.
  const titleSize = title.length > 58 ? 60 : title.length > 38 ? 68 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07100f",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            border: "1px solid rgba(40,157,144,0.28)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#27c030",
              display: "flex",
            }}
          />
          <div
            style={{
              color: "#14b8a6",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: titleSize,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 980,
            display: "flex",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 24 }}>{author}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 24, letterSpacing: 2 }}>
            medirevs.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
