"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/data/experience";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Experience() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el.querySelectorAll("[data-exp-anim]"), { opacity: 1, y: 0 });
      return;
    }

    const items = el.querySelectorAll("[data-exp-anim]");
    gsap.set(items, { opacity: 0, y: 20 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "expo.out",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill());
    };
  }, [reduced]);

  return (
    <section
      id="experience"
      ref={ref}
      className="relative w-full section-pad-y px-6 md:px-10 border-t border-line"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel index="05" className="mb-16">
          Experience
        </SectionLabel>

        <h2 className="font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[20ch] mb-20 will-change-transform">
          Where I&apos;ve worked.
        </h2>

        <div className="space-y-0">
          {experience.map((exp) => (
            <div
              key={exp.id}
              data-exp-anim
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 border-t border-line"
            >
              <div className="md:col-span-2 font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
                {exp.period}
              </div>

              <div className="md:col-span-4">
                <div className="font-fraunces text-[24px] md:text-[28px] leading-[1.2] text-paper font-light">
                  {exp.role}
                </div>
                <div className="mt-2 text-[14px] font-mono uppercase tracking-[0.14em] text-paper-2">
                  {exp.company}
                </div>
              </div>

              <ul className="md:col-span-6 space-y-3">
                {exp.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-3 text-[15px] md:text-[16px] leading-[1.5] text-paper-2"
                  >
                    <span className="text-accent flex-shrink-0 mt-2 leading-none">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
