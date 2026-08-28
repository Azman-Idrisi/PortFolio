"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getLenis } from "@/lib/lenis";

const DIGIT_2_NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const DIGIT_3_NUMS: number[] = [
  ...Array.from({ length: 10 }, (_, i) => i),
  ...Array.from({ length: 10 }, (_, i) => i),
  0,
];

export function LandingIntro() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  const lockedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !visible) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [mounted, visible]);

  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setVisible(false);
      return;
    }
    const el = rootRef.current;
    if (!el) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.stop();
      lockedRef.current = true;
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const digit1 = el.querySelector<HTMLElement>(".landing-digit-1");
      const digit2 = el.querySelector<HTMLElement>(".landing-digit-2");
      const digit3 = el.querySelector<HTMLElement>(".landing-digit-3");
      const progressBar = el.querySelector<HTMLElement>(".landing-progress-bar");

      if (!digit1 || !digit2 || !digit3 || !progressBar) return;

      const animate = (digit: HTMLElement, duration: number, delay = 0) => {
        const numHeight = digit.querySelector<HTMLElement>(".num")!.clientHeight;
        const totalDistance =
          (digit.querySelectorAll(".num").length - 1) * numHeight;
        gsap.to(digit, {
          y: -totalDistance,
          duration,
          delay,
          ease: "power2.inOut",
        });
      };

      animate(digit3, 5);
      animate(digit2, 6);
      animate(digit1, 2, 5);

      const tl = gsap.timeline({
        onComplete: () => {
          requestAnimationFrame(() => {
            setVisible(false);
          });
        },
      });
      tl.to(progressBar, {
        width: "30%",
        duration: 2,
        ease: "power4.inOut",
      }, 7);
      tl.to(progressBar, {
        width: "100%",
        opacity: 0,
        duration: 2,
        ease: "power3.out",
      }, 8.5);
      tl.to(el, {
        xPercent: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut",
      }, 10.7);
    }, rootRef);

    return () => {
      ctx.revert();
      if (lenis && lockedRef.current) {
        lenis.start();
        lockedRef.current = false;
      }
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mounted, reduced]);

  if (!mounted || !visible) return null;

  return (
    <section
      ref={rootRef}
      className="landing-hero"
      aria-label="Loading — Mohammad Azman"
    >
      <div className="landing-pre-loader">
        <p>Loading</p>
        <div className="landing-counter">
          <div className="landing-digit-1">
            <div className="num">0</div>
            <div className="num offset">1</div>
          </div>
          <div className="landing-digit-2">
            {DIGIT_2_NUMS.map((n, i) => (
              <div className={i === 1 ? "num offset" : "num"} key={i}>
                {n}
              </div>
            ))}
          </div>
          <div className="landing-digit-3">
            {DIGIT_3_NUMS.map((n, i) => (
              <div className={i === 1 ? "num offset" : "num"} key={i}>
                {n}
              </div>
            ))}
          </div>
          <div className="landing-digit-4">%</div>
        </div>
        <div className="landing-progress-bar" />
      </div>
    </section>
  );
}
