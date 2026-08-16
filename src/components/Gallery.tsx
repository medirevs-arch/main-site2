import type { GalleryItem } from "@/lib/galleries";
import { PLACEHOLDER_COUNT } from "@/lib/galleries";

/**
 * Image gallery driven entirely by src/lib/galleries.ts.
 * With no images configured it draws labelled frames so the section holds its
 * shape — and so it is obvious that real photography is expected here.
 */
export default function Gallery({
  items,
  placeholderLabel,
  dark = false,
  columns = 2,
}: {
  items: GalleryItem[];
  placeholderLabel: string;
  dark?: boolean;
  columns?: 2 | 3;
}) {
  const cols = columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  if (items.length === 0) {
    return (
      <div className={`grid gap-6 ${cols}`}>
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <figure key={index}>
            <div
              className={`flex aspect-[4/3] items-center justify-center rounded-sm border border-dashed ${
                dark ? "border-white/15 bg-white/[0.02]" : "border-line bg-paper"
              }`}
            >
              <svg
                viewBox="0 0 120 120"
                className={`h-16 w-16 ${dark ? "text-white/15" : "text-mist"}`}
                fill="none"
                aria-hidden="true"
              >
                <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1" />
                <circle cx="60" cy="60" r="14" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <figcaption className={`label mt-4 ${dark ? "text-white/30" : "text-mist"}`}>
              {placeholderLabel} {index + 1}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${cols}`}>
      {items.map((item) => (
        <figure
          key={item.src}
          className={item.wide ? "sm:col-span-2" : undefined}
          data-reveal="rise"
        >
          <div className={`overflow-hidden rounded-sm ${dark ? "bg-white/[0.03]" : "bg-paper"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption
            className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-relaxed ${
              dark ? "text-white/50" : "text-slate"
            }`}
          >
            {item.conceptual && (
              <span
                className={`label rounded-full border px-2.5 py-1 ${
                  dark ? "border-white/20 text-white/60" : "border-line text-slate"
                }`}
              >
                Conceptual render
              </span>
            )}
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
