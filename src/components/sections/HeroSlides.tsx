"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = { src: string; alt: string; position?: string };

/**
 * The hero's image layer: a slow crossfade through the care chain.
 *
 * Only the photograph changes — the headline and calls to action stay put, so
 * nothing the reader is part-way through reading moves under them.
 *
 * Under reduced motion it holds the first slide and never advances, and the
 * dots still work, so the whole set is reachable without any motion at all.
 */
export default function HeroSlides({
  slides,
  interval = 6500,
}: {
  slides: Slide[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => window.clearInterval(id);
  }, [auto, interval, slides.length]);

  return (
    <>
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          aria-hidden={i === index ? undefined : true}
          fill
          // Only the first is priority: it is the LCP candidate. The rest load
          // lazily and are swapped in long after first paint.
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: slide.position ?? "62% center" }}
        />
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-6 right-[var(--gutter)] z-20 flex items-center gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              // Stopping the timer on manual control is the whole point of the
              // control — otherwise it moves on again a few seconds later.
              onClick={() => {
                setIndex(i);
                setAuto(false);
              }}
              aria-label={`Show image ${i + 1} of ${slides.length}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
