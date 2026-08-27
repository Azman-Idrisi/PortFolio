"use client";

import { useEffect, useRef } from "react";
import { createLenis, destroyLenis } from "@/lib/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useSmoothScroll() {
  const reduced = useReducedMotion();
  const initialized = useRef(false);

  useEffect(() => {
    if (reduced || initialized.current) return;
    initialized.current = true;

    const lenis = createLenis();

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onRaf);
      destroyLenis();
      initialized.current = false;
    };
  }, [reduced]);
}
