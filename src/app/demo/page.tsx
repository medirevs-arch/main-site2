import type { Metadata } from "next";
import Form from "@/components/Form";
import Reveal from "@/components/Reveal";
import { Aperture } from "@/components/graphics/Aperture";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Demo",
  description:
    "See DoctoRevs, Medirevs EHR and Data Solutions and AI working for your clinic. Ask the Medirevs team for a demo.",
  alternates: { canonical: "/demo" },
};

const EXPECTATIONS = [
  "A walkthrough of whichever products fit your clinic",
  "A straight answer on what works today and what is still being built",
  "Time for your questions about setup, connectivity and the systems you already have",
];

export default function DemoPage() {
  return (
    <>
      <Reveal />

      <section className="relative overflow-hidden bg-lab">
        <div
          className="pointer-events-none absolute -right-40 top-1/2 hidden w-[36rem] -translate-y-1/2 opacity-25 lg:block"
          aria-hidden="true"
        >
          <Aperture className="w-full" tone="var(--color-brand-bright)" blades={12} />
        </div>

        <div className="shell relative pb-24 pt-40 sm:pt-48">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="label mb-10 text-white/40">Request a demo</p>
              <h1 className="h1 max-w-[14ch] text-balance text-white">
                See it working for your clinic.
              </h1>
              <p className="lede mt-8 max-w-[42ch] text-white/65">
                Tell us where you work and what you are trying to fix, and we will show
                you the parts that matter to you.
              </p>

              <ul className="mt-12 space-y-4 border-t border-white/10 pt-8">
                {EXPECTATIONS.map((item) => (
                  <li key={item} className="flex items-baseline gap-4 text-[0.9375rem] text-white/60">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--color-signal)" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="label mt-12 text-white/35">
                Prefer email?{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="underline underline-offset-4 hover:text-white/70"
                >
                  {CONTACT.email}
                </a>
              </p>
            </div>

            <Form
              dark
              source="demo"
              submitLabel="Request a demo"
              successTitle="Request received."
              successBody="We will be in touch to arrange a time."
              fields={[
                { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
                { name: "email", label: "Work email", type: "email", required: true, half: true, autoComplete: "email" },
                { name: "organisation", label: "Facility or organisation", required: true, half: true },
                { name: "role", label: "Your role", half: true },
                { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
                {
                  name: "product",
                  label: "Interested in",
                  type: "select",
                  half: true,
                  options: [
                    "DoctoRevs",
                    "Medirevs EHR",
                    "Data Solutions & AI",
                    "Medirevs Labs",
                    "Not sure yet",
                  ],
                },
                { name: "message", label: "What are you trying to solve?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
