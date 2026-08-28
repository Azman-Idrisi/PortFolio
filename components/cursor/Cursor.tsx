"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMedia } from "@/hooks/useMedia";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Cursor() {
  const isFine = useMedia("(pointer: fine)");
  const reduced = useReducedMotion();
  const [variant, setVariant] = useState<"default" | "hover" | "text">("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 30, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 30, mass: 0.3 });

  useEffect(() => {
    if (!isFine || reduced) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hoverable = target.closest<HTMLElement>(
        'a, button, [data-cursor="hover"], [role="button"]'
      );
      const text = target.closest<HTMLElement>("p, h1, h2, h3, h4, h5, h6, span, li");
      if (hoverable) setVariant("hover");
      else if (text) setVariant("text");
      else setVariant("default");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [isFine, reduced, visible, x, y]);

  if (!isFine || reduced) return null;

  const size = variant === "hover" ? 56 : variant === "text" ? 8 : 16;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-paper"
          animate={{
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        />
      </motion.div>
    </>
  );
}
