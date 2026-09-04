"use client";

import { RefObject, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useParallax(
  rootRef: RefObject<HTMLElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0");
        if (!speed) return;

        gsap.fromTo(
          el,
          { y: () => window.innerHeight * speed },
          {
            y: () => -window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [rootRef, enabled]);
}
