import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import OpticalStackFigure from "@/components/graphics/OpticalStackFigure";
import ProjectTimeline, { type Milestone } from "@/components/graphics/ProjectTimeline";
import { Button, SectionHeader } from "@/components/ui";
import { MICROSCOPE_GALLERY } from "@/lib/galleries";
import { LABS } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Low-Cost Microscope | Medirevs Labs",
  description:
    "A Medirevs Labs project building affordable microscopes for diagnosis, with a student team from the University of Ghana School of Engineering Sciences.",
  alternates: { canonical: "/labs/low-cost-microscope" },
  openGraph: {
    title: "The Low-Cost Microscope | Medirevs Labs",
    description:
      "Building affordable microscopes with a student team from the University of Ghana School of Engineering Sciences.",
    url: "/labs/low-cost-microscope",
  },
};

const MILESTONES: Milestone[] = [
  { phase: "Research", status: "active", body: "Defining the problem against how microscopy is actually used, serviced and paid for." },
  { phase: "Design", status: "active", body: "Optical and mechanical approach, developed with the collaborating student team." },
  { phase: "Prototype", status: "planned", body: "Physical units built to test design decisions against reality." },
  { phase: "Testing", status: "planned", body: "Durability, usability and optical performance in the intended settings." },
  { phase: "Iteration", status: "planned", body: "Revision against results, published either way." },
];

const QUESTIONS = [
  "What level of optical performance is genuinely required for the routine work this instrument is intended to support?",
  "Which components dominate cost, and which of those can be substituted without compromising what matters?",
  "What can realistically be serviced or replaced locally, and what would strand an instrument if it failed?",
  "How does the design hold up against heat, dust, humidity and power interruption?",
  "What does an operator need to be able to do with minimal training?",
  "Where does manufacturing at small volume become viable?",
];

const PHILOSOPHY = [
  {
    title: "Cost is the constraint, not the outcome",
    body: "We treat affordability as a design input from the first decision, not something to optimise at the end. That changes which approaches are even worth trying.",
  },
  {
    title: "Serviceability is a performance figure",
    body: "An instrument that cannot be repaired near where it is used has a short working life, regardless of how well it performs on the day it arrives.",
  },
  {
    title: "The environment is the specification",
    body: "Heat, dust, unreliable power and non specialist operators are the normal conditions. They are not edge cases to handle later.",
  },
];

