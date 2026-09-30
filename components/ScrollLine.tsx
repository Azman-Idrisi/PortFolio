"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Pt = { x: number; y: number };

// Distance between auto-generated wave points, and how close one may sit to a lamp.
const WAVE_STEP = 900;
const LAMP_CLEARANCE = 450;

// S-curves through every point with vertical tangents — never overshoots or
// loops back, and runs straight down through vertically stacked lamps.
function toPath(pts: Pt[]) {
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const my = (a.y + b.y) / 2;
    d += ` C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
  }
  return d;
}

// Thread running the full page (skiper19-style). The path is built in page
// pixels so it passes exactly through every `[data-thread-lamp]`; the rest of
// the page gets an alternating wave. Lamps get `data-lit` once the tip passes.
export function ScrollLine() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const host = svg?.parentElement;
    if (!svg || !path || !host) return;

    let lamps: (Pt & { el: HTMLElement })[] = [];
    let height = 1;

    const build = () => {
      const hr = host.getBoundingClientRect();
      const w = hr.width;
      height = Math.max(hr.height, 1);
      svg.setAttribute("viewBox", `0 0 ${w} ${height}`);

      lamps = Array.from(host.querySelectorAll<HTMLElement>("[data-thread-lamp]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { el, x: r.left + r.width / 2 - hr.left, y: r.top + r.height / 2 - hr.top };
        })
        .sort((a, b) => a.y - b.y);

      const pts: Pt[] = [{ x: w * 0.5, y: 0 }];
      const lampPts = lamps.map(({ x, y }) => ({ x, y }));
      let side = 1;
      for (let y = WAVE_STEP; y < height - WAVE_STEP / 2; y += WAVE_STEP) {
        side = -side;
        if (lampPts.some((p) => Math.abs(p.y - y) < LAMP_CLEARANCE)) continue;
        pts.push({ x: w * (0.5 + side * 0.32), y });
      }
      pts.push(...lampPts, { x: w * 0.5, y: height });
      pts.sort((a, b) => a.y - b.y);
      path.setAttribute("d", toPath(pts));
    };

    const state = { hidden: reduced ? 0 : 100 };
    const apply = () => {
      svg.style.clipPath = `inset(0 0 ${state.hidden}% 0)`;
      const tipY = height * (1 - state.hidden / 100);
      for (const l of lamps) l.el.toggleAttribute("data-lit", tipY >= l.y);
    };

    // Tip tracks 60% down the viewport so the thread draws in view.
    const update = () => {
      if (reduced) return apply();
      const r = host.getBoundingClientRect();
      const tip = window.innerHeight * 0.6 - r.top;
      const target = gsap.utils.clamp(0, 100, 100 - (tip / r.height) * 100);
      gsap.to(state, {
        hidden: target,
        duration: 0.8,
        ease: "power2.out",
        overwrite: true,
        onUpdate: apply,
      });
    };

    const rebuild = () => {
      build();
      update();
    };
    rebuild();
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update });
    ScrollTrigger.addEventListener("refresh", rebuild);
    const ro = new ResizeObserver(rebuild);
    ro.observe(host);
    return () => {
      st.kill();
      ScrollTrigger.removeEventListener("refresh", rebuild);
      ro.disconnect();
      gsap.killTweensOf(state);
    };
  }, [reduced]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity={0.35}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
