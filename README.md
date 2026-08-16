# Medirevs — website

A complete rebuild of medirevs.com. Next.js 16 (App Router), TypeScript, Tailwind v4.
The previous site in `../Main Website V1` is untouched.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Create `.env.local` from `.env.example` before running forms:

```
MEDIREVS_FORMS_ENDPOINT=<the Google Apps Script web-app URL>
```

---

## The three files you will actually edit

Almost all content changes happen in one of these. No component edits needed.

| What you want to change | File |
|---|---|
| Company facts, contact details, products, capabilities, Labs copy | `src/lib/site.ts` |
| Photos and screenshots (DoctoRevs, Labs, microscope) | `src/lib/galleries.ts` |
| Blog articles | `content/blog/*.mdx` |

### Adding a blog post

1. Create `content/blog/your-slug.mdx`.
2. Give it frontmatter:

```mdx
---
title: "Your title"
dek: "One or two sentences that appear under the title and in search results."
category: "Digital Health"     # must be one of the categories in src/lib/site.ts
author: "Your Name"
authorRole: "Medirevs"         # optional
publishedAt: "2026-08-07"      # YYYY-MM-DD
heroImage: "/gallery/your-image.jpg"   # optional
heroAlt: "Describe the image"          # required if heroImage is set
featured: true                 # optional — puts it at the top of /blog
draft: true                    # optional — visible in dev, hidden in production
tags: ["records", "policy"]    # optional
---

Your article, in Markdown.
```

3. Save. It appears on `/blog`, in the right category, in the sitemap and in the RSS
   feed, with reading time calculated automatically.

Frontmatter is validated at build time — a typo fails the build with a message
naming the file and the field, rather than shipping a broken page. Posts without
a `heroImage` get a generated optical thumbnail derived from the slug.

### Adding photography

1. Put the file in `public/gallery/`.
2. Add an entry to the matching array in `src/lib/galleries.ts`:

```ts
export const MICROSCOPE_GALLERY: GalleryItem[] = [
  {
    src: "/gallery/microscope-prototype-01.jpg",
    alt: "A screen-reader description of the photograph",
    caption: "The visible caption underneath",
    conceptual: true,  // optional — stamps "Conceptual render" on the image
    wide: true,        // optional — spans two columns
  },
];
```

While an array is empty the page draws labelled placeholder frames, so the layout
is already correct when the real images arrive.

The three galleries are `DOCTOREVS_GALLERY` (DoctoRevs product page),
`LABS_COLLABORATION_GALLERY` (Labs page — the dean visit and student research
photography) and `MICROSCOPE_GALLERY` (the microscope project page).

---

## Two versioned builds

The site ships two complete visual builds. Switch with one value — no component
edits, no branch:

```
# .env.local
NEXT_PUBLIC_SITE_VERSION=studio     # default
NEXT_PUBLIC_SITE_VERSION=clinical
```

Or change `DEFAULT_VERSION` in `src/lib/version.ts`. Then rebuild.

| | **studio** | **clinical** |
|---|---|---|
| Page | `#f0f0ee` light studio | white editorial |
| Navigation | two floating pills, full wordmark, Products opens on hover | full bar with product dropdown |
| Hero | full-bleed product loop, bottom-left block, small type | dark optical field, display type |
| Homepage | 3D scroll depth throughout | editorial reveals |

Medirevs Labs stays dark in both — that is its identity, not a theme.

Surfaces come from four custom properties (`--page`, `--page-alt`, `--surface`,
`--pill`) exposed to Tailwind through `@theme inline`, so `bg-page` follows the
active build.

## Tone of voice

Direct and conversational, like talking to one person. Short clear sentences, no
jargon, no filler, and no dashes as punctuation. Hyphens inside real compound
words like "offline-first" stay, because removing them breaks the word.

Section labels use a slash rather than a dash, for example `03 / PRODUCTS`, and
page titles use a pipe, for example `DoctoRevs | Medirevs`.

## Scroll-driven video

The DoctoRevs page uses `ScrollVideo`. Nothing autoplays. The section is a tall
scroll track with a sticky viewport, and the video's `currentTime` follows how
far you have scrolled, so it runs backwards when you scroll up.

The source is encoded with a keyframe every 6 frames (`-g 6`), because scrubbing
needs cheap seeks far more than it needs a small file. It eases toward the target
time inside `requestAnimationFrame` rather than snapping, which hides the
stepping you otherwise get when seeking. Under reduced motion, Save Data or a 2g
connection it shows the poster and fetches no video at all.

Original camera files live in `media-source/`, outside `public/`, so they are not
deployed. Only the encoded versions in `public/media/` ship.

## 3D scroll

Native CSS scroll-driven animations (`animation-timeline: view()`), so the depth
is computed off the main thread and cannot jank the scroll. No WebGL, no library,
no scroll hijacking.

`.scene` sets the perspective; children take `.z-recede` (hero pushes back as it
exits), `.z-approach`, `.z-tilt`, `.z-lift` or `.z-stagger`. Browsers without
`animation-timeline` render the finished state and keep the IntersectionObserver
fades. `prefers-reduced-motion` removes the perspective and every transform.

