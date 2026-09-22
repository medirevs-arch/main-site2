import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Hero from "@/components/sections/Hero";
import LabsReveal from "@/components/sections/LabsReveal";
import FootageBand from "@/components/sections/FootageBand";
import ProductEcosystem from "@/components/ProductEcosystem";
import NetworkFigure from "@/components/graphics/NetworkFigure";
import CareJourney from "@/components/graphics/CareJourney";
import { ArticleCard } from "@/components/ArticleCard";
import WaitlistInline from "@/components/WaitlistInline";
import { SectionHeader, TextLink } from "@/components/ui";
import { getAllPosts } from "@/lib/blog";
import { DIETI, DOCTOREVS_URL } from "@/lib/site";

const CONSTRAINTS = [
  {
    index: "01",
    title: "The connection will drop",
    body: "So everything keeps working while it is down, and sorts itself out once it comes back.",
  },
  {
    index: "02",
    title: "The phone is the computer",
    body: "Most people reach healthcare on a mid range Android phone. We build for that first, not as a fallback.",
  },
  {
    index: "03",
    title: "Clinics are not one size",
    body: "A one room practice and a teaching hospital need the same record to work for both of them.",
  },
  {
    index: "04",
    title: "Care crosses buildings",
    body: "A visit, a prescription and a lab result are one story, even when three organisations touch them.",
  },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Reveal />

      {/* The hero recedes into the scene as it leaves — the first depth cue. */}
      <div className="scene">
        <div className="z-recede">
          <Hero />
        </div>
      </div>

      {/* 01 — What we make.
          Products used to sit third, behind an editorial statement and the
          network diagram, so a first-time visitor met roughly 130 words of
          argument before a single product was named. The argument lands
          better once you know what is being argued about. */}
      <section className="scene bg-page">
        <div className="shell band">
          <SectionHeader
            index="01"
            kicker="Products"
            title="Three systems, built to work together."
            className="mb-16 lg:mb-20"
          />
          <div className="z-tilt">
            <ProductEcosystem />
          </div>
        </div>
      </section>

      {/* Dieti. Everything else on this page is beta, in development or early
          access — this is the one thing a visitor can open and use right now,
          so it gets a band of its own directly under the product index rather
          than being left three quarters of the way down the DoctoRevs page.
          A short band between two tall ones, so it reads as an aside with
          something to offer rather than another section to scroll past. */}
      <section className="rule bg-page">
        <div className="shell band-tight">
          <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
            <div>
              <p className="label mb-4 flex items-center gap-3" style={{ color: "var(--color-brand-dark)" }}>
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "var(--color-signal)",
                    animation: "pulse-signal 2.4s ease-in-out infinite",
                  }}
                  aria-hidden="true"
                />
                {DIETI.status}
              </p>
              <p className="max-w-[46ch] text-lg leading-snug tracking-[-0.015em] text-ink">
                One part of it is already working. Photograph a meal, get the
                nutrition back.
              </p>
            </div>

            <TextLink href={DIETI.url} external className="text-brand-dark">
              Try {DIETI.name}
            </TextLink>
          </div>
        </div>
      </section>

      {/* 02 — The connected system. This now explains products the
          reader has already met, instead of standing in front of them. */}
      <section className="scene rule bg-wash">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader
              index="02"
              kicker="The system"
              title="One visit, five people, one record."
              lede="You see a doctor. A prescription goes to a pharmacy. A sample goes to a lab. Right now those handovers happen on paper, over the phone, or not at all, and the record ends up in pieces. Medirevs holds it together."
            />
            <NetworkFigure className="z-tilt lg:-mt-6" />
          </div>
        </div>
      </section>

      {/* 03 — DoctoRevs in motion */}
      <section className="scene rule bg-page">
        <div className="shell band">
          <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeader
              index="03"
              kicker="DoctoRevs"
              title="Follow one visit from start to finish."
              lede="From the moment someone books to the moment a result lands back in their record. One path instead of six disconnected ones."
            />
            <TextLink href="/products/doctorevs" className="text-ink">
              About DoctoRevs
            </TextLink>
          </div>

          <div className="z-approach -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-4">
            <CareJourney />
          </div>

          <p className="label mt-8 flex flex-wrap items-center gap-3 text-slate">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-signal)" }}
              aria-hidden="true"
            />
            DoctoRevs is in beta
            <span className="text-mist" aria-hidden="true">
              ·
            </span>
            <a
              href={DOCTOREVS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-ink"
            >
              launching at doctorevs.com
            </a>
          </p>
        </div>
      </section>

      {/* 04 — Why we build this way.
          Moved down from first position. It is a good statement, but as an
          opener it asked the reader to care about our constraints before they
          knew what we made. Here it is the pivot out of the products and into
          Labs and the mission.

          Paired with a photograph rather than left as centred type: sections
          01 to 03 are diagrams and panels, so this was the one stretch of the
          page carrying no image at all, and the statement is about a place. */}
      <section className="scene rule bg-wash">
        <div className="shell band">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <figure className="z-tilt relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/media/rural-clinic-bp.jpg"
                alt="A nurse taking an elderly woman's blood pressure at an outreach clinic set up under a concrete shelter, with another patient waiting beside them."
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover object-[58%_center]"
              />
            </figure>

            <div className="z-approach">
              <p className="h1 max-w-[15ch] text-balance text-ink" data-reveal>
                We started in Accra, and we build for what we can see from here.
              </p>
              <p
                className="lede measure mt-8 text-charcoal"
                data-reveal
                style={{ ["--delay" as string]: "120ms" }}
              >
                Mobile networks that drop, phones instead of desktops, and clinics
                that range from a single room to a teaching hospital. Those are the
                requirements, not the edge cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Labs. Stays dark in both builds: it is Labs' identity, not a theme. */}
      <div className="scene">
        <div className="z-approach">
          <LabsReveal />
        </div>
      </div>

      {/* Documentary band. A still, not a loop — the moment holds better. */}
      <FootageBand
        poster="/media/home-visit-gombe.jpg"
        label="Health workers visiting a family at home in a rural community, examining a child while the mother looks on."
        kicker="Why any of this matters"
        caption="Everything we build has to work in a room like this one, on the network that room actually has."
      >
        Software is only useful when it reaches the room where care happens.
      </FootageBand>

      {/* 06 — Mission */}
      <section className="scene rule bg-page">
        <div className="shell band">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <SectionHeader
              index="06"
              kicker="Our mission"
              title="Built around the real constraints, not around ideal ones."
              lede="Africa first is not a marketing line for us. It is a list of engineering requirements, and it shapes every decision we make."
            />

            <ul className="z-stagger grid gap-px bg-line sm:grid-cols-2">
              {CONSTRAINTS.map((item, index) => (
                <li
                  key={item.index}
                  className="bg-page p-8"
                  data-reveal="rise"
                  style={{ ["--delay" as string]: `${index * 70}ms` }}
                >
                  <p className="label mb-5" style={{ color: "var(--color-brand)" }}>
                    {item.index}
                  </p>
                  <h3 className="mb-3 text-lg font-medium leading-snug tracking-[-0.015em] text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-charcoal">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14">
            <TextLink href="/mission" className="text-ink">
              Read our mission
            </TextLink>
          </div>
        </div>
      </section>

      {/* 07 — Insights */}
      {posts.length > 0 && (
        <section className="scene rule bg-wash">
          <div className="shell band">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
              <SectionHeader index="07" kicker="Insights" title="Writing from the team." />
              <TextLink href="/blog" className="text-ink">
                All articles
              </TextLink>
            </div>

            {/* Three equal cards rather than one featured plus a stacked pair.
                The asymmetric grid left the featured column around 500px
                shorter than the one beside it, and that hole read as a
                mistake rather than as air. */}
            <div className="z-stagger grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
              {posts.map((post, index) => (
                <div
                  key={post.slug}
                  data-reveal="rise"
                  style={{ ["--delay" as string]: `${index * 90}ms` }}
                >
                  <ArticleCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 08 — Final CTA.
          The form itself, not a button pointing at a form. This is the last
          thing on the page and the cheapest thing we can ask for, so asking
          for it here rather than sending people one more click away is worth
          the extra component. The demo stays available underneath, for the
          clinics that want to see it working before they commit. */}
      <section className="scene relative overflow-hidden bg-navy">
        <div className="shell band-tall relative">
          <div className="z-approach grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-24">
            <div>
              <p className="label mb-8 text-white/40">Waitlist</p>
              <h2 className="h1 max-w-[16ch] text-balance text-white" data-reveal>
                Be first to use it.
              </h2>
              <p className="lede mt-8 max-w-[42ch] text-white/60">
                We are opening access in stages. Leave your email and you go in
                the queue, whether you are a patient, a clinician or running a
                clinic.
              </p>
            </div>

            <div className="lg:pt-4">
              <WaitlistInline dark placement="home-footer" />

              <p className="label mt-10 text-white/35">
                Run a clinic?{" "}
                <Link href="/demo" className="underline underline-offset-4 hover:text-white/70">
                  Request a demo instead
                </Link>
              </p>
            </div>
          </div>

          <p className="label mt-16 border-t border-white/10 pt-8 text-white/35">
            <Link href="/labs#collaborate" className="underline underline-offset-4 hover:text-white/70">
              Researchers and engineers, come and work with Medirevs Labs
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
