import HeroSlides, { type Slide } from "@/components/sections/HeroSlides";
import { Button } from "@/components/ui";
import { CONTACT } from "@/lib/site";

/**
 * The care chain, in order: a community outreach clinic, a hospital ward, the
 * pharmacy counter, the neonatal unit. Four places one record has to travel
 * between — which is the argument the page goes on to make.
 */
const SLIDES: Slide[] = [
  {
    src: "/media/care-outreach-kaduna.jpg",
    alt: "Health workers taking blood samples at a community outreach clinic, seated at a table with an elderly patient.",
    position: "62% center",
  },
  {
    src: "/media/ward-child-care.jpg",
    alt: "A nurse attending to a young child on a parent's lap in a hospital ward.",
    position: "55% center",
  },
  {
    src: "/media/pharmacy-counter.jpg",
    alt: "A pharmacist explaining a medicine to a customer at a pharmacy counter in Lagos.",
    position: "58% center",
  },
  {
    src: "/media/neonatal-unit.jpg",
    alt: "A clinician caring for a newborn in an incubator in a neonatal unit.",
    position: "50% center",
  },
];

/**
 * Homepage hero.
 *
 * A photograph of care actually being delivered, not an abstract loop. The
 * previous version ran a CG optical field behind the headline, which said
 * nothing about the work and read as decoration.
 *
 * A still rather than video: the subject is people, and a photograph holds a
 * moment better than a three-second loop of it. It also means the largest
 * thing on the page is a real image rather than 800KB of media.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-lab pb-14 pt-32 sm:min-h-[86svh] sm:pb-20">
      <HeroSlides slides={SLIDES} />

      {/* Scrim: weighted hard to the left, where the type sits, and released
          quickly across the frame so the people stay lit. Two layers stack, so
          each is lighter than it looks — pushed any further the photograph
          goes grey and the whole point of using it is lost. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(96deg, rgba(7,16,15,0.92) 0%, rgba(7,16,15,0.74) 30%, rgba(7,16,15,0.34) 58%, rgba(7,16,15,0.12) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to top, rgba(7,16,15,0.72) 0%, rgba(7,16,15,0.34) 55%, rgba(7,16,15,0) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Narrow screens crop into the busiest part of the frame, so the type
          needs a flat lift as well as the gradients. */}
      <div className="absolute inset-0 bg-lab/45 sm:hidden" aria-hidden="true" />

      <div className="shell relative w-full">
        <p className="label mb-8 flex items-center gap-3 text-white/70">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-signal)" }}
            aria-hidden="true"
          />
          Medirevs, {CONTACT.address.city}, {CONTACT.address.country}
        </p>

        <h1 className="display max-w-[16ch] text-balance text-white">
          Building better ways to deliver healthcare.
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <p className="lede max-w-[50ch] text-white/85">
            Clinical software, health data tools and medical technology, built
            for the way care actually works here — mobile networks, connections
            that drop, and clinics of every size.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href="/products" variant="light">
              Explore Medirevs
            </Button>
            <Button href="/demo" variant="ghost">
              Request a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