## Structure

```
/                              Home
/products                      Ecosystem overview
  /products/doctorevs          Telemedicine · Beta
  /products/ehr                Electronic health records · In development
  /products/data-ai            Data Solutions & AI · Early access
/labs                          Medirevs Labs
  /labs/low-cost-microscope    Flagship project case study
/mission  /blog  /blog/[slug]  /blog/category/[category]
/contact  /demo  /legal/privacy  /legal/terms
sitemap.xml · robots.txt · rss.xml
```

Old URLs (`/doctorevs`, `/medirevs-ehr`, `/data-solutions`) 308-redirect to the new
ones — see `next.config.ts`.

## Forms

Every form posts to `POST /api/forms`, which validates with Zod, screens a honeypot
field, rate-limits per IP, then forwards server-side to the Google Apps Script sheet.

This replaces the old browser-side `mode: "no-cors"` call, which always resolved —
so a failed submission still showed the user a success message. The route reads the
real upstream response and reports failure honestly.

## Motion

Roughly 88% of the motion is CSS and SVG: path drawing via `stroke-dashoffset`,
signals travelling via `offset-path`, blur-to-focus reveals driven by a single
IntersectionObserver (`src/components/Reveal.tsx`). No animation library.

Three generated loops exist, all seamless: `studio-optic` (720p, 143 KB WebM,
the studio hero), `hero-field` (480p, 146 KB WebM) and `labs-objective`
(480p, 63 KB WebM). `VideoBackground`
paints the poster first and only attaches the video afterwards; it skips the video
entirely under `prefers-reduced-motion`, Save-Data, or a 2g connection, and pauses
it offscreen.

`prefers-reduced-motion: reduce` disables all decorative motion site-wide and leaves
every finished diagram on screen.

## Colour rhythm

The page alternates rather than running white all the way down:

| Token | Value (studio) | Used for |
| --- | --- | --- |
| `bg-page` | `#f0f0ee` | base sections |
| `bg-wash` | `#e6efec` | pale teal bands, every other section |
| `bg-brand-deep` | `#14554f` | the footage band |
| `bg-navy` | `#1a2332` | final CTA, carried over from the previous build |
| `bg-lab` | `#07100f` | Medirevs Labs only |

Section kickers, meta labels, blog categories and outline buttons all carry the
brand teal rather than grey, so colour appears in the type as well as behind it.

## Footage from the previous site

Two documentary clips carry over from the old site, re-encoded from 4K/1080p
down to 720p and trimmed to 8 seconds:

- `clinic-consultation` on the home page, before the mission section
- `clinic-clinician` on the mission page

They run through `FootageBand`, which uses the same `VideoBackground` guards as
everything else: poster first, no video under reduced motion, Save Data or 2g,
and paused when offscreen. The old blue studio portrait was deliberately not
carried over, since staged stock portraits are the thing the brief rules out.

## Design system

Brand colours are sampled from the logo (`#27C030` signal green, `#55B0DF` optic
blue) and the existing theme (`#289D90` brand teal). Neutrals are green-tinted.
Type is Geist Sans with Geist Mono for labels and annotations. All tokens live in
the `@theme` block at the top of `src/app/globals.css`.

## 3D elements (three.js)

Three diagrams are real WebGL scenes rather than SVG:

| Scene | Where | What scroll does |
| --- | --- | --- |
| `network` | Home, Products, Mission | Turns the care network and pulls the camera through it |
| `lens` | Labs | Opens the aperture on a machined optical assembly |
| `opticalStack` | Low-Cost Microscope | Pulls the microscope apart, then lets it settle back |

### How it is wired

`Scene3D` hosts every scene. The SVG version is passed as children, rendered on
the server, and is what everyone sees first. three.js is dynamically imported
after that and fades in on top.

three is never downloaded at all when any of these are true:

- `prefers-reduced-motion` is set
- `Save-Data` is on, or the connection reports 2g
- the device reports fewer than 4 logical cores
- WebGL2 is unavailable

So the low bandwidth promise the rest of the site makes still holds. If a scene
throws for any reason it is caught, logged, and the SVG simply stays.

Other guards: pixel ratio is capped at 2, rendering pauses entirely when the
section is offscreen, and every geometry and material is disposed on unmount.

### Labels

Labels are real HTML, not textures, so they stay crisp and selectable. Each one
is anchored to a mesh in world space and projected to screen coordinates every
frame. When two labels overlap, the one further from the camera is hidden, which
stops a node that has rotated behind the hub from dropping its label into the
middle of the diagram.

### Adding a scene

1. Write a factory in `src/components/three/scenes/` returning
   `{ update(progress, elapsed), dispose(), labels? }`.
2. Export it from `scenes/index.ts` and add its name to `SceneName` in
   `Scene3D.tsx`.
3. Wrap it in a figure component that passes the SVG fallback as children.

`progress` is 0 as the section enters the viewport and 1 as it leaves.
