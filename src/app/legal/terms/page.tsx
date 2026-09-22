import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { CONTACT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for the ${SITE.name} website.`,
  alternates: { canonical: "/legal/terms" },
};

/** Bump this whenever the wording below changes. */
const LEGAL_UPDATED = "9 September 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Terms" lede={`Terms of use for the ${SITE.name} website.`} />

      <section className="rule">
        <div className="shell band">
          <div className="prose measure">
            <p className="label flex flex-wrap items-center gap-x-3 gap-y-1" style={{ color: "var(--color-brand-dark)" }}>
              Draft, pending legal review
              <span className="text-mist" aria-hidden="true">
                ·
              </span>
              <span className="text-slate">Last updated {LEGAL_UPDATED}</span>
            </p>

            <h2>About this site</h2>
            <p>
              This website is operated by {SITE.legalName}, {CONTACT.address.full}. It
              describes products and research projects, some of which are in development
              and not generally available.
            </p>

            <h2>Not medical advice</h2>
            <p>
              Nothing on this website is medical advice, and nothing here is intended to
              diagnose, treat or manage any condition. Products described as offering
              decision support are assistive tools for qualified clinicians and do not
              replace clinical judgement. If you need medical help, contact a qualified
              healthcare professional.
            </p>

            <h2>Product status</h2>
            <p>
              Where a product is described as in beta, in development or planned, that
              status is stated on the relevant page. Descriptions of planned capability
              are not commitments to a delivery date.
            </p>

            <h2>Research projects</h2>
            <p>
              Medirevs Labs projects are research and development work. No specification,
              performance figure or regulatory status should be inferred from any image
              or description on this site unless it is explicitly stated.
            </p>

            <h2>Third-party names</h2>
            <p>
              Institutions named on this site are named factually, in the context of
              stated collaborations. No endorsement is implied, and no third-party marks
              are used.
            </p>

            <h2>Contact</h2>
            <p>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
