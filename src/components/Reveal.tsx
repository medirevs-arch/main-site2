"use client";

import { useEffect } from "react";

/**
 * Adds [data-inview] to every [data-reveal] element as it enters the viewport.
 * One observer for the whole page; no per-element React state, no layout reads.
 * Elements are never re-hidden, so scrolling back up costs nothing.
 *
 * Two guarantees beyond the observer, because `[data-reveal]` starts at
 * `opacity: 0` and anything this reveal misses stays invisible forever — a
 * decorative animation must never be the last thing standing between a reader
 * and the copy. This has already cost us a stuck heading on /products/doctorevs
 * that the observer silently skipped:
 *
 *   · a scroll sweep, which reveals anything that has reached the fold even if
 *     the observer never reported it; and
 *   · a sweep on load/resize, which covers content that is already on screen.
 *
 * Both are idempotent and cost one getBoundingClientRect per still-hidden
 * element, on a list that only ever shrinks.
 */
export default function Reveal() {
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute("data-inview", "");
    const remaining = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-inview])");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      remaining().forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      // Positive bottom margin: start revealing *before* the element reaches
      // the fold. The old -12% held content back until it was already well
      // inside the viewport, so a normal scroll showed a band of empty page
      // and only then the copy — which read as broken spacing, not as motion.
      { rootMargin: "0px 0px 15% 0px", threshold: 0.01 },
    );
    remaining().forEach((el) => observer.observe(el));

    // Failsafe sweep: anything whose top has passed the bottom of the viewport
    // is something the reader can see, so it must not still be transparent.
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const limit = window.innerHeight * 1.15;
      for (const el of remaining()) {
        if (el.getBoundingClientRect().top < limit) {
          reveal(el);
          observer.unobserve(el);
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };

    sweep();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
