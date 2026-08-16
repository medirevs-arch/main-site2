#!/usr/bin/env node
/**
 * Site regression gate.
 *
 *   node scripts/validate-site.mjs [baseUrl]
 *
 * Checks the things that have actually broken on this site before, so that a
 * regression fails loudly instead of being spotted in a screenshot later:
 *
 *   1. HIDDEN CONTENT   — no element carrying real text sits at opacity < 0.9
 *                         at rest. The `z-*` scroll-depth classes once animated
 *                         opacity from 0, which left whole sections invisible.
 *   2. WHITESPACE GAPS  — no run of flat, empty rows longer than MAX_GAP.
 *   3. NAV DISCLOSURE   — the Products trigger is a button, opens on click,
 *                         does not navigate, and lists every product.
 *   4. NAV ACTIVE STATE — exactly the current route is underlined, and the
 *                         accent item is not permanently marked.
 *   5. BROKEN ASSETS    — no failed requests, no missing images.
 *   6. CONSOLE          — no page errors.
 *
 * Exits non-zero if any check fails.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
for (const p of ["playwright", "../.ds-sync/node_modules/playwright/index.mjs"]) {
  try {
    ({ chromium } = p.startsWith(".") ? await import(new URL(p, import.meta.url).href) : require(p));
    break;
  } catch {
    /* try next */
  }
}
if (!chromium) {
  console.error("playwright not found — `npm i -D playwright` or run from a tree with .ds-sync/");
  process.exit(2);
}

const BASE = process.argv[2] ?? "http://localhost:3000";
const MAX_GAP = 320;
const PAGES = [
  "/", "/products", "/products/doctorevs", "/products/ehr", "/products/data-ai",
  "/mission", "/labs", "/labs/low-cost-microscope", "/blog", "/contact", "/demo",
];

const failures = [];
const notes = [];
const fail = (page, check, detail) => failures.push({ page, check, detail });

const browser = await chromium.launch({ executablePath: process.env.DS_CHROMIUM_PATH });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

// ── Per-page checks ───────────────────────────────────────────────────
for (const path of PAGES) {
  const page = await ctx.newPage();
  const bad = [];
  page.on("pageerror", (e) => bad.push("pageerror: " + String(e).split("\n")[0]));
  page.on("response", (r) => {
    if (r.status() >= 400 && new URL(r.url()).origin === new URL(BASE).origin) {
      bad.push(`${r.status()} ${new URL(r.url()).pathname}`);
    }
  });

  try {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60_000 });
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 700));
    });

    // 1. Hidden content
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("main *, footer *")]
        .filter((el) => {
          const t = (el.innerText || "").trim();
          if (t.length < 25) return false;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") return false;
          // Ignore genuinely offscreen/collapsed things and sr-only helpers.
          const r = el.getBoundingClientRect();
          if (r.width < 4 || r.height < 4) return false;
          if (parseFloat(cs.opacity) >= 0.9) return false;

          // Deliberately faded: an explicit opacity utility is a decision, and
          // an aria-hidden subtree is a swapped-out layer (Scene3D drops its
          // SVG fallback to 0 once the WebGL canvas is live). Flagging those
          // trains the reader to ignore this check, which is worse than not
          // having it.
          if (/(^|\s)opacity-\d/.test(el.className || "")) return false;
          for (let n = el; n; n = n.parentElement) {
            if (n.getAttribute?.("aria-hidden") === "true") return false;
            if (/(^|\s)opacity-\d/.test(n.className || "")) return false;
          }
          return true;
        })
        .slice(0, 6)
        .map((el) => ({
          cls: (el.className || "").toString().slice(0, 44),
          op: getComputedStyle(el).opacity,
          text: (el.innerText || "").trim().slice(0, 52).replace(/\n+/g, " "),
        })),
    );
    for (const h of hidden) fail(path, "hidden-content", `opacity ${h.op} — "${h.text}" [${h.cls}]`);

    // 2. Whitespace gaps
    const shot = await page.screenshot({ fullPage: true });
    const gaps = await page.evaluate(
      async ([dataUrl, minGap]) => {
        const img = new Image();
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
          img.src = dataUrl;
        });
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
        const out = [];
        let start = -1;
        for (let y = 0; y <= height; y++) {
          let flat = false;
          if (y < height) {
            const o = y * width * 4;
            const r0 = data[o], g0 = data[o + 1], b0 = data[o + 2];
            flat = true;
            for (let x = 3; x < width; x += 3) {
              const i = o + x * 4;
              if (Math.abs(data[i] - r0) > 6 || Math.abs(data[i + 1] - g0) > 6 || Math.abs(data[i + 2] - b0) > 6) {
                flat = false;
                break;
              }
            }
          }
          if (flat) { if (start < 0) start = y; }
          else if (start >= 0) {
            if (y - start >= minGap && y < height - 4) out.push({ at: start, px: y - start });
            start = -1;
          }
        }
        return out;
      },
      ["data:image/png;base64," + shot.toString("base64"), MAX_GAP],
    );
    // Two kinds of flat run are not layout holes:
    //   · a `position: sticky` track — a full-page screenshot paints the
    //     pinned element once and leaves the rest of its track blank, but a
    //     real viewport keeps it on screen the whole way down;
    //   · the inside of a figure — a diagram with air around it is a drawing
    //     decision, not dead page.
    // The first is excluded; the second is reported but does not fail, so a
    // genuine hole between sections still does.
    const zones = await page.evaluate(() => {
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      };
      const sticky = [];
      const figure = [];
      for (const el of document.querySelectorAll("body *")) {
        if (getComputedStyle(el).position === "sticky" && el.parentElement) {
          sticky.push(box(el.parentElement));
          continue;
        }
        // SVG elements report a lowercase tagName, unlike HTML ones.
        const tag = String(el.tagName).toUpperCase();
        if (tag === "FIGURE" || tag === "CANVAS" || tag === "SVG" || tag === "VIDEO") {
          figure.push(box(el));
        }
      }
      return { sticky, figure };
    });
    // Overlap, not containment: a sticky track's blank tail can run a little
    // past the track itself, and a strict containment test then classifies the
    // whole run as a layout hole.
    const overlaps = (g, list, ratio = 0.6) =>
      list.some((z) => {
        const cover = Math.min(g.at + g.px, z.bottom) - Math.max(g.at, z.top);
        return cover > 0 && cover / g.px >= ratio;
      });

    for (const g of gaps) {
      if (overlaps(g, zones.sticky)) continue;
      if (overlaps(g, zones.figure)) {
        notes.push({ page: path, detail: `${g.px}px of air inside a figure at y=${g.at}` });
        continue;
      }
      fail(path, "whitespace-gap", `${g.px}px of empty page at y=${g.at}`);
    }

    for (const b of [...new Set(bad)]) fail(path, "runtime", b);
  } catch (e) {
    fail(path, "load", String(e).split("\n")[0].slice(0, 100));
  }
  await page.close();
}

