"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Masked text reveal for every `[data-split]` inside `scope`, played once when
 * the element scrolls into view.
 *
 * - `data-split` (or `="lines"`): lines slide up out of a mask. Re-splits on
 *   resize and font load (`autoSplit`), carrying the animation's progress over.
 * - `data-split="words"`: words instead — for short titles.
 * - `data-split-start`: ScrollTrigger `start`, default `"top 85%"`.
 *
 * Disabled (text left untouched) when `enabled` is false, e.g. reduced motion.
 */
export function useSplitReveal(scope: RefObject<HTMLElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || !enabled) return;

    const splits = Array.from(root.querySelectorAll<HTMLElement>("[data-split]"), (el) => {
      const words = el.dataset.split === "words";
      return SplitText.create(el, {
        type: words ? "words" : "lines",
        mask: words ? "words" : "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        autoSplit: !words,
        onSplit: (self) =>
          gsap.from(words ? self.words : self.lines, {
            yPercent: 110,
            duration: words ? 0.9 : 1.1,
            stagger: words ? 0.035 : 0.09,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: el.dataset.splitStart ?? "top 85%",
              once: true,
            },
          }),
      });
    });

    return () => splits.forEach((s) => s.revert());
  }, [scope, enabled]);
}
