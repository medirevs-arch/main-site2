# Medirevs design system — how to build with it

Editorial, optical, green-tinted. Type does most of the work; colour is used
sparingly and the brand teal is an accent, not a fill. 35 components in four
groups: `general` (primitives, cards, chrome, forms), `graphics` (SVG figures),
`sections` (whole page bands), `three` (the 3D host).

## Root setup

Two things belong on the page root, or components render against the wrong
surface and reveal-on-scroll content stays invisible:

```jsx
// <html data-version="studio">  — or "clinical"
import { Reveal } from '<ds>'

export default function Page() {
  return (
    <>
      <Reveal />           {/* one per page: reveals every [data-reveal] element */}
      <main>…</main>
    </>
  )
}
```

`data-version` on `<html>` picks the surface palette — `studio` (the site
default: `--page` #f0f0ee) or `clinical` (white). It only drives
`bg-page`/`bg-page-alt`/`bg-surface`/`bg-pill`/`bg-wash`/`bg-wash-deep`;
everything else is version-independent. Without `<Reveal />`, anything marked
`data-reveal` sits at `opacity: 0` forever.

Fonts are Geist and Geist Mono, shipped in `fonts/` and wired to
`--font-geist-sans` / `--font-geist-mono`. Nothing to import.

## The styling idiom

Tailwind v4 with a custom `@theme`, **plus a set of semantic classes that carry
the editorial voice**. Prefer the semantic class; reach for utilities for
layout and one-off colour.

| Family | Classes |
|---|---|
| Layout | `shell` (max-width + gutters — the page container), `measure` (68ch), `band`, `band-tight`, `band-tall` (vertical rhythm), `rule` (top hairline) |
| Type | `display`, `h1`, `h2`, `h3`, `lede`, `label` (mono, uppercase, tracked — kickers, statuses, annotations), `prose` (long-form article body) |
| Surface | `glass`, `glass-dark` (blurred panels), `lattice`, `lattice-dark` (dotted optical field) |
| Scroll depth | `scene`, `scene-near` + `z-recede`, `z-approach`, `z-tilt`, `z-lift`, `z-stagger` |

Colour utilities come from the theme: `{bg,text,border,fill,stroke}-` plus
`brand` `brand-dark` `brand-deep` `brand-bright` · `signal` (live/active only)
`optic` (data + diagnostics) · `ink` `graphite` `charcoal` `slate` `mist`
`line` `paper` `bone` · `lab` `lab-raised` `navy` `navy-deep` (dark surfaces) ·
`page` `page-alt` `surface` `pill` `wash` `wash-deep` (version-swappable).
Opacity steps (`text-white/65`, `border-white/15`) are available in fives.
Radii are small on purpose: `rounded-sm` is the house default.

**The stylesheet is a static compile.** Utilities are pre-generated, so
arbitrary values (`max-w-[52ch]`, `bg-[#123]`) will not resolve. For anything
outside the vocabulary above, use the custom property directly — every token is
a real `var()` on `:root`, and the components do this themselves:

```jsx
<span style={{ color: 'var(--color-signal)' }} />
```

## Conventions worth knowing

- **`dark` prop, not a theme.** `SectionHeader`, `PageHero`, `Form`, `Gallery`,
  `StatusChip`, `ProjectTimeline` take `dark` to sit on `bg-lab`/`bg-navy`. Set
  the dark surface yourself; the prop only recolours the component.
- **Some components are surface-specific.** `NewsletterForm` is dark-only (its
  chrome is white-on-transparent). `AnimatedNetwork` / `NetworkFigure` are
  light-only — white node discs, charcoal labels; put them on `bg-wash` or
  `bg-paper`.
- **Links and images are plain.** `next/link`, `next/image` and
  `next/navigation` are replaced with anchor/`<img>`/stub equivalents, so
  `href` behaves like an anchor. `Navigation`/`NavigationStudio` read the
  active route from `window.__dsPathname` — set it before render.
- **Brand imagery ships with the bundle.** `MEDIREVS_ASSETS` maps `/public`
  paths to data URIs (`MEDIREVS_ASSETS['/medirevs-logo.png']`); use it for any
  raw `<img>` or `poster`.
- **`Scene3D`** (and `LensFigure`, `NetworkFigure`, `OpticalStackFigure`)
  render an SVG and upgrade to WebGL only where the device allows. Nothing
  meaningful lives only in the 3D layer.
- `DesignPreviewRoot` is preview scaffolding — do not use it in a design.

## Where the truth is

Read `_ds/<folder>/styles.css` and its imports for the real tokens and classes,
and each component's `.prompt.md` for its props. Both beat this summary.

## A typical band

```jsx
<section className="rule bg-wash">
  <div className="shell band">
    <SectionHeader
      index="02" kicker="The system"
      title="One visit, five people, one record."
      lede="Right now those handovers happen on paper, or not at all."
    />
    <div className="mt-16 grid gap-12 sm:grid-cols-2">
      <AnimatedNetwork className="w-full" />
      <div>
        <StatusChip status="Beta" />
        <p className="lede measure mt-6 text-charcoal">…</p>
        <Button href="/products" variant="outline">See the products</Button>
      </div>
    </div>
  </div>
</section>
```