// ── Navigation behaviour ──────────────────────────────────────────────
{
  const page = await ctx.newPage();
  await page.goto(BASE + "/mission", { waitUntil: "networkidle", timeout: 60_000 });

  const trigger = page.locator('header button[aria-haspopup="true"]').first();
  if ((await trigger.count()) === 0) {
    fail("/mission", "nav-disclosure", "Products trigger is not a button[aria-haspopup]");
  } else {
    await trigger.click();
    await page.waitForTimeout(400);
    if ((await trigger.getAttribute("aria-expanded")) !== "true") {
      fail("/mission", "nav-disclosure", "panel did not open on click");
    }
    if (!page.url().endsWith("/mission")) {
      fail("/mission", "nav-disclosure", "clicking the trigger navigated away");
    }
    const links = await page.locator("header a[href^='/products/']").count();
    if (links < 3) fail("/mission", "nav-disclosure", `only ${links} product links in the panel (expected 3+)`);
    if ((await page.locator('header a:has-text("All products")').count()) === 0) {
      fail("/mission", "nav-disclosure", '"All products" link missing from panel');
    }
  }

  for (const [path, expected] of [
    ["/", []],
    ["/mission", ["Mission"]],
    ["/labs", ["Medirevs Labs"]],
    ["/blog", ["Blog"]],
  ]) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60_000 });
    const marked = await page.evaluate(() =>
      [...document.querySelectorAll("header nav a")]
        .filter((a) => a.getAttribute("aria-current") === "page")
        .map((a) => a.textContent.trim()),
    );
    if (JSON.stringify(marked) !== JSON.stringify(expected)) {
      fail(path, "nav-active", `underlined ${JSON.stringify(marked)}, expected ${JSON.stringify(expected)}`);
    }
  }
  await page.close();
}

await browser.close();

// ── Report ────────────────────────────────────────────────────────────
if (notes.length) {
  console.log("notes (not failures):");
  for (const n of notes) console.log(`  ${n.page} — ${n.detail}`);
  console.log();
}
if (!failures.length) {
  console.log(`✓ site validation passed — ${PAGES.length} pages, no hidden content, no gaps over ${MAX_GAP}px, nav OK`);
  process.exit(0);
}
console.error(`✗ ${failures.length} problem(s):\n`);
const byPage = {};
for (const f of failures) (byPage[f.page] ||= []).push(f);
for (const [page, list] of Object.entries(byPage)) {
  console.error(`  ${page}`);
  for (const f of list) console.error(`     [${f.check}] ${f.detail}`);
}
process.exit(1);
