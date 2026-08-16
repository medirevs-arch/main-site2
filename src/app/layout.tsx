import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CONTACT, SITE, SOCIALS } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Medirevs | Building better ways to deliver healthcare",
    template: "%s | Medirevs",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "African health technology",
    "telemedicine Ghana",
    "electronic health records Africa",
    "biomedical engineering Ghana",
    "digital health infrastructure",
  ],
  authors: [{ name: SITE.legalName }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: "Medirevs | Building better ways to deliver healthcare",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@medirevs",
    title: "Medirevs | Building better ways to deliver healthcare",
    description: SITE.description,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE.url}/rss.xml` },
  },
  robots: { index: true, follow: true },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  description: SITE.description,
  email: CONTACT.email,
  telephone: CONTACT.phones.map((p) => p.value),
  address: {
    "@type": "PostalAddress",
    addressLocality: CONTACT.address.city,
    addressRegion: CONTACT.address.region,
    addressCountry: "GH",
  },
  sameAs: SOCIALS.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below strips `no-js` from
    // this element before React hydrates, which is a deliberate mismatch.
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} no-js`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </body>
    </html>
  );
}
