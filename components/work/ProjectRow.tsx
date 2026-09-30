"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Project } from "@/data/projects";
import { cn } from "@/utils/cn";
import { scramble } from "@/lib/scramble";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ProjectRowProps = {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
  /** Pointer entered the row (drives the archive's floating preview). */
  onHover?: () => void;
  index: number;
};

export function ProjectRow({ project, isOpen, onToggle, onHover, index }: ProjectRowProps) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const metaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const meta = [project.category, project.role, project.year];

  // Meta columns decode themselves on hover.
  const handleEnter = () => {
    setHovered(true);
    onHover?.();
    if (reduced) return;
    metaRefs.current.forEach((el, i) => el && scramble(el, meta[i]));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="border-b border-line"
    >
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={isOpen}
        aria-controls={`project-drawer-${project.id}`}
        className="group relative w-full text-left py-6 md:py-8 grid grid-cols-12 gap-3 md:gap-6 items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        data-cursor="hover"
      >
        <span className="col-span-2 md:col-span-1 font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
          {project.number}
        </span>

        <span
          className={cn(
            "col-span-8 md:col-span-5 font-fraunces text-[24px] md:text-[36px] lg:text-[44px] leading-[1.05] font-light tracking-[-0.02em] transition-colors duration-300",
            hovered || isOpen ? "text-accent" : "text-paper"
          )}
        >
          {project.name}
        </span>

        <span
          ref={(el) => {
            metaRefs.current[0] = el;
          }}
          className="hidden md:block col-span-2 font-mono text-[12px] uppercase tracking-[0.14em] text-paper-2"
        >
          {project.category}
        </span>

        <span
          ref={(el) => {
            metaRefs.current[1] = el;
          }}
          className="hidden md:block col-span-2 font-mono text-[12px] uppercase tracking-[0.14em] text-paper-2"
        >
          {project.role}
        </span>

        <span
          ref={(el) => {
            metaRefs.current[2] = el;
          }}
          className="hidden md:block col-span-1 text-right font-mono text-[12px] uppercase tracking-[0.14em] text-paper-2"
        >
          {project.year}
        </span>

        <span
          className={cn(
            "col-span-12 md:hidden font-mono text-[11px] uppercase tracking-[0.14em] text-paper-2",
            "order-last md:order-none"
          )}
        >
          {`${project.category} · ${project.role} · ${project.year}`.split(" · ").join(" · ")}
        </span>

        <span
          className="relative col-span-2 md:col-span-1 text-right font-fraunces text-2xl"
          aria-hidden="true"
        >
          <motion.span
            className="relative inline-block h-[1em] w-[1em] align-middle"
            animate={{
              color: isOpen || hovered ? "#E8FF8B" : "#a8a39a",
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="absolute left-0 top-1/2 h-px w-full bg-current -translate-y-1/2" />
            <motion.span
              className="absolute left-1/2 top-0 h-full w-px bg-current -translate-x-1/2 origin-center"
              initial={false}
              animate={{ scaleY: isOpen ? 0 : 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.span>
        </span>
      </button>
    </motion.div>
  );
}
