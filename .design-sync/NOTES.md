# design-sync notes — medirevs-v2

## Status of the last run (2026-08-15)

Local-only build: the user chose **build, don't upload**, so no claude.ai/design
project was created and `config.json` has **no `projectId`**. The output is
`ds-bundle/`. A future run is therefore still a *first* sync — it will create a
project (base SKILL.md §1) and re-verify everything, because there is no
uploaded `_ds_sync.json` anchor anywhere. That is expected, not a fault.

`package-validate.mjs` exits 0 with **zero warnings**; 35/35 previews render;
34 components have authored previews all graded `good`; `Reveal` is on the
floor card by design (it renders `null` — it is an effect-only component).

## This repo is not a component package

It is the Next.js marketing site. There is no `dist/`, no `exports`, and 21 of
35 components are `export default`, which the converter's synthesised
`export *` entry cannot re-export. So:

- **`.design-sync/entry.tsx`** is a hand-written barrel over the real `src/`
  components. **Add new components here and to `componentSrcMap` together** —
  the barrel decides what is in the bundle, `componentSrcMap` decides what gets
  a card, and they must agree.
- `shape: "package"`, `--entry ./.design-sync/entry.tsx`.

## Build sequence — order matters

```sh
node .design-sync/prebuild.mjs        # cfg.buildCmd: asset map + Tailwind compile
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./.design-sync/entry.tsx --out ./ds-bundle
node .design-sync/postbuild.mjs       # MUST run before validate/capture
node .ds-sync/package-validate.mjs ./ds-bundle
node .ds-sync/package-capture.mjs --out ./ds-bundle
```

- **`prebuild` before build**: it regenerates `.cache/medirevs.css`, which
  `cfg.cssEntry` points at. Skip it after editing a preview and any new utility
  class that preview uses will be missing from the stylesheet.
- **`postbuild` after build**: `package-build.mjs` wipes `--out`, and postbuild
  copies `/public` images back in. `Hero`, `HeroStudio` and `LabsReveal`
  hard-code `/media/...` paths, so without it those three cards lose their
  poster imagery. **`resync.mjs` chains build→validate→capture internally with
  no hook in between** — if you use the driver, run `postbuild.mjs` afterwards
  and re-run validate/capture, or those cards grade against missing media.

## Host shims (`.design-sync/shims/`, wired via `cfg.tsconfig` paths)

Bundled code runs in a plain React page with no Next.js server, so four
modules are redirected in `tsconfig.ds.json`:

| Module | Why |
|---|---|
| `next/link` | real Link needs AppRouterContext → renders `<a>` |
| `next/image` | real Image rewrites src through `/_next/image` → renders `<img>`, resolving site-absolute srcs through the inlined asset map |
| `next/navigation` | `usePathname()` throws with no router → returns `window.__dsPathname ?? "/"` |
| `@/lib/blog` | imports `node:fs` and runs `path.join(process.cwd(), …)` at module scope, and drags in gray-matter + zod |

**Path order in `tsconfig.ds.json` is load-bearing**: the resolver returns on
first match, so `@/lib/blog` must stay above the `@/*` wildcard.

## Tailwind: the stylesheet is a static compile

`prebuild.mjs` compiles `.design-sync/ds-entry.css` (which imports the site's
own `globals.css`) with `@tailwindcss/postcss`.

Tailwind only emits utilities it finds in scanned sources, so the first compile
carried only what the marketing pages happen to use — `bg-brand-dark` and `p-6`
were both missing. Designs built with this DS are composed against the shipped
CSS and never recompiled, so those would be silently dead. **`ds-entry.css`
therefore safelists the DS vocabulary with `@source inline(...)`** (65 KB →
324 KB). Arbitrary values (`max-w-[52ch]`) can never be pre-generated;
`conventions.md` tells the design agent to use `var(--color-*)` in a style prop
instead, which is what the components themselves do.

If you add a token to `globals.css`'s `@theme`, add it to the safelist too.

## Fonts

