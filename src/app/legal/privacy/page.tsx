import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { CONTACT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${SITE.legalName} handles the information you submit through this website.`,
  alternates: { canonical: "/legal/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Privacy"
        lede={`How ${SITE.legalName} handles information submitted through this website.`}
      />

      <section className="rule">
        <div className="shell band">
          <div className="prose measure">
            <p className="label" style={{ color: "var(--color-brand-dark)" }}>
              Draft, pending legal review
            </p>
            <p>
              This page explains what happens to information you send through
              medirevs.com. It describes what we do today. It is not a substitute for a
              policy reviewed by a lawyer.
            </p>

            <h2>What we collect</h2>
            <p>
              We collect only what you type into a form on this site: your name, email
              address, and where a form asks for them, your organisation, role,
              telephone number and message. The newsletter form collects an email address
              only.
            </p>
            <p>
              We do not ask for health information anywhere on this website, and you
              should not send any. If you need to discuss a clinical matter, contact us
              and we will arrange an appropriate channel.
            </p>

            <h2>Why we collect it</h2>
            <p>
              To respond to your enquiry, to arrange a demonstration, to manage beta and
              waitlist access, or to send you the newsletter if you subscribed.
            </p>

            <h2>Where it goes</h2>
            <p>
              Submissions are transmitted from our server to a Google Workspace
              spreadsheet controlled by {SITE.legalName}. They are not sold, and they are
              not shared with third parties for marketing.
            </p>

            <h2>How long we keep it</h2>
            <p>[Retention period to be confirmed.]</p>

            <h2>Your choices</h2>
            <p>
              You can ask us to correct or delete the details you have submitted, or
              unsubscribe from the newsletter at any time, by emailing{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>

            <h2>Contact</h2>
            <p>
              {SITE.legalName}
              <br />
              {CONTACT.address.full}
              <br />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
