"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { heroTaglines, heroMeta } from "@/data/content";
import { Magnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el.querySelectorAll("[data-hero-anim]"), {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const start = () => {
      const tl = gsap.timeline();

      tl.fromTo(
        "[data-hero-anim='label']",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }
      )
        .fromTo(
          "[data-hero-anim='name-1']",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out" },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-anim='name-2']",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out" },
          "-=0.85"
        )
        .fromTo(
          "[data-hero-anim='tagline']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-anim='sub']",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
          "-=0.55"
        )
        .fromTo(
          "[data-hero-anim='meta']",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
          "-=0.4"
        );

      return tl;
    };

    let tl: gsap.core.Timeline | null = null;
    if (document.documentElement.dataset.preloaderDone === "true") {
      tl = start();
    } else {
      const onDone = () => {
        tl = start();
      };
      window.addEventListener("azman:preloader-done", onDone, { once: true });
    }

    if (taglineRef.current) {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const v = 1 - self.progress * 1.2;
          taglineRef.current!.style.opacity = String(Math.max(0.3, v));
        },
      });
    }

    return () => {
      tl?.kill();
    };
  }, [reduced]);

  const handleScrollToWork = () => {
    const el = document.getElementById("work");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full flex flex-col justify-start overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 px-6 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          data-hero-anim="label"
          className="text-[11px] md:text-[12px] font-mono uppercase tracking-[0.18em] text-paper-2"
        >
          <span className="text-accent">●</span> Mohammad Azman / React Native & Full-Stack — India
        </div>

        <h1 className="mt-8 md:mt-12 font-fraunces text-paper font-light leading-[0.85] tracking-[-0.04em]">
          <span className="block overflow-hidden">
            <span
              data-hero-anim="name-1"
              className="block text-[18vw] md:text-[14vw] lg:text-[200px] will-change-transform"
            >
              Mohammad
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              data-hero-anim="name-2"
              className="block text-[18vw] md:text-[14vw] lg:text-[200px] will-change-transform text-paper-2"
            >
              Azman<span className="text-accent">.</span>
            </span>
          </span>
        </h1>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
          <p
            ref={taglineRef}
            data-hero-anim="tagline"
            className="md:col-span-6 text-[20px] md:text-[24px] lg:text-[28px] leading-[1.25] text-paper font-fraunces font-light tracking-[-0.01em]"
          >
            {heroTaglines[0]}
          </p>

          <div className="md:col-span-5 md:col-start-8 space-y-4">
            <p
              data-hero-anim="sub"
              className="text-[14px] md:text-[15px] text-paper-2 leading-[1.6]"
            >
              React Native · Next.js · TypeScript · Node · MongoDB.{" "}
              <span className="text-paper">{heroMeta.publishedApps}</span>.
            </p>

            <div
              data-hero-anim="meta"
              className="flex flex-wrap items-center gap-4 text-[12px] font-mono uppercase tracking-[0.14em] text-paper-2 pt-2"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {heroMeta.based}
              </span>
              <span className="h-3 w-px bg-line" />
              <span>{heroMeta.status}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 1.4, duration: 0.6 }}
          >
            <Magnetic
              href="#work"
              onClick={handleScrollToWork}
              className="group inline-flex items-center gap-3 text-[14px] text-paper hover:text-accent transition-colors"
              ariaLabel="View work"
            >
              <span className="font-mono uppercase tracking-[0.14em]">View work</span>
              <span className="inline-block h-px w-12 bg-current group-hover:w-16 transition-all duration-300" />
              <span>↓</span>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 1.5, duration: 0.6 }}
            className="hidden md:block"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-paper-2">
              Scroll to explore
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
