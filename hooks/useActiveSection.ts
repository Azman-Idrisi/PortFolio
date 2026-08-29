"use client";

import { useEffect, useState } from "react";

export function useActiveSection(
  ids: string[],
  options?: { rootMargin?: string }
): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (ids.length === 0) return;

    const rootMargin = options?.rootMargin ?? "-40% 0px -40% 0px";
    const topMatch = rootMargin.match(/(-?\d+)%/);
    const topPercent = topMatch ? Math.abs(parseInt(topMatch[1], 10)) : 40;
    let activationLine = (window.innerHeight * topPercent) / 100;

    const getSortedElements = () =>
      ids
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter(
          (e): e is { id: string; el: HTMLElement } => e.el !== null
        )
        .sort(
          (a, b) =>
            a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top
        );

    const computeActive = () => {
      const elements = getSortedElements();
      if (elements.length === 0) return;
      activationLine = (window.innerHeight * topPercent) / 100;
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
    window.addEventListener("resize", onScroll, { passive: true });
    computeActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [ids, options?.rootMargin]);

  return active;
}
