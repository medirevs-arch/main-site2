import type { Metadata } from "next";
import Link from "next/link";
import Form from "@/components/Form";
import Gallery from "@/components/Gallery";
import Reveal from "@/components/Reveal";
import VideoBackground from "@/components/VideoBackground";
import { FieldRing } from "@/components/graphics/Aperture";
import LensFigure from "@/components/graphics/LensFigure";
import ProjectTimeline, { type Milestone } from "@/components/graphics/ProjectTimeline";
import { Button, SectionHeader, TextLink } from "@/components/ui";
import { LABS_COLLABORATION_GALLERY } from "@/lib/galleries";
import { getPostsByCategory } from "@/lib/blog";
import { LABS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medirevs Labs",
  description:
    "Applied biomedical engineering and medical-device research at Medirevs. First project: a low-cost microscope developed with a student team from the University of Ghana School of Engineering Sciences.",
  alternates: { canonical: "/labs" },
  openGraph: {
    title: "Medirevs Labs | Engineering healthcare from first principles",
    description: "Applied biomedical engineering and medical-device research at Medirevs.",
    url: "/labs",
  },
};

const MILESTONES: Milestone[] = [
  {
    phase: "Research",
    status: "active",
    body: "Working out where microscopy actually fails in practice. Cost, servicing, training, and the conditions these instruments live in.",
  },
  {
    phase: "Design",
    status: "active",
    body: "Working through the optics and the mechanical design with the student team.",
  },
  {
    phase: "Prototype",
    status: "planned",
    body: "Building real units, so we can test the design against reality instead of against drawings.",
  },
  {
    phase: "Testing",
    status: "planned",
    body: "Checking durability, ease of use and optical performance in the places it is meant to be used.",
  },
  {
    phase: "Iteration",
    status: "planned",
    body: "Changing the design based on what testing shows, and publishing what we learn either way.",
  },
];

const AUDIENCES = [
  "Researchers",
  "Biomedical engineers",
  "Clinicians and laboratory scientists",
  "Universities",
  "Funders",
  "Manufacturing partners",
];

