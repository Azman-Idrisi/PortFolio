"use client";

import { useEffect, useState } from "react";

export function useActiveSection(
  ids: string[],
  options?: { rootMargin?: string }
): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = ids
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter(
        (e): e is { id: string; el: HTMLElement } => e.el !== null
      )
      .sort(
        (a, b) =>
          a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top
      );

    if (elements.length === 0) return;

    const rootMargin = options?.rootMargin ?? "-40% 0px -40% 0px";
    const topMatch = rootMargin.match(/(-?\d+)%/);
    const topPercent = topMatch ? parseInt(topMatch[1], 10) : -40;
    const activationLine = (window.innerHeight * topPercent) / 100;

    const computeActive = () => {
      let best: { id: string; dist: number } | null = null;
      for (const { id, el } of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= activationLine) continue;
        const dist = Math.abs(rect.top - activationLine);
        if (!best || dist < best.dist) {
          best = { id, dist };
        }
      }
      if (best) setActive(best.id);
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        computeActive();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    computeActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [ids, options?.rootMargin]);

  return active;
}
