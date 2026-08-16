import { Button } from "medirevs-v2";

/** The pairing the site uses to close a section: one solid, one outline. */
export const Primary = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button href="/demo">Request a demo</Button>
    <Button href="/products" variant="outline">
      See the products
    </Button>
  </div>
);

/**
 * `ghost` and `light` exist for dark bands — shown on one, because on paper
 * they are invisible.
 */
export const OnDark = () => (
  <div className="flex flex-wrap items-center gap-4 rounded-sm bg-lab p-12">
    <Button href="/labs" variant="light">
      Enter Medirevs Labs
    </Button>
    <Button href="/blog" variant="ghost">
      Read the blog
    </Button>
  </div>
);

/** `external` swaps the router link for a target-blank anchor. */
export const External = () => (
  <Button href="https://doctorevs.com" external>
    Open DoctoRevs
  </Button>
);