export default function LabsPage() {
  const labsPosts = getPostsByCategory("Medirevs Labs");

  return (
    <>
      <Reveal />

      {/* Hero */}
      <section className="relative flex min-h-[85svh] items-end overflow-hidden bg-lab pb-16 pt-40 sm:pb-24">
        <VideoBackground
          eager
          webm="/media/labs-objective.webm"
          mp4="/media/labs-objective.mp4"
          poster="/media/labs-objective-poster.jpg"
          label="A macro view of a laboratory microscope objective lens."
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(85deg, rgba(7,16,15,0.97) 0%, rgba(7,16,15,0.93) 45%, rgba(7,16,15,0.62) 78%, rgba(7,16,15,0.75) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to top, rgba(7,16,15,0.95) 0%, rgba(7,16,15,0.7) 45%, rgba(7,16,15,0) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-lab/50 sm:hidden" aria-hidden="true" />

        <div className="shell relative w-full">
          <p className="label mb-10 flex items-center gap-3 text-white/45">
            <span style={{ color: "var(--color-optic)" }}>Medirevs Labs</span>
            <span className="text-white/20" aria-hidden="true">/</span>
            Research &amp; devices
          </p>

          <h1 className="display max-w-[11ch] text-balance text-white">
            Medirevs <span style={{ color: "var(--color-optic)" }}>Labs</span>
          </h1>

          <p className="lede mt-10 max-w-[52ch] text-white/70">
            {LABS.positioning} Applied biomedical engineering and medical-device
            research, developed for the places where equipment is scarcest.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/labs/low-cost-microscope" variant="light">
              The Low-Cost Microscope
            </Button>
            <Button href="#collaborate" variant="ghost">
              Collaborate with Labs
            </Button>
          </div>
        </div>
      </section>

      {/* Why Labs exists */}
      <section className="bg-lab">
        <div className="shell band-tall">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <SectionHeader
                dark
                index="01"
                kicker="Why Labs exists"
                title="Software can move a result. It cannot produce one."
                lede="Everything else we build assumes a diagnosis can be made and then needs to travel. But a connected system can only be as good as the things it connects. Where there is no working equipment, even the best referral just sends someone towards nothing."
              />
              <p
                className="mt-8 max-w-[52ch] leading-relaxed text-white/55"
                data-reveal
                style={{ ["--delay" as string]: "140ms" }}
              >
                Labs works on the physical end of that problem. Instruments and devices,
                where cost, repairability and the conditions they will live in are the
                starting point rather than an afterthought.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <LensFigure className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Flagship project */}
      <section className="border-t border-white/10 bg-lab-raised">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <SectionHeader
              dark
              index="02"
              kicker="Flagship project"
              title="The Low-Cost Microscope"
              lede="Microscopy sits underneath a lot of routine lab work. The equipment is expensive to buy, expensive to maintain, and hard to fix once it breaks."
            />

            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10">
                <VideoBackground
                  webm="/media/labs-objective.webm"
                  mp4="/media/labs-objective.mp4"
                  poster="/media/labs-objective-poster.jpg"
                  label="A macro view of a laboratory microscope objective lens."
                />
                <div className="absolute inset-0 bg-lab/25" aria-hidden="true" />
                <FieldRing className="absolute inset-0 h-full w-full text-white/25" />
                <p className="label absolute bottom-5 left-5 text-white/60">
                  Conceptual visual, not the prototype
                </p>
              </div>

              <p className="mt-8 max-w-[52ch] leading-relaxed text-white/60">
                We are not publishing specifications yet. No magnification figures, no
                target cost, no timeline. Those numbers matter too much to guess at in
                public before the work backs them up.
              </p>

              <div className="mt-8">
                <TextLink href="/labs/low-cost-microscope" className="text-white">
                  Read the project
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="border-t border-white/10 bg-lab">
        <div className="shell band">
          <SectionHeader
            dark
            index="03"
            kicker="Collaboration"
            title="Developed with the University of Ghana."
            className="mb-14"
          />

          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="border-l-2 pl-8" style={{ borderColor: "var(--color-optic)" }}>
              <p className="h3 text-white">{LABS.collaborator.institution}</p>
              <p className="mt-2 text-white/55">{LABS.collaborator.unit}</p>
              <p className="mt-8 max-w-[46ch] leading-relaxed text-white/60">
                {LABS.collaborator.note}
              </p>
              <p className="label mt-10 text-white/30">
                Referenced with permission. No institutional endorsement is implied.
              </p>
            </div>

            <div>
              <p className="label mb-6 text-white/40">From the collaboration</p>
              <Gallery
                dark
                items={LABS_COLLABORATION_GALLERY}
                placeholderLabel="Collaboration photography"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="border-t border-white/10 bg-lab-raised">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader
              dark
              index="04"
              kicker="Milestones"
              title="Where the work stands."
              lede="Phases, not promises. We publish dates once they are real."
            />
            <ProjectTimeline dark milestones={MILESTONES} />
          </div>
        </div>
      </section>

      {/* Labs notes */}
      {labsPosts.length > 0 && (
        <section className="border-t border-white/10 bg-lab">
          <div className="shell band">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <SectionHeader dark index="05" kicker="Labs notes" title="Writing from the lab." />
              <TextLink href="/blog" className="text-white/70">
                All articles
              </TextLink>
            </div>
            <ul>
              {labsPosts.map((post) => (
                <li key={post.slug} className="border-t border-white/10">
                  <Link href={`/blog/${post.slug}`} className="group/link block py-7">
                    <span className="label text-white/35">{post.readingMinutes} min read</span>
                    <span className="mt-3 block max-w-[40ch] text-xl font-medium leading-snug tracking-[-0.02em] text-white">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Call for collaboration */}
      <section id="collaborate" className="scroll-mt-24 border-t border-white/10 bg-lab-raised">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="label mb-8" style={{ color: "var(--color-optic)" }}>
                Call for collaboration
              </p>
              <h2 className="h2 max-w-[16ch] text-white" data-reveal>
                Work with Medirevs Labs.
              </h2>
              <p className="mt-8 max-w-[44ch] leading-relaxed text-white/60">
                This kind of engineering is slow, and it goes better with other people.
                If any of this is your field, we would like to hear from you.
              </p>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {AUDIENCES.map((audience) => (
                  <li key={audience} className="label text-white/45">
                    {audience}
                  </li>
                ))}
              </ul>
            </div>

            <Form
              dark
              source="labs"
              submitLabel="Collaborate with Labs"
              successTitle="Thanks, we have your message."
              successBody="Someone from Medirevs Labs will be in touch."
              fields={[
                { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
                { name: "organisation", label: "Institution or organisation", half: true },
                {
                  name: "role",
                  label: "I am a",
                  type: "select",
                  half: true,
                  options: AUDIENCES,
                },
                { name: "message", label: "What would you like to work on?", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
