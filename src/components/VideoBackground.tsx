"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Optional — some clips ship mp4 only. */
  webm?: string;
  mp4: string;
  poster: string;
  /** Describes the motion for assistive tech. */
  label: string;
  className?: string;
  /** Hero videos load immediately; everything else waits for the viewport. */
  eager?: boolean;
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Decorative background loop.
 *
 * - The poster paints first; the video is only attached afterwards, so page
 *   render never waits on it.
 * - Skipped entirely on reduced-motion, Save-Data, and 2g/slow-2g connections:
 *   those users keep the poster, which carries the same visual information.
 * - Paused whenever it leaves the viewport.
 */
export default function VideoBackground({
  webm,
  mp4,
  poster,
  label,
  className = "",
  eager = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /^(slow-)?2g$/.test(connection.effectiveType)) return;

    const node = wrapRef.current;
    if (!node) return;

    if (eager) {
      // Wait for first paint of real content before pulling media bytes.
      const id = window.requestIdleCallback
        ? window.requestIdleCallback(() => setActive(true), { timeout: 1200 })
        : window.setTimeout(() => setActive(true), 300);
      return () => {
        if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
        else clearTimeout(id as number);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  // Pause offscreen so a backgrounded loop never costs battery or CPU.
  useEffect(() => {
    if (!active) return;
    const node = wrapRef.current;
    const video = videoRef.current;
    if (!node || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (visible) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Poster paints immediately and stays underneath as the video's backdrop. */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        fetchPriority={eager ? "high" : "low"}
      />
      {active && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-label={label}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
