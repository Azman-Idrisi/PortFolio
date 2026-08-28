"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { approachStages } from "@/data/approach";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function splitWords(text: string) {
  return text.split(/(\s+)/).map((seg, i) => ({
    seg,
    isSpace: /^\s+$/.test(seg),
    key: `${seg}-${i}`,
  }));
}

export function Approach() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section) return;

    if (reduced) {
      gsap.set(section.querySelectorAll("[data-approach-anim]"), {
        opacity: 1,
        y: 0,
        clipPath: "inset(0 0 0 0)",
      });
      gsap.set(section.querySelectorAll(".approach-word"), {
        yPercent: 0,
      });
      if (rail) gsap.set(rail, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Headline words
      const headlineWords = section.querySelectorAll<HTMLElement>(
        ".approach-headline .approach-word"
      );
      gsap.set(headlineWords, { yPercent: 110 });

      // Section entry: headline reveal + intro paragraph + first-row index
      const intro = section.querySelector(".approach-intro");
      const rail = section.querySelector(".approach-rail");

      const headlineTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      headlineTl.to(headlineWords, {
        yPercent: 0,
        duration: 1.0,
        stagger: 0.06,
        ease: "expo.out",
      });

      if (intro) {
        gsap.fromTo(
          intro,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: intro,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Top progress rail: scrubs left → right as the user scrolls through the section
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleX: 0, transformOrigin: "0% 50%" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          }
        );
      }

      // Each row: index clip-reveal, title word-stagger, body + tools slide up
      const rows = section.querySelectorAll<HTMLElement>(".approach-row");
      rows.forEach((row) => {
        const index = row.querySelector<HTMLElement>(".approach-index");
        const titleWords = row.querySelectorAll<HTMLElement>(
          ".approach-row-title .approach-word"
        );
        const body = row.querySelector<HTMLElement>(".approach-body");
        const tools = row.querySelector<HTMLElement>(".approach-tools");

        gsap.set(titleWords, { yPercent: 110 });
        if (index) gsap.set(index, { clipPath: "inset(0 100% 0 0)" });
        if (body) gsap.set(body, { opacity: 0, y: 16 });
        if (tools) gsap.set(tools, { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            once: true,
          },
        });

        if (index) {
          tl.to(
            index,
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.7,
              ease: "expo.out",
            },
            0
          );
        }
        tl.to(
          titleWords,
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.035,
            ease: "expo.out",
          },
          0.05
        );
        if (body) {
          tl.to(
            body,
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
            0.15
          );
        }
        if (tools) {
          tl.to(
            tools,
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
            0.25
          );
        }
      });

      // Closing footer: fade + slide
      const closer = section.querySelector(".approach-closer");
      if (closer) {
        gsap.set(closer, { opacity: 0, y: 12 });
        gsap.to(closer, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: closer,
            start: "top 90%",
            once: true,
          },
        });
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reduced]);

  const headlineWords = splitWords("How I build.");

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="relative w-full section-pad-y px-6 md:px-10 border-t border-line"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel index="04" className="mb-12">
          How I build
        </SectionLabel>

        <div
          ref={railRef}
          aria-hidden="true"
          className="approach-rail h-px w-full bg-line mb-10 md:mb-12 origin-left will-change-transform"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16">
          <h2 className="md:col-span-8 font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[18ch]">
            <span className="approach-headline block overflow-hidden">
              <span className="block">
                {headlineWords.map(({ seg, isSpace, key }) =>
                  isSpace ? (
                    <span key={key}>{seg}</span>
                  ) : (
                    <span
                      key={key}
                      className="inline-block overflow-hidden align-bottom"
                    >
                      <span className="approach-word inline-block will-change-transform">
                        {seg}
                      </span>
                    </span>
                  )
                )}
              </span>
            </span>
          </h2>
          <p
            data-approach-anim
            className="approach-intro md:col-span-4 self-end text-[15px] md:text-[16px] leading-[1.6] text-paper-2 font-fraunces font-light max-w-[36ch]"
          >
            The same loop, every time. Understood, designed, built, shipped, and
            improved until the product is honest.
          </p>
        </div>

        <ol className="border-t border-line">
          {approachStages.map((s, i) => {
            const titleWords = splitWords(s.title);
            return (
              <li
                key={s.id}
                className={`approach-row grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-8 md:py-10 border-b border-line ${
                  i === approachStages.length - 1 ? "md:border-b-0" : ""
                }`}
              >
                <div
                  className="approach-index md:col-span-2 font-mono text-[12px] uppercase tracking-[0.18em] text-accent will-change-[clip-path]"
                >
                  {s.index}
                </div>

                <h3 className="approach-row-title md:col-span-3 font-fraunces text-[28px] md:text-[36px] leading-[1.05] text-paper font-light tracking-[-0.02em] overflow-hidden">
                  <span className="block">
                    {titleWords.map(({ seg, isSpace, key }) =>
                      isSpace ? (
                        <span key={key}>{seg}</span>
                      ) : (
                        <span
                          key={key}
                          className="inline-block overflow-hidden align-bottom"
                        >
                          <span className="approach-word inline-block will-change-transform">
                            {seg}
                          </span>
                        </span>
                      )
                    )}
                  </span>
                </h3>

                <p
                  className={`approach-body ${
                    s.tools
                      ? "md:col-span-5 text-[15px] md:text-[16px] leading-[1.55] text-paper-2 font-fraunces font-light max-w-[48ch]"
                      : "md:col-span-7 text-[15px] md:text-[16px] leading-[1.55] text-paper-2 font-fraunces font-light max-w-[48ch]"
                  }`}
                >
                  {s.body}
                </p>

                {s.tools && (
                  <div className="approach-tools md:col-span-2 md:flex md:justify-end">
                    <ul className="flex flex-wrap gap-2 md:justify-end">
                      {s.tools.slice(0, 3).map((t) => (
                        <li
                          key={t}
                          className="inline-flex items-center rounded-full border border-line bg-ink-2 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-paper-2"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="approach-closer mt-10 md:mt-12 flex items-baseline justify-between gap-6 md:gap-10">
          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
            {String(approachStages.length).padStart(2, "0")} steps · repeated
            every project
          </span>
          <span className="hidden md:flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.18em] text-paper-2">
            <span className="h-px w-8 bg-accent" />
            <span>Loop closed · ship again</span>
          </span>
        </div>
      </div>
    </section>
  );
}
