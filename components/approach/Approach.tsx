"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { approachStages } from "@/data/approach";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEP = 140;

export function Approach() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.innerWidth < 768;

    if (reduced || isMobile) {
      gsap.set(stageRefs.current.filter(Boolean), {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });
      gsap.set(bodyRefs.current.filter(Boolean), { opacity: 1, y: 0 });
      if (progressRef.current) gsap.set(progressRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];
      const bodies = bodyRefs.current.filter(Boolean) as HTMLDivElement[];
      const dots = dotsRef.current.filter(Boolean) as HTMLSpanElement[];

      const N = approachStages.length;
      let lastIndex = -1;

      const applyProgress = (progress: number) => {
        const local = progress * N;
        stages.forEach((el, idx) => {
          const distance = idx - local;
          const ad = Math.abs(distance);
          const opacity = Math.max(0, 1 - ad * 0.7);
          const y = distance * STEP;
          const scale = 0.78 + (1 - Math.min(1, ad)) * 0.22;
          gsap.set(el, {
            opacity,
            y,
            scale,
            filter: ad < 0.4 ? "blur(0px)" : "blur(1px)",
          });
        });
        bodies.forEach((el, idx) => {
          const distance = idx - local;
          const ad = Math.abs(distance);
          const opacity = Math.max(0, 1 - ad * 0.9);
          const y = distance * 24;
          gsap.set(el, { opacity, y });
        });
        dots.forEach((dot, idx) => {
          const d = Math.min(1, Math.max(0, 1 - Math.abs(local - idx - 0.5)));
          gsap.set(dot, {
            backgroundColor: d > 0.5 ? "#E8FF8B" : "rgba(255,255,255,0.12)",
            scale: 0.85 + d * 0.4,
          });
        });
        if (progressRef.current) {
          gsap.set(progressRef.current, {
            scaleX: progress,
            transformOrigin: "0% 50%",
          });
        }
        const i = Math.min(N - 1, Math.max(0, Math.floor(local)));
        if (i !== lastIndex) {
          lastIndex = i;
          setActiveIndex(i);
        }
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${N * 100}%`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyProgress(self.progress),
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="relative w-full section-pad-y border-t border-line overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-full flex flex-col">
        <SectionLabel index="05" className="mb-10 md:mb-12">
          How I build
        </SectionLabel>

        <h2 className="font-fraunces text-[clamp(48px,9vw,140px)] leading-[0.95] text-paper font-light tracking-[-0.04em] mb-10 md:mb-16">
          How I build.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 flex-1">
          {/* Wheel */}
          <div className="md:col-span-7 relative flex flex-col">
            <div
              ref={wheelRef}
              className="relative flex-1 min-h-[clamp(360px,55vh,560px)] overflow-hidden"
            >
              {approachStages.map((s, i) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    stageRefs.current[i] = el;
                  }}
                  className="absolute left-0 right-0 top-1/2 will-change-transform"
                  style={{ transform: "translateY(-50%)" }}
                  aria-hidden={i !== activeIndex}
                >
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <span
                      className={`font-mono text-[14px] md:text-[16px] uppercase tracking-[0.18em] ${i === activeIndex ? "text-accent" : "text-paper-2"}`}
                    >
                      {s.index}
                    </span>
                    <h3 className="font-fraunces text-[clamp(56px,9vw,128px)] leading-[0.95] text-paper font-light tracking-[-0.04em]">
                      {s.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="md:col-span-4 md:col-start-9 md:pl-6 relative flex flex-col">
            <div className="relative flex-1 min-h-[260px]">
              {approachStages.map((s, i) => (
                <div
                  key={`body-${s.id}`}
                  ref={(el) => {
                    bodyRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-center will-change-transform"
                  aria-hidden={i !== activeIndex}
                >
                  <div className="h-px w-12 bg-accent mb-6" />
                  <p className="font-fraunces text-[18px] md:text-[22px] leading-[1.4] text-paper font-light max-w-[36ch]">
                    {s.body}
                  </p>
                  {s.tools && (
                    <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-2">
                      {s.tools.map((t) => (
                        <li
                          key={t}
                          className="border border-line rounded-full px-2.5 py-1"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress + dots */}
        <div className="mt-10 md:mt-14 flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-2 shrink-0">
            {approachStages.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <span
                  ref={(el) => {
                    dotsRef.current[i] = el;
                  }}
                  className="block h-1.5 w-1.5 rounded-full will-change-transform"
                  style={{
                    backgroundColor:
                      i === 0 ? "#E8FF8B" : "rgba(255,255,255,0.12)",
                  }}
                />
                <span className={i === activeIndex ? "text-paper" : "text-paper-2"}>
                  {s.index}
                </span>
              </div>
            ))}
          </div>
          <div className="flex-1 h-px bg-line relative overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-0 bg-accent origin-left will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
