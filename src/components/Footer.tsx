import Image from "next/image";
import Link from "next/link";
import { CONTACT, DOCTOREVS_URL, PRODUCTS, SITE, SOCIALS } from "@/lib/site";
import NewsletterForm from "./NewsletterForm";

const COLUMNS = [
  {
    title: "Products",
    links: [
      ...PRODUCTS.map((p) => ({ label: p.name, href: p.href, external: false })),
      { label: "DoctoRevs app", href: DOCTOREVS_URL, external: true },
    ],
  },
  {
    title: "Medirevs Labs",
    links: [
      { label: "Overview", href: "/labs", external: false },
      { label: "Low-Cost Microscope", href: "/labs/low-cost-microscope", external: false },
      { label: "Collaborate with Labs", href: "/labs#collaborate", external: false },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Mission", href: "/mission", external: false },
      { label: "Blog", href: "/blog", external: false },
      { label: "Contact", href: "/contact", external: false },
      { label: "Join the waitlist", href: "/waitlist", external: false },
      { label: "Request a Demo", href: "/demo", external: false },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lab text-white">
      <div className="shell">
        {/* Newsletter */}
        <div className="grid gap-10 border-b border-white/10 py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:py-20">
          <div>
            <p className="label mb-6 text-white/40">Newsletter</p>
            <h2 className="h3 max-w-[22ch] text-white">
              Notes on building health technology in Africa.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/55">
              Now and then we write about digital health, clinical systems and what
              Medirevs Labs is working on. Nothing else.
            </p>
          </div>
          <div className="lg:pt-10">
            <NewsletterForm />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-16">
          <div>
            <Image
              src="/medirevs-logo-light.png"
              alt="Medirevs"
              width={416}
              height={124}
              className="h-7 w-auto"
            />
            <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/55">
              Clinical software, health data tools and medical technology, built
              for healthcare in Africa.
            </p>
            <ul className="mt-8 flex gap-5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label text-white/45 transition-colors hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="label mb-6 text-white/40">{column.title}</h3>
              <ul className="space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.9375rem] text-white/70 transition-colors hover:text-white"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contact strip */}
        <div className="grid gap-8 border-t border-white/10 py-12 sm:grid-cols-3">
          <div>
            <p className="label mb-3 text-white/40">Email</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
            >
              {CONTACT.email}
            </a>
          </div>
          <div>
            <p className="label mb-3 text-white/40">Telephone</p>
            <ul className="space-y-1.5">
              {CONTACT.phones.map((phone) => (
                <li key={phone.value}>
                  <a
                    href={phone.href}
                    className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                  >
                    <span aria-hidden="true">{phone.flag}</span>{" "}
                    <span className="sr-only">{phone.country}: </span>
                    {phone.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-3 text-white/40">Office</p>
            <p className="text-[0.9375rem] text-white/80">{CONTACT.address.full}</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-white/35">
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/legal/privacy" className="label text-white/55 transition-colors hover:text-white">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="label text-white/55 transition-colors hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
