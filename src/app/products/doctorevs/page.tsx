import type { Metadata } from "next";
import Form from "@/components/Form";
import Gallery from "@/components/Gallery";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ScrollVideo from "@/components/ScrollVideo";
import CareJourney from "@/components/graphics/CareJourney";
import { Button, SectionHeader, StatusChip } from "@/components/ui";
import { DOCTOREVS_GALLERY } from "@/lib/galleries";
import { DOCTOREVS_URL, PRODUCTS } from "@/lib/site";

const product = PRODUCTS[0];

export const metadata: Metadata = {
  title: "DoctoRevs | Telemedicine platform",
  description:
    "DoctoRevs connects patients, doctors, pharmacists and labs. Book appointments, talk by video or chat, get prescriptions filled and see lab results in one place. Currently in beta.",
  alternates: { canonical: "/products/doctorevs" },
  openGraph: {
    title: "DoctoRevs | Telemedicine platform",
    description:
      "One platform connecting patients, doctors, pharmacists and medical laboratories. Currently in beta.",
    url: "/products/doctorevs",
  },
};

const ROLES = [
  {
    role: "For patients",
    body: "Find a doctor nearby or talk to one remotely. Book, consult, get your prescription, and keep the record.",
    points: ["Book appointments", "Video and chat consultations", "Prescriptions and results in one place"],
  },
  {
    role: "For doctors",
    body: "See patients remotely, write prescriptions digitally, and order lab work without leaving the consultation.",
    points: ["Remote consultations", "Electronic prescribing", "Digital lab requests"],
  },
  {
    role: "For pharmacists",
    body: "Get prescriptions directly instead of trying to read handwriting, and track orders and stock.",
    points: ["Direct prescription intake", "Order tracking", "Patient connection"],
  },
  {
    role: "For laboratories",
    body: "Take requests in digitally and send results back safely to the record they came from.",
    points: ["Digital request intake", "Secure result upload", "Streamlined documentation"],
  },
];

export default function DoctoRevsPage() {
  return (
    <>
      <Reveal />

      <PageHero
        kicker="Products / 01"
        title="DoctoRevs"
        lede={product.summary}
        meta={[
          { label: "Status", value: "Beta" },
          { label: "Built for", value: "Patients, doctors, pharmacists, laboratories" },
          { label: "Platform", value: "Mobile-first web and app" },
          {
            label: "Launching at",
            value: (
              <a
                href={DOCTOREVS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-brand-dark"
              >
                doctorevs.com ↗
              </a>
            ),
          },
        ]}
      >
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <StatusChip status="Beta" />
          <Button href="#beta">Join the beta</Button>
        </div>
      </PageHero>

      {/* Scroll-driven sequence. Nothing plays on its own: the video moves
          only as far as you scroll, and runs backwards if you scroll up. */}
      <section className="bg-lab">
        <ScrollVideo
          mp4="/media/doctorevs-network.mp4"
          poster="/media/doctorevs-network-poster.jpg"
          label="A consultation on a phone opens out into a wider network of connected care."
          heightVh={200}
        >
          <div className="pointer-events-none absolute inset-0 flex items-end">
            <div
              className="absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background:
                  "linear-gradient(to top, rgba(7,16,15,0.9) 0%, rgba(7,16,15,0) 100%)",
              }}
              aria-hidden="true"
            />
            <div className="shell relative w-full pb-14 sm:pb-20">
              <p className="label mb-5 text-white/50">Scroll to follow it</p>
              <p className="h3 max-w-[26ch] text-white">
                It starts with one consultation on a phone, and opens out into a
                network of care around the patient.
              </p>
            </div>
          </div>
        </ScrollVideo>
      </section>

      {/* The journey */}
      <section className="rule bg-wash">
        <div className="shell band">
          <SectionHeader
            index="01"
            kicker="How it works"
            title="One path, not six disconnected ones."
            lede="Every handover is a place where information usually gets lost. DoctoRevs is built to close those gaps."
            className="mb-16"
          />
          <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-4">
            <CareJourney />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="rule">
        <div className="shell band">
          <SectionHeader
            index="02"
            kicker="Four sides"
            title="This only works if everyone involved is on it."
            className="mb-16"
          />

          <div className="grid gap-px bg-line sm:grid-cols-2">
            {ROLES.map((item, index) => (
              <div
                key={item.role}
                className="bg-page p-8 sm:p-10"
                data-reveal="rise"
                style={{ ["--delay" as string]: `${index * 70}ms` }}
              >
                <h3 className="h3 mb-4">{item.role}</h3>
                <p className="mb-8 max-w-[40ch] leading-relaxed text-charcoal">{item.body}</p>
                <ul className="space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-baseline gap-3 text-[0.9375rem] text-charcoal">
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ background: "var(--color-brand)" }}
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="rule bg-wash">
        <div className="shell band">
          <SectionHeader index="03" kicker="Capabilities" title="What DoctoRevs does." className="mb-16" />
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

      {/* Gallery — editable via src/lib/galleries.ts */}
      <section className="rule">
        <div className="shell band">
          <SectionHeader
            index="04"
            kicker="Inside the product"
            title="Screens and photography."
            lede="Screens and photos from the DoctoRevs beta."
            className="mb-16"
          />
          <Gallery items={DOCTOREVS_GALLERY} placeholderLabel="DoctoRevs" columns={3} />
        </div>
      </section>

      {/* Beta signup */}
      <section id="beta" className="scroll-mt-24 bg-lab">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="label mb-8 text-white/40">Join the beta</p>
              <h2 className="h2 max-w-[16ch] text-white" data-reveal>
                Try DoctoRevs before general release.
              </h2>
              <p className="mt-8 max-w-[46ch] leading-relaxed text-white/60">
                We are working with patients, doctors, pharmacists and labs during the
                beta. Tell us how you would use it and we will get in touch.
              </p>
              <p className="label mt-10 text-white/40">
                <a
                  href={DOCTOREVS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-white/70"
                >
                  doctorevs.com ↗
                </a>
              </p>
            </div>

            <Form
              dark
              source="beta"
              submitLabel="Request beta access"
              successTitle="You're on the list."
              successBody="We will be in touch as places open up."
              fields={[
                { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
                {
                  name: "role",
                  label: "I am a",
                  type: "select",
                  required: true,
                  half: true,
                  options: ["Patient", "Doctor", "Pharmacist", "Laboratory", "Health facility", "Other"],
                },
                { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
                { name: "organisation", label: "Facility or organisation" },
                { name: "message", label: "How would you use DoctoRevs?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
