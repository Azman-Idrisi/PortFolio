"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutParagraph, aboutIdentity } from "@/data/content";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { Meta } from "@/components/primitives/Meta";
import { HeroMarquee } from "@/components/hero/HeroMarquee";
import { useParallax } from "@/hooks/useParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMedia } from "@/hooks/useMedia";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function About() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const isDesktop = useMedia("(min-width: 768px)");
  useParallax(ref, !reduced && isDesktop);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el.querySelectorAll("[data-about-anim]"), { opacity: 1, y: 0 });
      return;
    }

    const items = el.querySelectorAll("[data-about-anim]");
    gsap.set(items, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
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
      id="about"
      ref={ref}
      className="relative w-full section-pad-y px-6 md:px-10 border-t border-line"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel index="01" className="mb-12 md:mb-16">
          About
        </SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-7" data-parallax="-0.04">
            <p
              data-about-anim
              className="font-fraunces text-[24px] md:text-[28px] lg:text-[32px] leading-[1.3] text-paper font-light tracking-[-0.01em]"
            >
              {aboutParagraph}
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9 space-y-4">
            {aboutIdentity.map((item) => (
              <div key={item.label} data-about-anim>
                <Meta label={item.label} value={item.value} />
              </div>
            ))}
          </div>
        </div>

        <div
          data-about-anim
          className="mt-12 md:mt-16 -mx-6 md:-mx-10 border-y border-line"
        >
          <HeroMarquee />
        </div>
      </div>
    </section>
  );
}
