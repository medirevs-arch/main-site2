import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ProductGlyph from "@/components/graphics/ProductGlyph";
import { Button, SectionHeader, StatusChip } from "@/components/ui";
import { PRODUCTS } from "@/lib/site";

const product = PRODUCTS[2];

export const metadata: Metadata = {
  title: "Data Solutions & AI",
  description:
    "Chat and voice tools that support people beyond the consultation. A patient companion, decision support for clinicians, and guided triage. Designed for African clinical settings.",
  alternates: { canonical: "/products/data-ai" },
  openGraph: {
    title: "Data Solutions & AI | Medirevs",
    description: "Chat and voice tools that support people between visits.",
    url: "/products/data-ai",
  },
};

const PRINCIPLES = [
  {
    title: "Assistive, never autonomous",
    body: "These tools support a clinician's judgement. They do not replace it, and they do not diagnose.",
  },
  {
    title: "Designed for African clinical contexts",
    body: "Built around the conditions, languages and care pathways of the places we work in.",
  },
  {
    title: "Honest about limits",
    body: "A tool that admits it does not know is more useful than one that always has an answer.",
  },
];

export default function DataAiPage() {
  return (
    <>
      <Reveal />

      <PageHero
        kicker="Products / 03"
        title="Data Solutions & AI"
        lede={product.summary}
        meta={[
          { label: "Status", value: "Early access" },
          { label: "Interfaces", value: "Conversational and voice" },
          { label: "Role", value: "Assistive, clinician-led" },
          { label: "Languages", value: "African-language support planned" },
        ]}
      >
        <div className="mt-10">
          <StatusChip status="Early access" />
        </div>
      </PageHero>

      <section className="rule bg-wash">
        <div className="shell band">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <SectionHeader
              index="01"
              kicker="The gap"
              title="Care rarely breaks down at the diagnosis."
              lede={product.description}
            />
            <div className="mx-auto w-full max-w-sm text-brand opacity-80" aria-hidden="true">
              <ProductGlyph product="data-ai" className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="shell band">
          <SectionHeader index="02" kicker="Capabilities" title="What we are building." className="mb-16" />
          <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {product.capabilities.map((capability, index) => (
              <li
                key={capability.title}
                className="border-t border-line pt-6"
                data-reveal="rise"
                style={{ ["--delay" as string]: `${index * 50}ms` }}
              >
                <h3 className="mb-3 text-lg font-medium tracking-[-0.015em] text-ink">
                  {capability.title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal">{capability.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rule bg-wash">
        <div className="shell band">
          <SectionHeader
            index="03"
            kicker="How we approach it"
            title="Three rules we hold ourselves to."
            className="mb-16"
          />
          <div className="grid gap-px bg-line sm:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <div
                key={principle.title}
                className="bg-wash p-8"
                data-reveal="rise"
                style={{ ["--delay" as string]: `${index * 80}ms` }}
              >
                <p className="label mb-5" style={{ color: "var(--color-brand)" }}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mb-3 text-lg font-medium leading-snug tracking-[-0.015em] text-ink">
                  {principle.title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal">{principle.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-[62ch] border-l-2 border-line pl-6 text-sm leading-relaxed text-slate">
            These are support tools for clinicians and patients. They are not medical
            devices, they do not give a diagnosis, and they are not a substitute for
            professional medical advice.
          </p>
        </div>
      </section>

      <section className="bg-navy">
        <div className="shell band text-center">
          <h2 className="h2 mx-auto max-w-[22ch] text-balance text-white" data-reveal>
            Working on something similar? We would like to talk.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact" variant="light">
              Contact Medirevs
            </Button>
            <Button href="/demo" variant="ghost">
              Request a Demo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
