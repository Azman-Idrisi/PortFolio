"use client";

import { useRef, MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  external?: boolean;
  type?: "button" | "submit";
};

export function Magnetic({
  children,
  strength = 0.35,
  className,
  href,
  onClick,
  ariaLabel,
  external,
  type = "button",
}: MagneticProps) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set(px * strength);
    y.set(py * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const style = { x: sx, y: sy };

  if (href) {
    return (
      <motion.span
        ref={ref as never}
        className={className}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={style}
        data-magnetic="true"
      >
        <a
          href={href}
          onClick={onClick}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={ariaLabel}
          className="contents"
        >
          {children}
        </a>
      </motion.span>
    );
  }

  return (
    <motion.button
      ref={ref as never}
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      {children}
    </motion.button>
  );
}
