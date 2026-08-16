import type { Metadata } from "next";
import Form from "@/components/Form";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { SectionHeader, StatusChip } from "@/components/ui";
import { PRODUCTS } from "@/lib/site";

const product = PRODUCTS[1];

export const metadata: Metadata = {
  title: "Medirevs EHR | Electronic health records",
  description:
    "Health records for clinics that cannot rely on the internet. Works offline, light on data, and built to connect with the systems you already use. In development.",
  alternates: { canonical: "/products/ehr" },
  openGraph: {
    title: "Medirevs EHR | Electronic health records",
    description: "Health records that keep working when the internet does not.",
    url: "/products/ehr",
  },
};

/**
 * The sync state diagram — the single idea this product turns on.
 * Pure SVG; the dashes draw in on entry.
 */
function SyncDiagram() {
  return (
    <figure className="rounded-sm border border-line bg-page p-8 sm:p-12">
      <svg viewBox="0 0 720 240" fill="none" className="w-full" role="img" aria-labelledby="sync-title">
        <title id="sync-title">
          A clinic records care offline; when connectivity returns the record synchronises.
        </title>

        {[
          { x: 90, label: "Clinic device", note: "Records care" },
          { x: 360, label: "Local store", note: "Always writable" },
          { x: 630, label: "Shared record", note: "Syncs when able" },
        ].map((node, index) => (
          <g key={node.label}>
            <circle cx={node.x} cy="96" r="34" stroke="var(--color-ink)" strokeWidth="1" opacity="0.15" />
            <circle cx={node.x} cy="96" r="6" fill={index === 2 ? "var(--color-optic)" : "var(--color-brand)"} />
            <text x={node.x} y="164" textAnchor="middle" fontSize="15" fontWeight="500" fill="var(--color-ink)">
              {node.label}
            </text>
            <text x={node.x} y="186" textAnchor="middle" fontSize="12.5" fill="var(--color-slate)">
              {node.note}
            </text>
          </g>
        ))}

        <path
          d="M128 96 H322"
          stroke="var(--color-brand)"
          strokeWidth="1"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{ animation: "draw 1s var(--ease) 200ms forwards" }}
        />
        {/* The intermittent leg is drawn broken — that is the point. */}
        <path
          d="M398 96 H592"
          stroke="var(--color-optic)"
          strokeWidth="1"
          strokeDasharray="5 7"
          opacity="0.85"
        />
        <text x="495" y="76" textAnchor="middle" className="label" fill="var(--color-slate)">
          When connected
        </text>
        <text x="225" y="76" textAnchor="middle" className="label" fill="var(--color-slate)">
          Always
        </text>
      </svg>
    </figure>
  );
}

export default function EhrPage() {
  return (
    <>
      <Reveal />

      <PageHero
        kicker="Products / 02"
        title="Medirevs EHR"
        lede={product.summary}
        meta={[
          { label: "Status", value: "In development" },
          { label: "Built for", value: "Clinics and health facilities" },
          { label: "Architecture", value: "Offline-first" },
          { label: "Availability", value: "Waitlist open" },
        ]}
      >
        <div className="mt-10">
          <StatusChip status="In development" />
        </div>
      </PageHero>

      <section className="rule bg-wash">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeader
              index="01"
              kicker="The idea"
              title="A record that keeps working when the network stops."
              lede={product.description}
            />
            <SyncDiagram />
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="shell band">
          <SectionHeader index="02" kicker="What it does" title="Six things we are committed to." className="mb-16" />
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

          <p className="mt-14 max-w-[62ch] border-l-2 border-line pl-6 text-sm leading-relaxed text-slate">
            Medirevs EHR is still in development and is not generally available yet.
            What you see here describes the system we are building. Where something is
            planned rather than finished, we say so.
          </p>
        </div>
      </section>

      <section className="bg-lab">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="label mb-8 text-white/40">Waitlist</p>
              <h2 className="h2 max-w-[16ch] text-white" data-reveal>
                Be one of the first clinics to use it.
              </h2>
              <p className="mt-8 max-w-[46ch] leading-relaxed text-white/60">
                We are talking to clinics of all sizes while we build. Tell us about
                yours and how you keep records today.
              </p>
            </div>

            <Form
              dark
              source="waitlist"
              submitLabel="Join the waitlist"
              successTitle="You're on the waitlist."
              successBody="We will be in touch as we open up early access."
              fields={[
                { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
                { name: "email", label: "Work email", type: "email", required: true, half: true, autoComplete: "email" },
                { name: "organisation", label: "Facility name", required: true, half: true },
                { name: "role", label: "Your role", half: true },
                { name: "message", label: "How do you keep records today?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