export default function MicroscopePage() {
  return (
    <>
      <Reveal />

      <PageHero
        kicker="Medirevs Labs / Project 01"
        title="The Low-Cost Microscope"
        lede="Microscopy sits underneath a lot of routine lab work. The equipment is expensive to buy, expensive to maintain, and hard to fix once it breaks. This project is about that gap."
        meta={[
          { label: "Status", value: "In development" },
          { label: "Collaborating institution", value: `${LABS.collaborator.institution}, ${LABS.collaborator.unit}` },
          { label: "Discipline", value: "Optics, mechanical design, manufacturing" },
          { label: "Specifications", value: "[To be confirmed]" },
        ]}
      />

      {/* Challenge */}
      <section className="rule bg-wash">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeader index="01" kicker="The challenge" title="Why affordable microscopy matters." />
            <div className="prose">
              <p>
                A microscope is not an exotic piece of kit. It is a basic one, which is
                exactly why its absence matters so much. Where a lab has no working
                microscope, a whole class of routine testing either does not happen or has
                to travel. Travelling costs a patient time they may not have.
              </p>
              <p>
                The barrier is rarely one price tag. It is the purchase cost, plus
                servicing, plus how hard it is to get parts, plus the fact that a broken
                instrument often stays broken. A cheap microscope you cannot maintain is
                not actually cheap.
              </p>
              <p>
                So the engineering problem is bigger than optics. What can we build, at
                what cost, that keeps working in the conditions it will actually live in?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design philosophy */}
      <section className="rule">
        <div className="shell band">
          <SectionHeader index="02" kicker="Design philosophy" title="Three commitments." className="mb-16" />
          <div className="grid gap-px bg-line lg:grid-cols-3">
            {PHILOSOPHY.map((item, index) => (
              <div
                key={item.title}
                className="bg-page p-8 sm:p-10"
                data-reveal="rise"
                style={{ ["--delay" as string]: `${index * 80}ms` }}
              >
                <p className="label mb-6" style={{ color: "var(--color-brand)" }}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mb-4 text-lg font-medium leading-snug tracking-[-0.015em] text-ink">
                  {item.title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering process — schematic */}
      <section className="bg-lab text-white">
        <div className="shell band">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <SectionHeader
                dark
                index="03"
                kicker="Engineering process"
                title="Working the problem element by element."
                lede="A microscope is a stack of decisions. Illumination, condenser, stage, objective, tube, eyepiece. Each one has its own cost, tolerance and ways of failing, and each one can be rethought."
              />
              <p className="mt-8 max-w-[46ch] text-sm leading-relaxed text-white/45">
                The diagram beside this shows how transmitted light microscopy is
                generally arranged. It is not our prototype, and it carries no dimensions,
                magnifications or materials, because none are confirmed yet.
              </p>
            </div>
            <OpticalStackFigure className="text-white" />
          </div>
        </div>
      </section>

      {/* Prototype gallery */}
      <section className="rule">
        <div className="shell band">
          <SectionHeader
            index="04"
            kicker="Prototype"
            title="Photography from the work."
            lede="We will publish photos of the prototype and the process as the project moves. Where an image is a concept rather than finished hardware, we label it."
            className="mb-16"
          />
          <Gallery items={MICROSCOPE_GALLERY} placeholderLabel="Prototype photography" columns={3} />
        </div>
      </section>

      {/* Research questions */}
      <section className="rule bg-wash">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader
              index="05"
              kicker="Research questions"
              title="What we are trying to answer."
              lede="We have written these as questions, because that is what they still are."
            />
            <ol className="grid gap-px bg-line">
              {QUESTIONS.map((question, index) => (
                <li
                  key={question}
                  className="flex items-baseline gap-6 bg-wash py-6"
                  data-reveal="rise"
                  style={{ ["--delay" as string]: `${index * 50}ms` }}
                >
                  <span className="label shrink-0 text-mist">{String(index + 1).padStart(2, "0")}</span>
                  <span className="max-w-[54ch] leading-relaxed text-charcoal">{question}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="rule">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader
              index="06"
              kicker="Milestones"
              title="Project timeline."
              lede="Dates appear here once they are confirmed, and not before."
            />
            <ProjectTimeline milestones={MILESTONES} />
          </div>
        </div>
      </section>

      {/* Team & collaboration */}
      <section className="rule bg-wash">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader index="07" kicker="Team" title="Who is doing the work." />
            <div>
              <div className="border-l-2 pl-8" style={{ borderColor: "var(--color-brand)" }}>
                <p className="h3">{LABS.collaborator.institution}</p>
                <p className="mt-2 text-slate">{LABS.collaborator.unit}</p>
                <p className="mt-6 max-w-[52ch] leading-relaxed text-charcoal">
                  {LABS.collaborator.note}
                </p>
              </div>
              <p className="label mt-8 max-w-[52ch] leading-relaxed text-slate">
                Referenced with permission. No institutional endorsement is implied, and
                no University of Ghana marks are used.
              </p>

              <div className="mt-12 border-t border-line pt-8">
                <p className="label mb-4 text-slate">Updates</p>
                <p className="max-w-[52ch] leading-relaxed text-charcoal">
                  We publish project updates as{" "}
                  <Link href="/blog" className="underline underline-offset-4">
                    Labs notes
                  </Link>
                  , including results that do not go the way we hoped.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="shell band text-center">
          <h2 className="h2 mx-auto max-w-[24ch] text-balance text-white" data-reveal>
            If this is your field, we would like to hear from you.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/labs#collaborate" variant="light">
              Collaborate with Medirevs Labs
            </Button>
            <Button href="/labs" variant="ghost">
              Back to Labs
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
