"use client";

import Link from "next/link";
import { useState } from "react";
import { PRODUCTS } from "@/lib/site";
import ProductGlyph from "./graphics/ProductGlyph";
import { Arrow, StatusChip } from "./ui";

/**
 * The product ecosystem: an index on the left, one large live panel on the
 * right. Not three equal cards.
 *
 * Every index item is a real button (pointer + keyboard + focus switch it),
 * and each panel keeps its own link through to the full product page, so the
 * section still works as navigation if the panel never changes.
 */
export default function ProductEcosystem() {
  const [active, setActive] = useState(0);
  const product = PRODUCTS[active];
  const glyph = product.slug as "doctorevs" | "ehr" | "data-ai";

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
      {/* Index */}
      <ul className="lg:pt-2">
        {PRODUCTS.map((item, index) => {
          const isActive = index === active;
          return (
            <li key={item.slug}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-current={isActive}
                className="group/idx w-full border-t border-line py-7 text-left transition-colors last:border-b hover:bg-ink/[0.02]"
              >
                <span className="flex items-baseline gap-5">
                  <span
                    className="label transition-colors"
                    style={{ color: isActive ? "var(--color-brand)" : "var(--color-mist)" }}
                  >
                    {item.index}
                  </span>
                  <span className="flex-1">
                    <span
                      className="h3 block transition-colors"
                      style={{ color: isActive ? "var(--color-ink)" : "var(--color-slate)" }}
                    >
                      {item.name}
                    </span>
                    <span className="label mt-2 block text-slate">{item.kicker}</span>
                  </span>
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                    style={{
                      background: isActive ? "var(--color-brand)" : "transparent",
                      transform: isActive ? "scale(1)" : "scale(0.4)",
                    }}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Panel */}
      <div className="relative min-h-[30rem] overflow-hidden rounded-sm border border-line bg-paper">
        <div className="lattice absolute inset-0 opacity-[0.5]" aria-hidden="true" />
        <div
          className="absolute -right-16 -top-16 h-72 w-72 text-brand opacity-[0.13]"
          aria-hidden="true"
        >
          <ProductGlyph product={glyph} className="h-full w-full" />
        </div>

        {/* key= forces the fade to replay when the product changes */}
        <div key={product.slug} className="relative flex h-full flex-col p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-4">
            <StatusChip status={product.status} />
            <span className="label text-mist">{product.kicker}</span>
          </div>

          <h3 className="h2" style={{ animation: "resolve 0.5s var(--ease) both" }}>
            {product.name}
          </h3>

          <p
            className="lede measure mt-5"
            style={{ animation: "resolve 0.5s var(--ease) 60ms both" }}
          >
            {product.summary}
          </p>

          <ul
            className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2"
            style={{ animation: "resolve 0.5s var(--ease) 120ms both" }}
          >
            {product.capabilities.slice(0, 6).map((capability) => (
              <li key={capability.title} className="flex items-baseline gap-3">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                  style={{ background: "var(--color-brand)" }}
                  aria-hidden="true"
                />
                <span className="text-[0.9375rem] leading-snug text-charcoal">
                  {capability.title}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-12">
            <Link
              href={product.href}
              className="group/link inline-flex items-center gap-2.5 text-[0.9375rem] font-medium text-ink"
            >
              <span className="relative">
                Explore {product.name}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
              </span>
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
