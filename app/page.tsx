"use client";

import { useState, useEffect, createContext, useContext } from "react";
import dynamic from "next/dynamic";
import { navItems } from "@/data";
import PageReveal from "@/components/PageReveal";

const FloatingNav = dynamic(() => import("@/components/ui/FloatingNav"), {
  ssr: false,
});
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const Grid = dynamic(() => import("@/components/Grid"), { ssr: false });
const RecentProjects = dynamic(() => import("@/components/RecentProjects"), {
  ssr: false,
});
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

// Create context for reveal animation coordination
interface RevealContextType {
  shouldReveal: boolean;
  triggerReveal: () => void;
}

const RevealContext = createContext<RevealContextType>({
  shouldReveal: false,
  triggerReveal: () => {},
});

export const useRevealContext = () => useContext(RevealContext);

export default function Home() {
  const [shouldReveal, setShouldReveal] = useState(false);

  useEffect(() => {
    // Trigger reveal animations immediately on component mount
    setTimeout(() => {
      setShouldReveal(true);
    }, 100);
  }, []);

  const triggerReveal = () => {
    setShouldReveal(true);
  };

  return (
    <RevealContext.Provider value={{ shouldReveal, triggerReveal }}>
      <PageReveal>
        <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
          <div className="max-w-7xl w-full">
            <FloatingNav navItems={navItems} />
            <div className="hero-section">
              <Hero />
            </div>
            <Grid />
            <div className="projects-section">
              <RecentProjects />
            </div>
            <div className="experience-section">
              <Experience />
            </div>
            <Footer />
          </div>
        </main>
      </PageReveal>
    </RevealContext.Provider>
  );
}
