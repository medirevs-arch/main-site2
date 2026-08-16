"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  webm?: string;
  mp4: string;
  poster: string;
  label: string;
  /** How tall the scroll track is. The video plays across this distance. */
  heightVh?: number;
  children?: React.ReactNode;
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * A video scrubbed by scroll position instead of autoplaying.
 *
 * The section is a tall scroll track with a sticky viewport inside it. As you
 * move down the track, the video's currentTime follows. Scroll up and it runs
 * backwards. Nothing plays on its own.
 *
 * Notes on the implementation:
 * - currentTime is written inside requestAnimationFrame, and only when the
 *   value actually changed, so we never fight the compositor.
 * - The target time is eased toward rather than snapped to, which hides the
 *   coarse keyframe stepping you get when seeking a compressed video.
 * - Native scrolling is untouched. The page scrolls normally the whole time.
 * - Under reduced motion, Save Data or a slow connection it falls back to the
 *   poster image and no video is fetched at all.
 */
export default function ScrollVideo({
  webm,
  mp4,
  poster,
  label,
  // 300vh meant two extra screens of scrolling past a pinned video before the
  // page moved on, which reads as dead space rather than as a scrubbed shot.
  heightVh = 200,
  children,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /^(slow-)?2g$/.test(connection.effectiveType)) return;

    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    let frame = 0;
    let current = 0;
    let target = 0;
    let running = false;

    const tick = () => {
      // Ease toward the target so seeking looks continuous.
      current += (target - current) * 0.12;

      if (Math.abs(target - current) < 0.004) current = target;
      if (video.readyState >= 2 && Math.abs(video.currentTime - current) > 0.01) {
        video.currentTime = current;
      }

      if (current === target) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      if (distance <= 0) return;

      // 0 at the top of the track, 1 at the bottom.
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
      const duration = video.duration;
      if (!Number.isFinite(duration)) return;

      target = progress * (duration - 0.05);

      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onLoaded = () => {
      setReady(true);
      onScroll();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return (
    <div ref={trackRef} className="relative" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* The poster holds the frame until the video can be drawn. */}
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
          decoding="async"
        />

        {enabled && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            poster={poster}
            aria-label={label}
            tabIndex={-1}
          >
            {webm && <source src={webm} type="video/webm" />}
            <source src={mp4} type="video/mp4" />
          </video>
        )}

        {children}
      </div>
    </div>
  );
}
