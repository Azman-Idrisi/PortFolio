"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Project } from "@/data/projects";
import { cn } from "@/utils/cn";

type ProjectRowProps = {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
};

export function ProjectRow({ project, isOpen, onToggle, index }: ProjectRowProps) {
  const [hovered, setHovered] = useState(false);

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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={isOpen}
        aria-controls={`project-drawer-${project.id}`}
        className="group relative w-full text-left py-6 md:py-8 grid grid-cols-12 gap-3 md:gap-6 items-baseline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        data-cursor="hover"
      >
        <span className="col-span-2 md:col-span-1 font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
          {project.number}
        </span>

        <span
          className={cn(
            "col-span-10 md:col-span-5 font-fraunces text-[24px] md:text-[36px] lg:text-[44px] leading-[1.05] font-light tracking-[-0.02em] transition-colors duration-300",
            hovered || isOpen ? "text-accent" : "text-paper"
          )}
        >
          {project.name}
        </span>

        <span className="hidden md:block col-span-2 font-mono text-[12px] uppercase tracking-[0.14em] text-paper-2">
          {project.category}
        </span>

        <span className="hidden md:block col-span-2 font-mono text-[12px] uppercase tracking-[0.14em] text-paper-2">
          {project.role}
        </span>

        <span className="hidden md:block col-span-1 text-right font-mono text-[12px] uppercase tracking-[0.14em] text-paper-2">
          {project.year}
        </span>

        <span
          className={cn(
            "col-span-12 md:hidden font-mono text-[11px] uppercase tracking-[0.14em] text-paper-2",
            "order-last md:order-none"
          )}
        >
          {project.category} · {project.role} · {project.year}
        </span>

        <motion.span
          className="col-span-12 md:col-span-1 text-right font-fraunces text-2xl text-paper-2 origin-center"
          animate={{
            rotate: isOpen ? 45 : 0,
            color: isOpen || hovered ? "#E8FF8B" : undefined,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
    </motion.div>
  );
}
