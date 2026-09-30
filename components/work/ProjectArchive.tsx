"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { ProjectRow } from "./ProjectRow";
import { ProjectDrawer } from "./ProjectDrawer";
import { ProjectPreview, type ProjectPreviewHandle } from "./ProjectPreview";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useUrlSyncedProject } from "@/hooks/useUrlSyncedProject";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMedia } from "@/hooks/useMedia";
import { useSplitReveal } from "@/hooks/useSplitReveal";

export function ProjectArchive() {
  const ref = useRef<HTMLElement | null>(null);
  const projectIds = projects.map((p) => p.id);
  const { openId, setOpenId } = useUrlSyncedProject(projectIds);
  const reduced = useReducedMotion();
  useSplitReveal(ref, !reduced);

  const previewRef = useRef<ProjectPreviewHandle | null>(null);
  const finePointer = useMedia("(pointer: fine)");
  const isDesktop = useMedia("(min-width: 768px)");
  const previewOn = !reduced && finePointer && isDesktop;

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
    const opening = openId !== id;
    setOpenId(opening ? id : null);
    if (opening) previewRef.current?.flyTo(id);
    else previewRef.current?.hide();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // The preview belongs to the rows; over an open drawer's content it gets in the way.
    if ((e.target as Element).closest("[role='region']")) previewRef.current?.hide();
    previewRef.current?.move(e.clientX, e.clientY);
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

        <h2 data-split className="font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[18ch] mb-16">
          An archive of things I&apos;ve built.
        </h2>

        <div
          className="border-t border-line"
          onPointerMove={previewOn ? handlePointerMove : undefined}
          onPointerLeave={previewOn ? () => previewRef.current?.hide() : undefined}
        >
          {projects.map((project, i) => {
            const isOpen = openId === project.id;
            return (
              <div key={project.id}>
                <ProjectRow
                  project={project}
                  isOpen={isOpen}
                  onToggle={() => handleToggle(project.id)}
                  onHover={() =>
                    isOpen ? previewRef.current?.hide() : previewRef.current?.show(project.id)
                  }
                  index={i}
                />
                <ProjectDrawer project={project} isOpen={isOpen} />
              </div>
            );
          })}
        </div>
      </div>
      <ProjectPreview ref={previewRef} projects={projects} enabled={previewOn} />
    </section>
  );
}
