"use client";

import { useEffect, useRef, useState } from "react";
import type { SceneFactory, SceneHandle } from "./types";

type SceneName = "network" | "lens" | "opticalStack";

/** Screen-space radius, in px, within which two labels are treated as colliding. */
const COLLISION_PX = 92;

type Props = {
  scene: SceneName;
  /** Server-rendered SVG. Stays visible until WebGL is actually running. */
  children: React.ReactNode;
  className?: string;
  /** Extra description for assistive tech, since the canvas itself says nothing. */
  label: string;
  /** Aspect ratio of the canvas box, width / height. */
  ratio?: number;
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Hosts a three.js scene, and only when it is worth doing.
 *
 * The SVG passed as children is rendered on the server and is what everyone
 * sees first. WebGL loads after, lazily, and fades in over the top. If any of
 * the checks below fail, three is never even downloaded and the SVG simply
 * stays. That keeps the promise the rest of the site makes about slow networks
 * and mid-range phones.
 *
 * Bail-out conditions:
 *   • prefers-reduced-motion
 *   • Save-Data, or a 2g connection
 *   • fewer than 4 logical cores
 *   • no WebGL2 context available
 */
export default function Scene3D({ scene, children, className = "", label, ratio = 1.6 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelLayerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [running, setRunning] = useState(false);

  // Decide whether to load three at all, then wait for the section to approach.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /^(slow-)?2g$/.test(connection.effectiveType)) return;
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency < 4) return;

    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2")) return;

    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    let disposed = false;
    let frame = 0;
    let handle: SceneHandle | undefined;
    let renderer: import("three").WebGLRenderer | undefined;
    let cleanupResize: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      const factories = await import("./scenes");
      const factory: SceneFactory = factories[scene];
      if (!factory) throw new Error(`Unknown 3D scene: ${scene}`);

      const host = hostRef.current;
      const canvas = canvasRef.current;
      if (disposed || !host || !canvas) return;

      const width = host.clientWidth;
      const height = host.clientHeight;

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      // Cap the pixel ratio: 2 is plenty, and 3 murders mid-range GPUs.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const threeScene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0, 9);

      handle = factory(THREE, threeScene, camera, renderer);

      // Build the HTML label layer once.
      const labelLayer = labelLayerRef.current;
      type LabelNode = {
        el: HTMLSpanElement;
        anchor: import("three").Vector3;
        x: number;
        y: number;
        depth: number;
        behind: boolean;
      };
      const labelNodes: LabelNode[] = [];
      if (labelLayer && handle.labels) {
        labelLayer.replaceChildren();
        for (const item of handle.labels) {
          const el = document.createElement("span");
          el.textContent = item.text;
          el.className =
            "label absolute left-0 top-0 whitespace-nowrap will-change-transform";
          el.style.transform = "translate3d(-9999px,-9999px,0)";
          labelLayer.appendChild(el);
          labelNodes.push({ el, anchor: item.anchor, x: 0, y: 0, depth: 0, behind: true });
        }
      }

      const onResize = () => {
        if (!renderer || !host) return;
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize, { passive: true });
      cleanupResize = () => window.removeEventListener("resize", onResize);

      // Pause completely when offscreen. A spinning GPU behind the fold is
      // just battery drain.
      let visible = true;
      const visibility = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? false;
        },
        { threshold: 0 },
      );
      visibility.observe(host);

      const projected = new THREE.Vector3();
      const start = performance.now();
      let shown = false;

      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!visible || !renderer || !handle) return;

        // Scroll progress across the section: 0 entering, 1 leaving.
        const rect = host.getBoundingClientRect();
        const span = window.innerHeight + rect.height;
        const progress = Math.min(Math.max((window.innerHeight - rect.top) / span, 0), 1);

        handle.update(progress, (performance.now() - start) / 1000);
        renderer.render(threeScene, camera);

        // Project label anchors into screen space, then de-clutter: when two
        // labels land on top of each other, the one further from the camera
        // gives way. Without this, a node rotating behind the hub drops its
        // label straight onto the middle of the diagram.
        if (labelNodes.length) {
          const w = host.clientWidth;
          const h = host.clientHeight;

          for (const node of labelNodes) {
            projected.copy(node.anchor).project(camera);
            node.x = (projected.x * 0.5 + 0.5) * w;
            node.y = (-projected.y * 0.5 + 0.5) * h;
            node.behind = projected.z > 1;
            node.depth = camera.position.distanceTo(node.anchor);
          }

          for (const node of labelNodes) {
            let hidden = node.behind;
            if (!hidden) {
              for (const other of labelNodes) {
                if (other === node || other.behind || other.depth >= node.depth) continue;
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                if (dx * dx + dy * dy < COLLISION_PX * COLLISION_PX) {
                  hidden = true;
                  break;
                }
              }
            }
            node.el.style.transform = `translate3d(${node.x.toFixed(1)}px, ${node.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
            node.el.style.opacity = hidden ? "0" : "1";
          }
        }

        if (!shown) {
          shown = true;
          setRunning(true);
        }
      };

      frame = requestAnimationFrame(tick);

      cleanupResize = () => {
        window.removeEventListener("resize", onResize);
        visibility.disconnect();
      };
    })().catch((error) => {
      // A broken scene must never take the page with it. Log it and leave the
      // SVG in place, which is a perfectly good result on its own.
      console.error(`[Scene3D] "${scene}" failed to start, keeping the SVG.`, error);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanupResize?.();
      handle?.dispose();
      renderer?.dispose();
    };
  }, [active, scene]);

  return (
    <div
      ref={hostRef}
      className={`relative ${className}`}
      style={{ aspectRatio: String(ratio) }}
      role="img"
      aria-label={label}
    >
      {/* SVG fallback: server rendered, and the only thing many people see. */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          running ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={running}
      >
        {children}
      </div>

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          running ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      <div
        ref={labelLayerRef}
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          running ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
