"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getLenis } from "@/lib/lenis";

const LANDING_PHOTOS = [
  "https://motionprompts.dev/c/oshane-howard-lp-responsive/img1.jpg",
  "https://motionprompts.dev/c/oshane-howard-lp-responsive/img2.jpg",
  "https://motionprompts.dev/c/oshane-howard-lp-responsive/img3.jpg",
  "https://motionprompts.dev/c/oshane-howard-lp-responsive/img4.jpg",
  "https://motionprompts.dev/c/oshane-howard-lp-responsive/img5.jpg",
  "https://motionprompts.dev/c/oshane-howard-lp-responsive/img6.jpg",
  "https://motionprompts.dev/c/oshane-howard-lp-responsive/img7.jpg",
] as const;

const SURNAME = "MOHAMMAD AZMAN";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setVisible(false);
      return;
    }
    const el = rootRef.current;
    if (!el) return;

    const lenis = getLenis();
    if (lenis) lenis.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>(".landing-hero-imgs > img"));
    const preload = Promise.race([
      Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((r) => {
                img.addEventListener("load", () => r(), { once: true });
                img.addEventListener("error", () => r(), { once: true });
              })
        )
      ),
      new Promise<void>((r) => setTimeout(r, 1000)),
    ]);

    let ctx: gsap.Context | null = null;

    preload.then(() => {
      ctx = gsap.context(() => {
        gsap.set(".landing-nav", { y: -150 });

        const digit1 = el.querySelector<HTMLElement>(".landing-digit-1");
        const digit2 = el.querySelector<HTMLElement>(".landing-digit-2");
        const digit3 = el.querySelector<HTMLElement>(".landing-digit-3");

        if (!digit1 || !digit2 || !digit3) return;

        const animate = (digit: HTMLElement, duration: number, delay = 1) => {
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

        gsap.to(".landing-progress-bar", {
          width: "30%",
          duration: 2,
          ease: "power4.inOut",
          delay: 7,
        });
        gsap.to(".landing-progress-bar", {
          width: "100%",
          opacity: 0,
          duration: 2,
          ease: "power3.out",
          delay: 8.5,
          onComplete: () => gsap.set(".landing-pre-loader", { display: "none" }),
        });

        gsap.to(".landing-hero-imgs > img", {
          clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
          duration: 1,
          ease: "power4.inOut",
          stagger: 0.25,
          delay: 9,
        });

        gsap.to(".landing-hero", {
          scale: 1.3,
          duration: 3,
          ease: "power3.inOut",
          delay: 9,
        });

        gsap.to(".landing-nav", {
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 11,
        });

        gsap.to(".landing-h1 .h1-char", {
          top: "0px",
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
          delay: 11,
        });

        gsap.to(".landing-hero", {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 13.2,
          onComplete: () => setVisible(false),
        });
      }, rootRef);
    });

    return () => {
      ctx?.revert();
      if (lenis) lenis.start();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mounted, reduced]);

  useEffect(() => {
    if (mounted && !visible) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [mounted, visible]);

  if (!mounted || !visible) return null;

  const chars = SURNAME.split("");

  const tree = (
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

      <div className="landing-hero-imgs">
        {LANDING_PHOTOS.map((src, i) => (
          <img key={i} src={src} alt="" />
        ))}
      </div>

      <div className="website-content">
        <nav className="landing-nav">
          <div className="logo">
            <p>Azman</p>
          </div>
          <div className="site-info">
            <p>React Native · Full-Stack · India</p>
          </div>
          <div className="menu">
            <p>Menu</p>
          </div>
        </nav>
        <div className="header">
          <h1 className="landing-h1">
            {chars.map((ch, i) => (
              <span
                key={i}
                className={ch === " " ? "h1-char h1-space" : "h1-char"}
              >
                {ch}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );

  return createPortal(tree, document.body);
}
