import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import NetworkFigure from "@/components/graphics/NetworkFigure";
import ProductGlyph from "@/components/graphics/ProductGlyph";
import { Arrow, Button, StatusChip } from "@/components/ui";
import { PRODUCTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "DoctoRevs, Medirevs EHR and Data Solutions and AI. Three systems for connected care, clinical records and healthcare data.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <Reveal />
      <PageHero
        kicker="Products"
        title="Three systems, built to work together."
        lede="Each one solves a different part of the same problem. Keeping a single visit whole as it moves between people, organisations and networks."
      />

      {/* No top padding: PageHero already ends with its own, and the figure
          carries a good deal of air inside its own frame. Stacking all three
          left a third of a screen of blank page between the lede and the
          drawing. */}
      <section className="rule bg-wash">
        <div className="shell pb-12 sm:pb-16">
          <NetworkFigure className="mx-auto max-w-4xl" />
        </div>
      </section>

      <section className="rule">
        <div className="shell">
          {PRODUCTS.map((product) => (
            <article
              key={product.slug}
              className="grid gap-10 border-b border-line py-16 last:border-b-0 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20 lg:py-24"
            >
              <div>
                <div className="mb-8 flex items-center gap-4">
                  <span className="label" style={{ color: "var(--color-brand)" }}>
                    {product.index}
                  </span>
                  <StatusChip status={product.status} />
                </div>
                <div className="h-24 w-24 text-brand opacity-70" aria-hidden="true">
                  <ProductGlyph
                    product={product.slug as "doctorevs" | "ehr" | "data-ai"}
                    className="h-full w-full"
                  />
                </div>
              </div>

              <div>
                <h2 className="h2" data-reveal>
                  <Link href={product.href} className="group/link inline-flex items-center gap-4">
                    {product.name}
                    <Arrow className="mt-2 text-mist" />
                  </Link>
                </h2>
                <p className="label mt-4 text-slate">{product.kicker}</p>

                <p className="lede measure mt-8">{product.description}</p>

                <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                  {product.capabilities.map((capability) => (
                    <li key={capability.title}>
                      <h3 className="mb-2 text-[0.9375rem] font-medium text-ink">
                        {capability.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-charcoal">{capability.body}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Button href={product.href} variant="outline">
                    Explore {product.name}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy">
        <div className="shell band text-center">
          <h2 className="h2 mx-auto max-w-[22ch] text-balance text-white" data-reveal>
            See how it would work for your clinic.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/demo" variant="light">
              Request a Demo
            </Button>
            <Button href="/contact" variant="ghost">
              Contact Medirevs
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
