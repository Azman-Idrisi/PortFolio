"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/data/projects";
import { Meta } from "@/components/primitives/Meta";
import { Button } from "@/components/primitives/Button";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { cn } from "@/utils/cn";

type ProjectDrawerProps = {
  project: Project;
  isOpen: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectDrawer({ project, isOpen }: ProjectDrawerProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(isOpen ? el.scrollHeight : 0);
    measure();
    if (isOpen) {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [isOpen, project.id]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      const el = contentRef.current;
      if (!el) return;
      setHeight(el.scrollHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  return (
    <motion.div
      id={`project-drawer-${project.id}`}
      role="region"
      aria-hidden={!isOpen}
      initial={false}
      animate={{ height }}
      transition={{ duration: 0.5, ease: EASE }}
      onAnimationComplete={() => ScrollTrigger.refresh()}
      style={{ overflow: "hidden" }}
    >
      <div
        ref={contentRef}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 py-10 md:py-14"
      >
        <div className="md:col-span-6">
          <motion.div
            data-drawer-thumb={project.id}
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
            transition={{ duration: 0.5, ease: EASE, delay: isOpen ? 0.05 : 0 }}
          >
            <ProjectThumbnail
              src={project.thumbnail}
              alt={project.name}
              className={cn(project.featured && "ring-1 ring-accent/30")}
            />
          </motion.div>
        </div>

        <div className="md:col-span-6 space-y-8">
          <motion.p
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
            transition={{ duration: 0.5, ease: EASE, delay: isOpen ? 0.08 : 0 }}
            className="font-fraunces text-[20px] md:text-[22px] leading-[1.4] text-paper font-light"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
            transition={{ duration: 0.5, ease: EASE, delay: isOpen ? 0.12 : 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 border-t border-line pt-6"
          >
            <Meta label="Year" value={project.year} />
            <Meta label="Role" value={project.role} />
            <Meta label="Category" value={project.category} />
            <Meta label="Stack" value={project.technologies.slice(0, 3).join(" · ")} />
          </motion.div>

          {project.features && project.features.length > 0 && (
            <motion.div
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
              transition={{ duration: 0.5, ease: EASE, delay: isOpen ? 0.16 : 0 }}
              className="border-t border-line pt-6"
            >
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-paper-2 mb-4">
                Key features
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-baseline gap-3 text-[14px] text-paper font-mono"
                  >
                    <span className="text-accent">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {project.metrics && project.metrics.length > 0 && (
            <motion.div
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
              transition={{ duration: 0.5, ease: EASE, delay: isOpen ? 0.2 : 0 }}
              className="border-t border-line pt-6"
            >
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-paper-2 mb-4">
                Impact
              </div>
              <ul className="flex flex-wrap gap-3">
                {project.metrics.map((m) => (
                  <li
                    key={m}
                    className="inline-flex items-center rounded-full border border-line bg-ink-2 px-3 py-1.5 text-[12px] font-mono uppercase tracking-[0.12em] text-paper"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {project.technologies.length > 3 && (
            <motion.div
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
              transition={{ duration: 0.5, ease: EASE, delay: isOpen ? 0.24 : 0 }}
              className="border-t border-line pt-6"
            >
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-paper-2 mb-4">
                Full stack
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-line bg-ink-2 px-3 py-1.5 text-[12px] font-mono text-paper-2"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {(project.projectUrl || project.githubUrl) && (
            <motion.div
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
              transition={{ duration: 0.5, ease: EASE, delay: isOpen ? 0.28 : 0 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {project.projectUrl && (
                <Button href={project.projectUrl} external variant="primary">
                  View project
                </Button>
              )}
              {project.githubUrl && (
                <Button href={project.githubUrl} external variant="ghost">
                  Source
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
