import type { ReactNode } from "react";
import { Navigation } from "medirevs-v2";

/**
 * Navigation reads the current route (usePathname) to decide two things: which
 * item is marked current, and whether the chrome is inverted — it stays white
 * on `/`, `/labs` and `/demo` until the page scrolls. `AtPath` sets the route
 * the preview should render at.
 *
 * The `transform` is load-bearing: the header is `position: fixed`, and a
 * transformed ancestor becomes the containing block for fixed descendants.
 * Without it every cell's header would escape and pile up at the top of the
 * card instead of sitting in its own frame.
 */
function AtPath({ path, children }: { path: string; children: ReactNode }) {
  if (typeof window !== "undefined") window.__dsPathname = path;
  return (
    <div className="relative overflow-hidden" style={{ transform: "translateZ(0)" }}>
      {children}
    </div>
  );
}

/** Over a dark hero — the resting state on `/labs`: transparent, white type. */
export const OverDarkHero = () => (
  <AtPath path="/labs">
    <div className="min-h-[460px] bg-lab">
      <Navigation />
      <div className="shell pt-40">
        <p className="label text-white/40">Medirevs Labs</p>
        <h1 className="h1 mt-8 max-w-[16ch] text-white">Instruments, not just interfaces.</h1>
      </div>
    </div>
  </AtPath>
);

/** On a light interior page the chrome inverts to charcoal on the page colour. */
export const OnLightPage = () => (
  <AtPath path="/mission">
    <div className="min-h-[460px] bg-page">
      <Navigation />
      <div className="shell pt-40">
        <p className="label text-brand-dark">Mission</p>
        <h1 className="h1 mt-8 max-w-[18ch] text-ink">
          Better ways to deliver healthcare.
        </h1>
      </div>
    </div>
  </AtPath>
);

/** On the blog route, showing the current-item treatment on a paper surface. */
export const OnBlog = () => (
  <AtPath path="/blog">
    <div className="min-h-[460px] bg-paper">
      <Navigation />
      <div className="shell pt-40">
        <p className="label text-brand-dark">Writing</p>
        <h1 className="h1 mt-8 max-w-[18ch] text-ink">Notes from the build.</h1>
      </div>
    </div>
  </AtPath>
);
