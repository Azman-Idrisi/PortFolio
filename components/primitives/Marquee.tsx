"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type MarqueeProps = {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
};

export function Marquee({
  items,
  speed = 40,
  className = "",
  separator = "·",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // xPercent loops seamlessly even if webfonts change the track width after mount
    const tween = gsap.fromTo(
      el,
      { xPercent: 0 },
      { xPercent: -50, duration: el.scrollWidth / 2 / speed, ease: "none", repeat: -1 }
    );

    return () => {
      tween.kill();
    };
  }, [speed, items]);

  const repeated = [...items, ...items];

  return (
    <div
      className={`overflow-hidden whitespace-nowrap h-12 flex items-center ${className}`}
    >
      <div ref={trackRef} className="inline-flex will-change-transform">
        {repeated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center h-12 px-6 text-[14px] leading-none font-mono uppercase tracking-[0.18em] text-paper-2"
          >
            {item}
            <span className="text-accent ml-6">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
