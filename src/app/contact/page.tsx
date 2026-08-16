import type { Metadata } from "next";
import Form from "@/components/Form";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { CONTACT, SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Medirevs at ${CONTACT.email}. We are based in ${CONTACT.address.full}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Reveal />

      <PageHero
        kicker="Contact"
        title="Talk to us."
        lede="Questions about the products, setting them up in your clinic, research or press. This goes straight to the team."
      />

      <section className="rule">
        <div className="shell band">
          <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
            <Form
              source="contact"
              submitLabel="Send message"
              successTitle="Message sent."
              successBody="Thanks. We will get back to you shortly."
              fields={[
                { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
                { name: "organisation", label: "Facility or organisation", half: true },
                { name: "role", label: "Your role", half: true },
                {
                  name: "product",
                  label: "What is this about?",
                  type: "select",
                  half: true,
                  options: [
                    "DoctoRevs",
                    "Medirevs EHR",
                    "Data Solutions & AI",
                    "Medirevs Labs",
                    "Press",
                    "Something else",
                  ],
                },
                { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
                { name: "message", label: "Message", type: "textarea", required: true },
              ]}
            />

            <aside>
              <div className="border-t border-line pt-6">
                <p className="label mb-3 text-slate">Email</p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-lg text-ink underline-offset-4 hover:underline"
                >
                  {CONTACT.email}
                </a>
              </div>

              <div className="mt-10 border-t border-line pt-6">
                <p className="label mb-3 text-slate">Telephone</p>
                <ul className="space-y-2">
                  {CONTACT.phones.map((phone) => (
                    <li key={phone.value}>
                      <a href={phone.href} className="text-lg text-ink underline-offset-4 hover:underline">
                        <span aria-hidden="true">{phone.flag}</span>{" "}
                        <span className="sr-only">{phone.country}: </span>
                        {phone.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 border-t border-line pt-6">
                <p className="label mb-3 text-slate">Office</p>
                <p className="text-lg text-ink">{CONTACT.address.full}</p>
              </div>

              <div className="mt-10 border-t border-line pt-6">
                <p className="label mb-4 text-slate">Elsewhere</p>
                <ul className="flex flex-wrap gap-6">
                  {SOCIALS.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label text-slate transition-colors hover:text-ink"
                      >
                        {social.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
