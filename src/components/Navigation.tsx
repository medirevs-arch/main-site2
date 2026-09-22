"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, PRODUCTS } from "@/lib/site";
import { Arrow } from "./ui";

/** Routes whose hero is dark: the navigation inverts until the page scrolls. */
const DARK_HERO_ROUTES = ["/", "/labs", "/demo"];

/** Routes that are dark all the way down: the chrome stays inverted. */
const DARK_PAGE_ROUTES = ["/labs", "/demo"];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const productsRef = useRef<HTMLDivElement>(null);

  // Compact state on scroll. rAF-throttled; reads only scrollY.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change closes everything.
  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setProductsOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The panel opens on click as well as hover, so it can outlive the pointer.
  // Anything clicked outside it should put it away again.
  useEffect(() => {
    if (!productsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) setProductsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [productsOpen]);

  const openProducts = () => {
    window.clearTimeout(closeTimer.current);
    setProductsOpen(true);
  };
  const closeProducts = () => {
    closeTimer.current = window.setTimeout(() => setProductsOpen(false), 140);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // The mobile sheet is always a light surface, so it wins over everything.
  const onDark =
    !menuOpen &&
    (DARK_PAGE_ROUTES.includes(pathname) ||
      (DARK_HERO_ROUTES.includes(pathname) && !scrolled && !productsOpen));

  const surface = !menuOpen && DARK_PAGE_ROUTES.includes(pathname) ? "glass-dark" : "glass";
  const linkIdle = onDark ? "text-white/70 hover:text-white" : "text-charcoal hover:text-ink";
  const linkActive = onDark ? "text-white" : "text-ink";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menuOpen || productsOpen
          ? `${surface} border-b`
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`shell flex items-center justify-between transition-[height] duration-300 ${
          scrolled ? "h-16" : "h-20 md:h-24"
        }`}
      >
        <Link href="/" aria-label="Medirevs, home" className="relative z-10 shrink-0">
          <Image
            src={onDark ? "/medirevs-logo-light.png" : "/medirevs-logo.png"}
            alt="Medirevs"
            width={416}
            height={124}
            priority
            className={`w-auto transition-[height] duration-300 ${scrolled ? "h-6" : "h-7 md:h-8"}`}
          />
        </Link>

        {/* ---------- Desktop ---------- */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            "children" in item && item.children ? (
              <div
                key={item.label}
                ref={productsRef}
                className="relative"
                onMouseEnter={openProducts}
                onMouseLeave={closeProducts}
              >
                {/* A button, not a link: clicking the trigger used to navigate
                    straight to /products, so the panel could only ever be seen
                    by hovering — and never at all on a touch screen. The page
                    itself is still reachable from "All products" below. */}
                <button
                  type="button"
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-[0.9375rem] transition-colors ${
                    isActive(item.href) ? linkActive : linkIdle
                  }`}
                  aria-expanded={productsOpen}
                  aria-haspopup="true"
                  onFocus={openProducts}
                  // Opens, never toggles. On a mouse, hovering has already
                  // opened the panel by the time the click lands, so a toggle
                  // would shut it again the instant you clicked — which is
                  // indistinguishable from the trigger being broken. Closing
                  // is mouse-leave, outside click, or Escape.
                  onClick={() => openProducts()}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      className="absolute inset-x-4 bottom-1 h-px bg-current"
                      aria-hidden="true"
                    />
                  )}
                  <svg
                    width="9"
                    height="6"
                    viewBox="0 0 9 6"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1L4.5 4.5L8 1" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>

                <div
                  className={`absolute left-1/2 top-full w-[min(30rem,90vw)] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ${
                    productsOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  {/* Opaque, not `glass`. At 72% white the display type on the
                      page behind read straight through the menu and made it
                      illegible — a navigation panel has to be a surface. */}
                  <div
                    className={`rounded-md border p-2 shadow-[0_18px_50px_-20px_rgba(11,15,14,0.35)] ${
                      surface === "glass-dark"
                        ? "border-white/10 bg-lab-raised"
                        : "border-line bg-page"
                    }`}
                  >
                    {PRODUCTS.map((p) => (
                      <Link
                        key={p.slug}
                        href={p.href}
                        className={`group/link flex items-start gap-4 rounded-sm px-4 py-3.5 transition-colors ${
                          surface === "glass-dark" ? "hover:bg-white/[0.06]" : "hover:bg-ink/[0.04]"
                        }`}
                      >
                        <span
                          className={`label mt-1 ${surface === "glass-dark" ? "text-white/30" : "text-mist"}`}
                        >
                          {p.index}
                        </span>
                        <span className="flex-1">
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`text-[0.9375rem] font-medium ${
                                surface === "glass-dark" ? "text-white" : "text-ink"
                              }`}
                            >
                              {p.name}
                            </span>
                            <span
                              className={`label ${surface === "glass-dark" ? "text-white/45" : "text-slate"}`}
                            >
                              {p.status}
                            </span>
                          </span>
                          <span
                            className={`mt-1 block text-sm leading-snug ${
                              surface === "glass-dark" ? "text-white/50" : "text-slate"
                            }`}
                          >
                            {p.summary}
                          </span>
                        </span>
                        <Arrow
                          className={`mt-1.5 shrink-0 ${surface === "glass-dark" ? "text-white/30" : "text-mist"}`}
                        />
                      </Link>
                    ))}

                    <Link
                      href={item.href}
                      className={`group/link mt-1 flex items-center gap-2.5 rounded-sm border-t px-4 py-3 text-[0.9375rem] font-medium transition-colors ${
                        surface === "glass-dark"
                          ? "border-white/10 text-white hover:bg-white/[0.06]"
                          : "border-line text-ink hover:bg-ink/[0.04]"
                      }`}
                    >
                      All products
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative px-4 py-2 text-[0.9375rem] transition-colors ${
                  isActive(item.href) ? linkActive : linkIdle
                } ${"accent" in item && item.accent ? "font-medium" : ""}`}
              >
                {item.label}
                {/* The underline marks the current page — nothing else. It used
                    to be painted permanently on the `accent` item, so Medirevs
                    Labs looked selected on every page and no page ever showed
                    where you actually were. Accent now reads as colour only. */}
                {isActive(item.href) && (
                  <span
                    className="absolute inset-x-4 bottom-1 h-px"
                    style={{
                      background:
                        "accent" in item && item.accent ? "var(--color-optic)" : "currentColor",
                    }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ),
          )}
          {/* Two asks, ordered by what they cost the visitor. The waitlist is
              one email address and is what most people arriving here can
              actually act on; a demo is a meeting, and suits clinics. The pill
              used to be the demo, which meant the cheapest action on the site
              was not offered anywhere in the chrome. */}
          <Link
            href="/demo"
            className={`ml-2 px-4 py-2 text-[0.9375rem] transition-colors ${linkIdle}`}
          >
            Request a Demo
          </Link>
          <Link
            href="/waitlist"
            className={`ml-1 rounded-sm px-5 py-2.5 text-[0.9375rem] font-medium transition-colors ${
              onDark ? "bg-white text-ink hover:bg-white/90" : "bg-ink text-white hover:bg-brand"
            }`}
          >
            Join the waitlist
          </Link>
        </nav>

        {/* ---------- Mobile trigger ---------- */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute left-0 block h-px w-6 transition-transform duration-300 ${
                onDark ? "bg-white" : "bg-ink"
              } ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 transition-transform duration-300 ${
                onDark ? "bg-white" : "bg-ink"
              } ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* ---------- Mobile menu ---------- */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-0 -z-10 h-[100dvh] overflow-y-auto bg-white pt-24 transition-[opacity,visibility] duration-300 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="shell flex flex-col pb-16" aria-label="Mobile">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={p.href}
              className="flex items-baseline justify-between border-b border-line py-5"
            >
              <span className="text-xl text-ink">{p.name}</span>
              <span className="label text-slate">{p.status}</span>
            </Link>
          ))}
          {NAV.filter((i) => !("children" in i && i.children)).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-baseline justify-between border-b border-line py-5 text-xl text-ink"
            >
              {item.label}
              {"accent" in item && item.accent && (
                <span className="label" style={{ color: "var(--color-optic)" }}>
                  Research
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/waitlist"
            className="mt-8 flex items-center justify-center gap-2 rounded-sm bg-ink px-6 py-4 text-base font-medium text-white"
          >
            Join the waitlist
            <Arrow />
          </Link>
          <Link
            href="/demo"
            className="mt-3 flex items-center justify-center gap-2 rounded-sm border border-line px-6 py-4 text-base font-medium text-ink"
          >
            Request a Demo
            <Arrow />
          </Link>
          <a
            href={`mailto:${"info@medirevs.com"}`}
            className="mt-6 text-center text-sm text-slate"
          >
            info@medirevs.com
          </a>
        </nav>
      </div>
    </header>
  );
}
