"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { ProjectRow } from "./ProjectRow";
import { ProjectDrawer } from "./ProjectDrawer";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useUrlSyncedProject } from "@/hooks/useUrlSyncedProject";

export function ProjectArchive() {
  const ref = useRef<HTMLElement | null>(null);
  const projectIds = projects.map((p) => p.id);
  const { openId, setOpenId } = useUrlSyncedProject(projectIds);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openId) {
        setOpenId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, setOpenId]);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="work"
      ref={ref}
      className="relative w-full section-pad-y px-6 md:px-10 border-t border-line"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel index="02" className="mb-12">
          Selected work
        </SectionLabel>

        <h2 className="font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[18ch] mb-16 will-change-transform">
          An archive of things I&apos;ve built.
        </h2>

        <div className="border-t border-line">
          {projects.map((project, i) => {
            const isOpen = openId === project.id;
            return (
              <div key={project.id}>
                <ProjectRow
                  project={project}
                  isOpen={isOpen}
                  onToggle={() => handleToggle(project.id)}
                  index={i}
                />
                <ProjectDrawer project={project} isOpen={isOpen} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
