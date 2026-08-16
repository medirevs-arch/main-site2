import { Hero } from "medirevs-v2";

/**
 * The homepage hero for the clinical build: the optical field loop under a
 * two-layer scrim, with the display headline and the CTA pair sitting on the
 * bottom edge. It takes no props — the copy and the Accra dateline come from
 * CONTACT in src/lib/site.ts.
 *
 * The card shows the poster frame, not the loop: VideoBackground checks
 * prefers-reduced-motion before pulling media, and preview cards report it.
 */
export const Default = () => <Hero />;
