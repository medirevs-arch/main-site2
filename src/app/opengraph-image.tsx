import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * The default social preview card.
 *
 * `layout.tsx` has declared `summary_large_image` and six pages have declared
 * `openGraph` since the rebuild started, but no image ever existed — so every
 * link posted to LinkedIn or WhatsApp, which is how this site is actually
 * discovered, rendered as grey text with no picture.
 *
 * Drawn rather than shipped as a file so it stays in step with the brand
 * colours and never goes stale against the copy.
 */

export const alt = "Medirevs — healthcare software built for the way care works in Africa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        {/* Optical field, echoing the aperture motif used across the site. */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: "50%",
            border: "1px solid rgba(40,157,144,0.35)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: "1px solid rgba(40,157,144,0.22)",
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
              color: "rgba(255,255,255,0.55)",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Medirevs — Accra, Ghana
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: -2.5,
              maxWidth: 900,
              display: "flex",
            }}
          >
            Healthcare breaks at the handovers.
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.62)",
              fontSize: 30,
              lineHeight: 1.4,
              maxWidth: 780,
              display: "flex",
            }}
          >
            {SITE.description}
          </div>
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
          <div style={{ color: "#14b8a6", fontSize: 24, letterSpacing: 2 }}>medirevs.com</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 24 }}>{SITE.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
