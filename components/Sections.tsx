"use client";

import dynamic from "next/dynamic";

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
const Proof = dynamic(
  () => import("@/components/proof/Proof").then((m) => m.Proof),
  { ssr: false }
);
const Approach = dynamic(
  () => import("@/components/approach/Approach").then((m) => m.Approach),
  { ssr: false }
);
const EngineeringDNA = dynamic(
  () => import("@/components/dna/EngineeringDNA").then((m) => m.EngineeringDNA),
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
  return (
    <>
      <About />
      <ProjectArchive />
      <TechStack />
      <Proof />
      <Approach />
      <EngineeringDNA />
      <Experience />
      <Contact />
    </>
  );
}
