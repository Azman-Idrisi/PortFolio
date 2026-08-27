"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { techPanels, techChips } from "@/data/content";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TechStack() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const distance = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  return (
    <section
      id="practice"
      ref={sectionRef}
      className="relative w-full border-t border-line bg-ink"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 section-pad-y-sm">
        <SectionLabel index="03" className="mb-12">
          Practice
        </SectionLabel>

        <h2 className="font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[18ch]">
          What I work with, day to day.
        </h2>
      </div>

      <div className="tech-track overflow-x-clip overflow-y-visible">
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row md:flex-nowrap items-stretch gap-12 md:gap-12 px-6 md:px-10 pb-[clamp(64px,10vw,140px)] pt-2 will-change-transform"
          style={{ width: "100%" }}
        >
          {techPanels.map((panel, i) => (
            <article
              key={panel.name}
              className="tech-panel flex-shrink-0 w-full md:w-[70vw] md:max-w-[820px] border-t border-line pt-8 flex flex-col gap-10 md:gap-12"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
                  Stack {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
                  {String(i + 1).padStart(2, "0")} / {String(techPanels.length + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-fraunces text-[clamp(56px,8vw,140px)] leading-[0.95] text-paper font-light tracking-[-0.04em] pb-2">
                {panel.name}
              </h3>

              <div className="h-px w-full bg-line" />

              <p className="text-[18px] md:text-[20px] leading-[1.5] text-paper-2 max-w-[44ch] font-fraunces font-light">
                {panel.description}
              </p>

              <div className="mt-auto pt-8 font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2 flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                <span>Panel {String(i + 1).padStart(2, "0")} / {String(techPanels.length).padStart(2, "0")}</span>
              </div>
            </article>
          ))}

          <article className="tech-panel flex-shrink-0 w-full md:w-[50vw] md:max-w-[600px] border-t border-line pt-8 flex flex-col gap-10 md:gap-12">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
                Stack {String(techPanels.length + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
                + More
              </span>
            </div>

            <h3 className="font-fraunces text-[clamp(48px,7vw,120px)] leading-[0.95] text-paper font-light tracking-[-0.04em] pb-2">
              Tools.
            </h3>

            <div className="h-px w-full bg-line" />

            <div className="flex flex-wrap gap-2">
              {techChips.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full border border-line bg-ink-2 px-3 py-1.5 text-[12px] font-mono uppercase tracking-[0.12em] text-paper-2"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-8 font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <span>Panel {String(techPanels.length + 1).padStart(2, "0")} / {String(techPanels.length + 1).padStart(2, "0")}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
