// design-sync host shim for `@/lib/blog`.
//
// The real module is the server-side content layer: it reads /content/blog off
// disk (`node:fs`) and computes CONTENT_DIR from `process.cwd()` at import
// time, so pulling it into a browser bundle both fails to resolve and drags
// gray-matter + zod along for nothing.
//
// ArticleCard/ArticleRow need exactly two things from it — the `Post` type,
// re-exported below from the real source (type-only, erased at build, so the
// node imports are never followed), and `formatDate`, a pure formatter
// mirrored verbatim.
//
// KEEP IN SYNC with formatDate in src/lib/blog.ts. It is the one piece of
// repo logic this sync duplicates; see .design-sync/NOTES.md (Re-sync risks).

export type { Post, Frontmatter } from "../../src/lib/blog";

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
