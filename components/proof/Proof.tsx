"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { proofMetrics, proofSecondary } from "@/data/proof";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Proof() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const blockRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bodyRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const isMobile = window.innerWidth < 768;

    if (reduced || isMobile) {
      gsap.set(blockRefs.current.filter(Boolean), { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(bodyRefs.current.filter(Boolean), { opacity: 1, y: 0 });
      if (progressRef.current) gsap.set(progressRef.current, { scaleX: 1 });
      return;
    }

    let removeMouseListeners: (() => void) | null = null;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const isWide = window.innerWidth >= 1024;
    if (isFine && isWide) {
      const qx = gsap.quickTo(stage, "x", { duration: 0.6, ease: "power3.out" });
      const qy = gsap.quickTo(stage, "y", { duration: 0.6, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        if (e.clientY < rect.top || e.clientY > rect.bottom) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        qx(dx * 4);
        qy(dy * 4);
      };
      const onLeave = () => {
        qx(0);
        qy(0);
      };
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
      removeMouseListeners = () => {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      };
    }

    const ctx = gsap.context(() => {
      const blocks = blockRefs.current.filter(Boolean) as HTMLDivElement[];
      const bodies = bodyRefs.current.filter(Boolean) as HTMLParagraphElement[];
      const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];
      const dots = dotsRef.current.filter(Boolean) as HTMLSpanElement[];

      const N = proofMetrics.length;
      let lastIndex = -1;

      const applyProgress = (progress: number) => {
        const local = progress * N;
        blocks.forEach((el, idx) => {
          const distance = idx - local;
          const ad = Math.abs(distance);
          const opacity = Math.max(0, 1 - ad);
          const y = distance * 80;
          const scale = 0.96 + (1 - Math.min(1, ad)) * 0.04;
          gsap.set(el, { opacity, y, scale, filter: ad < 0.5 ? "blur(0px)" : "blur(8px)" });
        });
        bodies.forEach((el, idx) => {
          const distance = idx - local;
          const ad = Math.abs(distance);
          const opacity = Math.max(0, 1 - ad * 1.4);
          const y = distance * 16;
          gsap.set(el, { opacity, y });
        });
        numbers.forEach((el, idx) => {
          const d = Math.min(1, Math.max(0, 1 - Math.abs(local - idx - 0.5)));
          gsap.set(el, {
            scale: 0.96 + d * 0.04,
            letterSpacing: `${(0.04 - d * 0.06).toFixed(3)}em`,
          });
        });
        if (progressRef.current) {
          gsap.set(progressRef.current, {
            scaleX: progress,
            transformOrigin: "0% 50%",
          });
        }
        dots.forEach((dot, idx) => {
          const d = Math.min(1, Math.max(0, 1 - Math.abs(local - idx - 0.5)));
          gsap.set(dot, {
            backgroundColor: d > 0.5 ? "#E8FF8B" : "rgba(255,255,255,0.12)",
            scale: 0.9 + d * 0.4,
          });
        });
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

    return () => {
      ctx.revert();
      removeMouseListeners?.();
    };
  }, [reduced]);

  return (
    <section
      id="proof"
      ref={sectionRef}
      className="relative w-full section-pad-y border-t border-line overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-full flex flex-col">
        <SectionLabel index="04" className="mb-10 md:mb-12">
          Proof
        </SectionLabel>

        <h2 className="font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[18ch] mb-12 md:mb-16">
          What have I actually done?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 flex-1">
          {/* Stage */}
          <div className="md:col-span-8 relative flex flex-col">
            <div
              ref={stageRef}
              className="relative flex-1 min-h-[clamp(320px,40vh,440px)] flex flex-col justify-center will-change-transform"
            >
              {proofMetrics.map((m, i) => (
                <div
                  key={m.id}
                  ref={(el) => {
                    blockRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-center will-change-transform"
                  aria-hidden={i !== activeIndex}
                >
                  <span
                    ref={(el) => {
                      numberRefs.current[i] = el;
                    }}
                    className="font-fraunces text-[clamp(96px,16vw,240px)] leading-[0.92] text-paper font-light tracking-[-0.04em] will-change-transform"
                    style={{ transformOrigin: "0% 50%" }}
                  >
                    {m.number}
                  </span>
                  <div className="mt-6 md:mt-8 h-px w-16 md:w-24 bg-accent" />
                  <div className="mt-4 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-paper">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Body block */}
            <div className="relative mt-8 md:mt-12 h-[64px]">
              {proofMetrics.map((m, i) => (
                <p
                  key={`body-${m.id}`}
                  ref={(el) => {
                    bodyRefs.current[i] = el;
                  }}
                  className="absolute inset-0 font-fraunces text-[16px] md:text-[20px] leading-[1.45] text-paper-2 font-light max-w-[44ch] will-change-transform"
                  aria-hidden={i !== activeIndex}
                >
                  <span className="text-paper">{m.source}</span>
                  <span className="mx-2 text-accent">·</span>
                  {m.note}
                </p>
              ))}
            </div>
          </div>

          {/* Rail */}
          <div className="md:col-span-3 md:col-start-10 md:pl-6 flex md:flex-col gap-3 md:gap-4 items-start md:items-end justify-center">
            <div
              ref={railRef}
              className="flex md:flex-col gap-3 md:gap-4"
              role="presentation"
            >
              {proofMetrics.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3">
                  <span
                    ref={(el) => {
                      dotsRef.current[i] = el;
                    }}
                    className="block h-1.5 w-1.5 rounded-full will-change-transform"
                    style={{
                      backgroundColor: i === 0 ? "#E8FF8B" : "rgba(255,255,255,0.12)",
                    }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-2">
                    {m.index}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress rule */}
        <div className="mt-10 md:mt-14 h-px w-full bg-line relative overflow-hidden">
          <div
            ref={progressRef}
            className="absolute inset-0 bg-accent origin-left will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Secondary list */}
        <ul className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-5 gap-y-4 gap-x-6">
          {proofSecondary.map((s) => (
            <li
              key={s.label}
              className="flex flex-col gap-1 border-l border-line pl-3"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-2">
                {s.label}
              </span>
              <span className="font-fraunces text-[18px] md:text-[22px] leading-[1.2] text-paper font-light">
                {s.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
