// design-sync postbuild — run AFTER package-build.mjs, which wipes --out:
//
//   node .design-sync/postbuild.mjs [outDir]
//
// Copies /public imagery into the bundle root so site-absolute srcs resolve.
// Hero, HeroStudio and LabsReveal hard-code their media paths ("/media/...")
// rather than taking them as props, so the data-URI map the next/image shim
// uses cannot reach them — but preview cards are served over HTTP from the
// bundle root, so the same files sitting at those paths do.
//
// Only images are copied. VideoBackground checks prefers-reduced-motion
// before loading anything, and preview cards report reduced motion (see
// .design-sync/harness.tsx), so the <video> sources are never requested and
// the poster frame is what renders — deterministically.

import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");
const OUT = resolve(process.argv[2] ?? join(REPO, "ds-bundle"));
const IMAGE_RX = /\.(png|jpe?g|svg|webp|avif|gif|ico)$/i;

if (!existsSync(join(OUT, "_ds_bundle.js"))) {
  console.error(`  ! postbuild: ${OUT} does not look like a built bundle — skipped`);
  process.exit(1);
}

let copied = 0;
function walk(src, dest) {
  if (!existsSync(src)) return;
  for (const name of readdirSync(src)) {
    const from = join(src, name);
    if (statSync(from).isDirectory()) {
      walk(from, join(dest, name));
      continue;
    }
    if (!IMAGE_RX.test(name)) continue;
    mkdirSync(dest, { recursive: true });
    copyFileSync(from, join(dest, name));
    copied++;
  }
}

walk(join(REPO, "public"), OUT);
console.error(`  public images: ${copied} copied into ${OUT.slice(REPO.length + 1) || OUT}`);
