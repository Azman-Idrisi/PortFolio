"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scramble } from "@/lib/scramble";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  // Index and label type themselves in (scrambled) when the label scrolls into view.
  useLayoutEffect(() => {
    const root = ref.current;
    const idx = indexRef.current;
    const txt = textRef.current;
    if (reduced || !root || !idx || !txt) return;

    idx.textContent = "";
    txt.textContent = "";
    const tweens: gsap.core.Tween[] = [];
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 90%",
      once: true,
      onEnter: () => {
        tweens.push(scramble(idx, index, { scrambleText: { text: index, chars: "0123456789", speed: 0.7 } }));
        tweens.push(scramble(txt, children, { delay: 0.15 }));
      },
    });
    return () => {
      st.kill();
      tweens.forEach((t) => t.kill());
      idx.textContent = index;
      txt.textContent = children;
    };
  }, [index, children, reduced]);

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-paper-2 font-mono ${className}`}
    >
      <span className="sr-only">{`${index} ${children}`}</span>
      <span ref={indexRef} aria-hidden className="text-accent">
        {index}
      </span>
      <span className="h-px w-8 bg-line" />
      <span ref={textRef} aria-hidden>
        {children}
      </span>
    </div>
  );
}
