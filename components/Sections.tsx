"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { SectionsErrorBoundary } from "@/components/SectionsErrorBoundary";

const About = dynamic(() => import("@/components/about/About").then((m) => m.About), {
  ssr: false,
});
const ProjectArchive = dynamic(
  () => import("@/components/work/ProjectArchive").then((m) => m.ProjectArchive),
  { ssr: false }
);
const TechStack = dynamic(
  () => import("@/components/skills/TechStack").then((m) => m.TechStack),
  { ssr: false }
);
const Approach = dynamic(
  () => import("@/components/approach/Approach").then((m) => m.Approach),
  { ssr: false }
);
const Experience = dynamic(
  () => import("@/components/experience/Experience").then((m) => m.Experience),
  { ssr: false }
);
const Contact = dynamic(
  () => import("@/components/contact/Contact").then((m) => m.Contact),
  { ssr: false }
);

export function Sections() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const refresh = async () => {
      const mod = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      mod.ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(refresh);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <SectionsErrorBoundary>
      <About />
      <ProjectArchive />
      <TechStack />
      <Approach />
      <Experience />
      <Contact />
    </SectionsErrorBoundary>
  );
}
