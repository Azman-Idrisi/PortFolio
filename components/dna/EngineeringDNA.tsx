"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { dnaConcepts } from "@/data/dna";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function EngineeringDNA() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageOk, setImageOk] = useState<Record<string, boolean>>({});
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.innerWidth < 768;

    if (reduced || isMobile) {
      gsap.set(wordRefs.current.filter(Boolean), {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });
      if (progressRef.current) gsap.set(progressRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const dots = dotsRef.current.filter(Boolean) as HTMLSpanElement[];

      const N = dnaConcepts.length;
      let lastIndex = -1;

      const applyProgress = (progress: number) => {
        const local = progress * N;
        words.forEach((el, idx) => {
          const distance = idx - local;
          const ad = Math.abs(distance);
          const opacity = ad < 0.4 ? 1 : Math.max(0.18, 1 - ad * 0.55);
          const x = distance * 18;
          const y = distance * 30;
          const scale = 0.85 + (1 - Math.min(1, ad)) * 0.15;
          const isActive = ad < 0.4;
          gsap.set(el, {
            opacity,
            x,
            y,
            scale,
            color: isActive ? "#f4f1ec" : "#a8a39a",
            filter: isActive ? "blur(0px)" : "blur(2px)",
          });
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
        if (counterRef.current) {
          const display = String(Math.min(N, Math.max(1, Math.floor(local) + 1))).padStart(2, "0");
          counterRef.current.textContent = `${display} / ${String(N).padStart(2, "0")}`;
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

  const activeConcept = dnaConcepts[activeIndex];

  return (
    <section
      id="dna"
      ref={sectionRef}
      className="relative w-full section-pad-y border-t border-line overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-full flex flex-col">
        <SectionLabel index="06" className="mb-10 md:mb-12">
          Engineering DNA
        </SectionLabel>

        <h2 className="font-fraunces text-[clamp(40px,6vw,96px)] leading-[1] text-paper font-light tracking-[-0.03em] max-w-[20ch] mb-10 md:mb-16">
          What do I care about, technically?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 flex-1">
          {/* Kinetic canvas */}
          <div className="dna-canvas md:col-span-7 relative flex flex-col">
            <div className="relative flex-1 min-h-[clamp(420px,55vh,600px)] overflow-hidden">
              {dnaConcepts.map((c, i) => (
                <span
                  key={c.id}
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                  className="dna-word absolute font-fraunces leading-[0.9] font-light tracking-[-0.05em] will-change-transform select-none"
                  style={{
                    left: c.position.left,
                    top: c.position.top,
                    color: i === 0 ? "#f4f1ec" : "#a8a39a",
                  }}
                  aria-hidden={i !== activeIndex}
                >
                  {c.title}
                </span>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="md:col-span-5 md:pl-6 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeConcept.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    {activeConcept.index}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-2">
                    / {String(dnaConcepts.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-fraunces text-[clamp(40px,5vw,72px)] leading-[0.95] text-paper font-light tracking-[-0.04em] mb-5">
                  {activeConcept.title}
                </h3>

                <div className="image-fallback aspect-[16/10] w-full mb-5 overflow-hidden border border-line relative">
                  {imageOk[activeConcept.id] !== false ? (
                    <img
                      src={activeConcept.image}
                      alt={`${activeConcept.title} visual reference`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={() =>
                        setImageOk((prev) => ({ ...prev, [activeConcept.id]: false }))
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-2">
                        Image not available
                      </span>
                    </div>
                  )}
                </div>

                <p className="font-fraunces text-[16px] md:text-[18px] leading-[1.45] text-paper-2 font-light max-w-[42ch] mb-5">
                  {activeConcept.body}
                </p>

                <div className="border-t border-line pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-2 mr-3">
                    Evidence
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper">
                    {activeConcept.evidence.join(" · ")}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress + dots + counter */}
        <div className="mt-10 md:mt-14 flex items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            {dnaConcepts.map((c, i) => (
              <span
                key={c.id}
                ref={(el) => {
                  dotsRef.current[i] = el;
                }}
                className="block h-1.5 w-1.5 rounded-full will-change-transform"
                style={{
                  backgroundColor:
                    i === 0 ? "#E8FF8B" : "rgba(255,255,255,0.12)",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
          <span
            ref={counterRef}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-2 shrink-0"
          >
            01 / 06
          </span>
          <div className="flex-1 h-px bg-line relative overflow-hidden ml-2">
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
