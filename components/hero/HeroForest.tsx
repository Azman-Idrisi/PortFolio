"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Back to front. `lag` = how far (yPercent) a layer trails behind the scroll
// while the hero leaves the viewport — farther layers lag more. The front
// layer scrolls with the page. SVGs come from `scripts/gen-forest.mjs`.
const LAYERS = [
  { src: "/assets/hero/forest-far.svg", lag: 28 },
  { src: "/assets/hero/forest-mid.svg", lag: 17 },
  { src: "/assets/hero/forest-near.svg", lag: 8 },
] as const;
const SKY_LAG = 40;

export function HeroForest() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = el?.parentElement;
    if (!el || !hero) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to(el.querySelector("[data-forest-sky]"), { yPercent: SKY_LAG }, 0);
      el.querySelectorAll<HTMLElement>("[data-forest-lag]").forEach((layer) => {
        tl.to(layer, { yPercent: Number(layer.dataset.forestLag) }, 0);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden className="hero-forest pointer-events-none absolute inset-0">
      <div data-forest-sky className="hero-forest-sky absolute inset-x-0 -top-[45%] bottom-0 will-change-transform" />
      {LAYERS.map((l, i) => (
        <div
          key={l.src}
          data-forest-lag={l.lag}
          className="hero-forest-layer absolute inset-0 will-change-transform"
          style={{ backgroundImage: `url(${l.src})` }}
        >
          {i === 1 && <div className="hero-forest-fog" />}
        </div>
      ))}
      <div
        className="hero-forest-layer absolute inset-0"
        style={{ backgroundImage: "url(/assets/hero/forest-front.svg)" }}
      />
      <div className="hero-forest-shade absolute inset-0" />
    </div>
  );
}
