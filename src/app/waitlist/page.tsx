import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import WaitlistInline from "@/components/WaitlistInline";
import { Aperture } from "@/components/graphics/Aperture";
import { CONTACT, DOCTOREVS_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Be among the first to use DoctoRevs and Medirevs EHR. Early access before we launch publicly, for patients, clinicians and clinics.",
  alternates: { canonical: "/waitlist" },
  openGraph: {
    title: "Join the Medirevs waitlist",
    description:
      "Early access to DoctoRevs and Medirevs EHR before we launch publicly. One email address, nothing else.",
    url: "/waitlist",
  },
};

/** What joining actually gets you. A promise we can keep, not a maybe. */
const PROMISE = [
  "Access before we open to everyone, in the order people joined",
  "A say in what gets built, because we ask the list before we decide",
  "At most one email a month, and nothing that is not about the product",
];

const AUDIENCES = [
  {
    who: "If you are a patient",
    what: "Booking, consultations, prescriptions and your results in one place, on the phone you already carry.",
  },
  {
    who: "If you are a clinician",
    what: "Consultations, e-prescribing and lab requests that stay attached to the same record.",
  },
  {
    who: "If you run a clinic",
    what: "Records that keep working when the connection drops, and sync themselves once it returns.",
  },
];

export default function WaitlistPage() {
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
              <p className="label mb-10 text-white/40">Waitlist</p>

              <h1 className="h1 max-w-[13ch] text-balance text-white">
                Be first to use it.
              </h1>

              <p className="lede mt-8 max-w-[44ch] text-white/65">
                We are building in the open and opening access in stages. Leave your
                email and you go in the queue, whether you are a patient, a clinician
                or running a clinic.
              </p>

              <ul className="mt-12 space-y-4 border-t border-white/10 pt-8">
                {PROMISE.map((item) => (
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
                Run a clinic and want to see it working first?{" "}
                <Link href="/demo" className="underline underline-offset-4 hover:text-white/70">
                  Request a demo
                </Link>
              </p>
            </div>

            <div className="lg:pt-4">
              <WaitlistInline dark placement="waitlist-page" />

              <div className="mt-14 grid gap-px bg-white/10">
                {AUDIENCES.map((item) => (
                  <div key={item.who} className="bg-lab py-6">
                    <p className="label mb-2 text-brand-bright">{item.who}</p>
                    <p className="text-[0.9375rem] leading-relaxed text-white/60">{item.what}</p>
                  </div>
                ))}
              </div>

              <p className="mt-10 text-sm leading-relaxed text-white/40">
                DoctoRevs is already in beta at{" "}
                <a
                  href={DOCTOREVS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-white/70"
                >
                  doctorevs.com
                </a>
                . Questions before you join? Email{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="underline underline-offset-4 hover:text-white/70"
                >
                  {CONTACT.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