The site gets Geist via `next/font`, which does not exist in the bundle.
`.design-sync/fonts.css` (`cfg.extraFonts`) declares the two variable faces
from `node_modules/geist`, and `ds-entry.css` defines the
`--font-geist-sans` / `--font-geist-mono` vars the `@theme` block points at.
No `[FONT_MISSING]`.

## Preview harness (`.design-sync/harness.tsx`, `cfg.provider`)

Preview-only; nothing in it reaches an app. It does three things, each for a
concrete failure that was observed:

1. **`data-version="studio"` on `<html>`** — the surface tokens key off
   `:root[data-version]`, so without it every card used the clinical palette.
2. **`no-js` class** — `[data-reveal] { opacity: 0 }` waits for the `Reveal`
   observer; `.no-js [data-reveal]` is the repo's own fallback and pins that
   content to its settled state with no animation to race.
3. **Reduced motion asserted** (patched `matchMedia` + the declarations from
   globals.css's own reduced-motion block, **plus `animation-delay: 0ms`**,
   which the repo's block does not zero). Without it: `AnimatedNetwork` staggers
   its peer links out past 900ms and cards showed a half-drawn network, and
   `Scene3D` crossfades to three.js over 700ms so cards landed mid-fade with
   both layers stacked (doubled labels, a grey lens over the aperture). Under
   reduced motion `Scene3D` takes its own documented first branch and keeps the
   SVG, and `VideoBackground`/`ScrollVideo` hold their poster and fetch no media.
   All of it deterministic.

## Card presentation

`cfg.overrides` carries two kinds of entry, both presentation-only (not grade-keyed):

- **`viewport`** for components whose real layout only resolves above `lg`
  (1024px). The default 900px stage rendered `Footer`, `ProductEcosystem`,
  `Navigation` and the sections as their stacked mobile fallback.
- **`cardMode`** — `column` for components whose stories are full compositions,
  `single` for `Navigation`/`NavigationStudio`, which are `position: fixed` and
  cannot be presented in a grid at all. Applied in response to
  `[GRID_OVERFLOW]`; the check is clean now.

## Known render warns

None. `package-validate.mjs` currently prints no warnings at all — treat any
warn on a future run as new.

## Findings for the repo owners (not sync issues)

- **`CareJourney` clips its last label.** The SVG `viewBox` is 1160 wide and
  the sixth station's centred label ("Held in the patient record") extends past
  it, so the final character is cut. Visible on the live site too, at any
  width, because the clip is in viewBox units. Widening the viewBox or
  anchoring the last label `end` would fix it.
- `AnimatedNetwork` / `NetworkFigure` are light-surface only — white node
  discs, `--color-ink` dots, `--color-charcoal` labels, no `dark` prop. Fine
  today (they are used on `bg-wash`), but worth knowing before anyone puts one
  on a dark band.
- `NewsletterForm` is the mirror image: dark-only chrome, invisible on paper.

## Re-sync risks — what to watch

- **`formatDate` is duplicated** in `.design-sync/shims/blog.ts` from
  `src/lib/blog.ts`. The `Post` type is re-exported from the real module
  (type-only, so the node imports are never followed) but the formatter is a
  copy. If the site changes its date format, change it in both.
- **The barrel and `componentSrcMap` are hand-maintained.** A component added
  to `src/components/` appears in neither automatically, and will silently be
  absent from the sync.
- **The safelist is hand-maintained** against `globals.css`'s `@theme`.
- **`prebuild` inlines `/public` images as data URIs** (~351 KB) into
  `shims/public-assets.ts`, regenerated each run — but the *cap* is 128 KB per
  file, so a new large asset is silently skipped. Check the prebuild log line.
- **`three` is inlined** into `_ds_bundle.js` (2.4 MB total) because esbuild
  cannot code-split an IIFE. Expected, not a leak.
- **Chromium**: no playwright browser is installed. Both scripts honour
  `DS_CHROMIUM_PATH`; this machine used
  `/c/Program Files/Google/Chrome/Application/chrome.exe`. Export it before
  validate/capture or the render check is skipped.
- The `(c)` year in `Footer` reads 2024 in captures — `package-capture.mjs`
  pins a fixed clock for determinism. Not a component bug.
