"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: "load" | "scroll";
};

export function RevealText({
  children,
  as: Tag = "p",
  className = "",
  delay = 0,
  stagger = 0.04,
  trigger = "scroll",
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLSpanElement>(".reveal-word");
    gsap.set(words, { yPercent: 110 });

    const tween = gsap.to(words, {
      yPercent: 0,
      duration: 0.9,
      stagger,
      delay,
      ease: "expo.out",
    });

    if (trigger === "scroll") {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => tween.play(),
      });
      tween.pause();
    }

    return () => {
      tween.kill();
    };
  }, [delay, stagger, trigger]);

  const words = children.split(" ");

  return (
    <Tag
      ref={ref as never}
      className={`overflow-hidden inline-block ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden="true"
        >
          <span className="reveal-word inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
