// design-sync bundle entry for the Medirevs design system.
//
// This repo is a Next.js application, not a published component package: it
// has no `dist/` and most components are `export default`, which the
// converter's synthesized `export *` entry cannot re-export. So the barrel is
// explicit. Every line below re-exports the repo's real component, unchanged —
// nothing here reimplements anything.
//
// Keep in sync with `componentSrcMap` in .design-sync/config.json (the
// converter's component list) when components are added or removed.

/* ── Primitives ─────────────────────────────────────────────────────── */
export * from "../src/components/ui";

/* ── Content & cards ────────────────────────────────────────────────── */
export * from "../src/components/ArticleCard";
export { default as Gallery } from "../src/components/Gallery";
export { default as PageHero } from "../src/components/PageHero";
export { default as MedirevsMark } from "../src/components/MedirevsMark";
export { default as ProductEcosystem } from "../src/components/ProductEcosystem";

/* ── Chrome ─────────────────────────────────────────────────────────── */
export { default as Navigation } from "../src/components/Navigation";
export { default as Footer } from "../src/components/Footer";

/* ── Forms ──────────────────────────────────────────────────────────── */
export { default as Form } from "../src/components/Form";
export type { FieldSpec } from "../src/components/Form";
export { default as NewsletterForm } from "../src/components/NewsletterForm";

/* ── Behaviour ──────────────────────────────────────────────────────── */
export { default as Reveal } from "../src/components/Reveal";

/* ── Media ──────────────────────────────────────────────────────────── */
export { default as ScrollVideo } from "../src/components/ScrollVideo";
export { default as VideoBackground } from "../src/components/VideoBackground";

/* ── Graphics ───────────────────────────────────────────────────────── */
export * from "../src/components/graphics/Aperture";
export { default as AnimatedNetwork } from "../src/components/graphics/AnimatedNetwork";
export { default as CareJourney } from "../src/components/graphics/CareJourney";
export { default as LensFigure } from "../src/components/graphics/LensFigure";
export { default as NetworkFigure } from "../src/components/graphics/NetworkFigure";
export { default as OpticalStack } from "../src/components/graphics/OpticalStack";
export { default as OpticalStackFigure } from "../src/components/graphics/OpticalStackFigure";
export { default as ProductGlyph } from "../src/components/graphics/ProductGlyph";
export { default as ProjectTimeline } from "../src/components/graphics/ProjectTimeline";
export type { Milestone } from "../src/components/graphics/ProjectTimeline";

/* ── Sections ───────────────────────────────────────────────────────── */
export { default as Hero } from "../src/components/sections/Hero";
export { default as LabsReveal } from "../src/components/sections/LabsReveal";
export { default as FootageBand } from "../src/components/sections/FootageBand";

/* ── 3D ─────────────────────────────────────────────────────────────── */
export { default as Scene3D } from "../src/components/three/Scene3D";

/* ── Brand assets & preview harness ─────────────────────────────────── */
// Site imagery inlined as data URIs (see .design-sync/prebuild.mjs) so the
// logo travels with the bundle instead of depending on an origin serving
// /public. `next/image` in this bundle resolves through the same map.
export { PUBLIC_ASSETS as MEDIREVS_ASSETS } from "./shims/public-assets";
export { DesignPreviewRoot } from "./harness";
