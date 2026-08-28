"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { ProjectRow } from "./ProjectRow";
import { ProjectDrawer } from "./ProjectDrawer";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useUrlSyncedProject } from "@/hooks/useUrlSyncedProject";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "azman-walletmate-seen";
const AUTO_OPEN_ID = "walletmate";
const AUTO_OPEN_MS = 6000;

export function ProjectArchive() {
  const projectIds = projects.map((p) => p.id);
  const { openId, setOpenId } = useUrlSyncedProject(projectIds);
  const reduced = useReducedMotion();
  const autoOpenedRef = useRef(false);
  const scrolledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (openId) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (autoOpenedRef.current) return;

    autoOpenedRef.current = true;
    setOpenId(AUTO_OPEN_ID);

    const onScroll = () => {
      if (window.scrollY > 50) {
        scrolledRef.current = true;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (openId === AUTO_OPEN_ID) {
          setOpenId(null);
          sessionStorage.setItem(SESSION_KEY, "1");
        }
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    timerRef.current = setTimeout(() => {
      if (!scrolledRef.current) {
        setOpenId(null);
        sessionStorage.setItem(SESSION_KEY, "1");
      }
      window.removeEventListener("scroll", onScroll);
    }, AUTO_OPEN_MS);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [openId, setOpenId, reduced]);

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
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="work"
      className="relative w-full section-pad-y px-6 md:px-10 border-t border-line"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel index="02" className="mb-12">
          Selected work
        </SectionLabel>

        <h2 className="font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[18ch] mb-16">
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
