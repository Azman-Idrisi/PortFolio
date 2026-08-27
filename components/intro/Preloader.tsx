"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AzmanWordmark } from "@/components/intro/AzmanWordmark";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getLenis } from "@/lib/lenis";

const SESSION_KEY = "azman-intro-seen";
const DONE_EVENT = "azman:preloader-done";
const DONE_ATTR = "preloaderDone";

function markDone() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset[DONE_ATTR] = "true";
  window.dispatchEvent(new Event(DONE_EVENT));
}

export function Preloader() {
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      markDone();
      return;
    }
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active || !rootRef.current || !markRef.current) return;

    const lenis = getLenis();
    if (lenis) lenis.stop();
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "hidden";
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (typeof document !== "undefined") {
          document.documentElement.style.overflow = "";
        }
        if (lenis) lenis.start();
        sessionStorage.setItem(SESSION_KEY, "1");
        markDone();
        setActive(false);
      },
    });

    const paths = markRef.current.querySelectorAll("path");
    const lengths: number[] = [];
    paths.forEach((p) => {
      const len = (p as SVGGeometryElement).getTotalLength();
      lengths.push(len);
      gsap.set(p, {
        strokeDasharray: `${len} ${len}`,
        strokeDashoffset: len,
      });
    });

    if (reduced) {
      paths.forEach((p) => {
        gsap.set(p, { strokeDashoffset: 0 });
      });
      gsap.set(markRef.current, { fill: "currentColor" });
      tl.to(rootRef.current, {
        yPercent: -100,
        duration: 0.45,
        ease: "power2.inOut",
      });
      return () => {
        tl.kill();
      };
    }

    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 0.7,
      stagger: 0.18,
      ease: "expo.out",
    })
      .to(
        markRef.current,
        {
          fill: "currentColor",
          duration: 0.3,
          ease: "power1.out",
        },
        ">-0.1"
      )
      .to({}, { duration: 0.2 })
      .to(
        rootRef.current,
        {
          yPercent: -100,
          duration: 1.0,
          ease: "expo.inOut",
        },
        ">"
      );

    return () => {
      tl.kill();
    };
  }, [active, reduced]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      data-preloader
      aria-hidden="true"
      className="preloader-curtain fixed inset-0 z-[10000] flex items-center justify-center bg-ink"
    >
      <AzmanWordmark ref={markRef} className="text-paper" />
    </div>
  );
}
