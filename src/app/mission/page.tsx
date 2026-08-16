import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import NetworkFigure from "@/components/graphics/NetworkFigure";
import FootageBand from "@/components/sections/FootageBand";
import { Button, EditorialStatement, SectionHeader } from "@/components/ui";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Medirevs builds health technology for how care really works in Africa. Mobile first, light on data, works offline, and made for clinics of every size.",
  alternates: { canonical: "/mission" },
};

const CONSTRAINTS = [
  {
    index: "01",
    title: "Connectivity",
    body: "A system that stops when the network stops is not really deployed, it is just installed. We treat a patchy connection as the normal case, and everything catches up once you are back online.",
  },
  {
    index: "02",
    title: "Access",
    body: "Distance, cost and time are the barriers people actually run into. Remote visits and connected pharmacy and lab steps exist to shorten all three.",
  },
  {
    index: "03",
    title: "Workflow",
    body: "Software that adds steps gets abandoned, and rightly so. If a tool is slower than the paper it replaces, the paper wins. So it has to be faster on day one, not eventually.",
  },
  {
    index: "04",
    title: "Mobility",
    body: "A mid range Android phone is the main computer in most places we build for. It sets our budget for page weight, interaction and readability.",
  },
  {
    index: "05",
    title: "Infrastructure",
    body: "Power, connectivity and maintenance are all unreliable. Designs that assume otherwise fail quietly, months after anyone is still watching.",
  },
  {
    index: "06",
    title: "Practical deployment",
    body: "A one room practice and a teaching hospital need the same record to work at very different scales, next to the systems they already run.",
  },
];

export default function MissionPage() {
  return (
    <>
      <Reveal />

      <PageHero
        kicker="Our mission"
        title="Health technology built for how care really works here."
        lede="Built in Africa, for Africa. Not as a slogan, but as a spec we build to."
      />

      <section className="rule bg-wash">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="prose">
              <p>
                We started in {CONTACT.address.city}. We build for the health system we
                know, including its strengths, its gaps and the very practical
                constraints that most health software is not built to survive.
              </p>
              <p>
                That starting point produces different software. Not a lighter version of
                something built elsewhere. It is a different set of decisions about where
                data lives, what happens when the network drops, which device comes first,
                and how many organisations have to agree before someone can be helped.
              </p>
              <p>
                The ambition is not to build a product. It is to build the connective
                layer that lets healthcare work as one system. Clinical software, health
                data, and now, through <a href="/labs">Medirevs Labs</a>, the physical
                equipment that the digital side depends on.
              </p>
            </div>
            <NetworkFigure className="lg:pt-8" />
          </div>
        </div>
      </section>

      <FootageBand
        tone="navy"
        height="short"
        webm="/media/clinic-clinician.webm"
        mp4="/media/clinic-clinician.mp4"
        poster="/media/clinic-clinician-poster.jpg"
        label="A clinician wearing a stethoscope in a hospital corridor."
        kicker="Built in Africa, for Africa"
        caption="Footage from a working clinical setting, not a studio."
      >
        We are building for the people already doing this work.
      </FootageBand>

      <section className="band-tall">
        <EditorialStatement footnote="Every constraint below is something we build against, not a hardship we work around.">
          Africa first is a spec, not a positioning statement.
        </EditorialStatement>
      </section>

      <section className="rule">
        <div className="shell band">
          <SectionHeader
            index="01"
            kicker="What we design around"
            title="Six constraints."
            className="mb-16"
          />
          <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {CONSTRAINTS.map((item, index) => (
              <div
                key={item.index}
                className="bg-page p-8 sm:p-10"
                data-reveal="rise"
                style={{ ["--delay" as string]: `${index * 60}ms` }}
              >
                <p className="label mb-6" style={{ color: "var(--color-brand)" }}>
                  {item.index}
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

      <section className="bg-navy">
        <div className="shell band text-center">
          <h2 className="h2 mx-auto max-w-[24ch] text-balance text-white" data-reveal>
            Working on the same problem? Get in touch.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact" variant="light">
              Contact Medirevs
            </Button>
            <Button href="/labs" variant="ghost">
              Medirevs Labs
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
