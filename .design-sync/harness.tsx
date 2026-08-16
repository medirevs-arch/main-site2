// design-sync preview harness.
//
// Preview cards render a single component into a bare document, so the setup
// `src/app/layout.tsx` does at the document root has to happen here too, or
// cards render against the wrong surface palette with their content invisible.
//
// This wrapper is preview-only scaffolding (cfg.provider). Nothing in it
// reaches an app built with the design system.

import { useLayoutEffect } from "react";
import type { ReactNode } from "react";

// ── Reduced motion ───────────────────────────────────────────────────────
//
// Cards render the design system as it renders for a visitor who has "reduce
// motion" turned on. That is a real, supported presentation of this site —
// globals.css defines it — and it is the only deterministic one, which is
// what a screenshot and a card need.
//
// Two components made that necessary. AnimatedNetwork draws its paths with
// staggered delays that do not settle for ~2.5s, so cards came out with half
// the network missing. Scene3D crossfades from its SVG fallback to a three.js
// scene over 700ms once it finds webgl2, so cards landed mid-fade with both
// layers stacked — doubled labels, a grey lens over the aperture — a state no
// real viewer sees. Under reduced motion the draw animations resolve to their
// finished state, and Scene3D takes its own first branch and keeps the SVG,
// the layer that carries the annotation and the one its own comment calls
// "the only thing many people see".
//
// The media query itself cannot be set from inside the page, so both halves
// are asserted: matchMedia for the components that check it in JS, and the
// declarations from globals.css's own reduced-motion block for CSS. Module
// scope, not an effect — Scene3D probes in its mount effect, and a child's
// effects run before its provider's.
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const realMatchMedia = window.matchMedia.bind(window);
  window.matchMedia = ((query: string) =>
    /prefers-reduced-motion:\s*reduce/.test(query)
      ? ({
          media: query,
          matches: true,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent: () => false,
        } as unknown as MediaQueryList)
      : realMatchMedia(query)) as typeof window.matchMedia;
}

// Copied from the @media (prefers-reduced-motion: reduce) block in
// src/app/globals.css. `draw` and `resolve` both use a forwards fill, so a
// near-zero duration lands them on their finished frame.
//
// `animation-delay` is the one addition. The repo's block does not zero it
// because on a real page nobody is looking at frame zero — but a card is
// exactly that, and AnimatedNetwork staggers its peer connections out to
// 900ms+, so without this the card shows a network with links missing.
const REDUCED_MOTION_CSS = `
*, *::before, *::after {
  animation-duration: 0.001ms !important;
  animation-delay: 0ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
}
[data-reveal] { opacity: 1 !important; filter: none !important; transform: none !important; }
`;

export function DesignPreviewRoot({
  children,
  version = "studio",
}: {
  children?: ReactNode;
  version?: "studio" | "clinical";
}) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    // globals.css keys the swappable surface tokens off
    // `:root[data-version="studio"]`; without this the studio build's
    // page/pill/wash colours fall back to the clinical defaults.
    root.setAttribute("data-version", version);
    // `.no-js [data-reveal]` is the repo's own no-JavaScript fallback, which
    // pins reveal-on-scroll content to its settled, fully-revealed state.
    // Real apps mount <Reveal /> and get the animated version instead.
    root.classList.add("no-js");
  }, [version]);

  return (
    <>
      <style>{REDUCED_MOTION_CSS}</style>
      {children}
    </>
  );
}
