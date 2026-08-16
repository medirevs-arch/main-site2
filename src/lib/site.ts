/**
 * Single source of truth for company facts, navigation and product data.
 * Every factual value here was taken from medirevs.com or confirmed by Medirevs.
 * Nothing in this file may be invented — unverified values use an explicit
 * `[To be confirmed]` placeholder so they are visible in the UI.
 */

export const SITE = {
  name: "Medirevs",
  legalName: "MEDIREVS LTD",
  url: "https://www.medirevs.com",
  tagline: "Healthcare. Connected. Evolved.",
  description:
    "Medirevs builds clinical software, health data tools and medical technology for healthcare in Africa.",
  locale: "en_GH",
} as const;

export const CONTACT = {
  email: "info@medirevs.com",
  phones: [
    { country: "Ghana", flag: "🇬🇭", value: "+233 55 868 2920", href: "tel:+233558682920" },
    { country: "France", flag: "🇫🇷", value: "+33 7 48 46 62 35", href: "tel:+33748466235" },
  ],
  address: {
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    full: "Accra, Greater Accra, Ghana",
  },
} as const;

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/medirevs/" },
  { label: "Instagram", href: "https://www.instagram.com/medirevsgh" },
  { label: "X", href: "https://x.com/medirevs" },
] as const;

export type ProductStatus = "Beta" | "In development" | "Early access";

export type Product = {
  slug: string;
  index: string;
  name: string;
  kicker: string;
  status: ProductStatus;
  href: string;
  summary: string;
  description: string;
  capabilities: { title: string; body: string }[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "doctorevs",
    index: "01",
    name: "DoctoRevs",
    kicker: "Telemedicine platform",
    status: "Beta",
    href: "/products/doctorevs",
    summary:
      "One platform connecting patients, doctors, pharmacists and medical laboratories.",
    description:
      "A single visit usually involves four different people. You see a doctor, you get a prescription, a pharmacy fills it, a lab runs your test. DoctoRevs keeps all of that in one place so nothing gets lost along the way.",
    capabilities: [
      { title: "Appointment booking", body: "Book a remote or in person visit and get a reminder before it." },
      { title: "Video and chat consultations", body: "Talk to a doctor from where you are, or find one nearby." },
      { title: "Electronic prescriptions", body: "Prescriptions are written digitally and sent straight on to be filled." },
      { title: "Pharmacy connection", body: "Pharmacists get the prescription directly, and can track orders and stock." },
      { title: "Laboratory integration", body: "Labs receive requests digitally and send results back to the same record." },
      { title: "Patient records", body: "Your visits, prescriptions and results stay together, and they stay with you." },
    ],
  },
  {
    slug: "ehr",
    index: "02",
    name: "Medirevs EHR",
    kicker: "Electronic health records",
    status: "In development",
    href: "/products/ehr",
    summary: "Health records that keep working when the internet does not.",
    description:
      "Most clinics do not have a reliable connection, run a mix of paper and digital, and come in very different sizes. We are building a records system around those facts rather than around ideal conditions.",
    capabilities: [
      { title: "Works offline", body: "Everything keeps working without a connection. Records sync once you are back online." },
      { title: "Light on data", body: "Built to stay usable on a slow mobile network." },
      { title: "Structured records", body: "Clinical notes are organised so you can actually search them later." },
      { title: "Connects to what you have", body: "Designed to work with the hospital, pharmacy and lab systems already in use." },
      { title: "Decision support", body: "Helpful prompts for clinicians, designed for African clinical settings." },
      { title: "More languages", body: "Planned. Not available yet." },
    ],
  },
  {
    slug: "data-ai",
    index: "03",
    name: "Data Solutions & AI",
    kicker: "Applied healthcare intelligence",
    status: "Early access",
    href: "/products/data-ai",
    summary: "Chat and voice tools that support people between visits.",
    description:
      "Care rarely breaks down at the moment of diagnosis. It breaks down before someone reaches a clinic, and after they leave. That is the gap we are working on.",
    capabilities: [
      { title: "Patient companion", body: "Support between appointments that remembers the context." },
      { title: "Clinical decision support", body: "Suggestions for the clinician. It never decides on its own." },
      { title: "Triage by conversation", body: "A guided set of questions that points someone to the right kind of care." },
      { title: "Voice", body: "For anyone who finds typing difficult." },
      { title: "African languages", body: "Planned. Not available yet." },
      { title: "Always on", body: "Guidance outside clinic hours, where there are few providers." },
    ],
  },
];

export const NAV = [
  { label: "Products", href: "/products", children: PRODUCTS.map((p) => ({ label: p.name, href: p.href, desc: p.kicker, status: p.status })) },
  { label: "Medirevs Labs", href: "/labs", accent: true },
  { label: "Mission", href: "/mission" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

/** DoctoRevs is launching on its own domain. */
export const DOCTOREVS_URL = "https://doctorevs.com";

export const LABS = {
  name: "Medirevs Labs",
  positioning: "Engineering healthcare from first principles.",
  summary:
    "Biomedical engineering and medical device research. Software reaches a clinic over a network. Some things have to be built with your hands.",
  collaborator: {
    institution: "University of Ghana",
    unit: "School of Engineering Sciences",
    note: "Medirevs Labs is developing the low cost microscope with a student team from the University of Ghana School of Engineering Sciences, who are working on the design and construction of low cost microscopes.",
  },
} as const;

export const BLOG_CATEGORIES = [
  "Digital Health",
  "AI & Data",
  "Healthcare Systems",
  "Medirevs Labs",
  "Biomedical Engineering",
  "Company",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
