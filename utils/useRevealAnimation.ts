"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Dynamically import ScrollTrigger to avoid SSR issues
let ScrollTrigger: any;
if (typeof window !== "undefined") {
  import("gsap/ScrollTrigger").then((module) => {
    ScrollTrigger = module.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  });
}

export interface RevealAnimationOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  ease?: string;
  trigger?: "immediate" | "scroll";
  threshold?: number;
}

export const useRevealAnimation = (options: RevealAnimationOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const childrenRef = useRef<(HTMLElement | null)[]>([]);

  const {
    delay = 0,
    duration = 0.8,
    distance = 50,
    stagger = 0.1,
    ease = "power3.out",
    trigger = "scroll",
    threshold = 0.1,
  } = options;

  const animateReveal = (immediate = false) => {
    const element = elementRef.current;
    if (!element) return;

    const children = element.children;
    const timeline = gsap.timeline();

    // Set initial state
    gsap.set(children, {
      opacity: 0,
      y: distance,
      scale: 0.95,
      rotationX: 10,
    });

    if (immediate || trigger === "immediate") {
      // Immediate animation for main page load
      timeline.to(children, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration,
        delay,
        stagger,
        ease,
      });
    } else {
      // Scroll-triggered animation
      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: element,
          start: `top ${100 - threshold * 100}%`,
          onEnter: () => {
            timeline.to(children, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration,
              stagger,
              ease,
            });
          },
          once: true,
        });
      } else {
        // Fallback if ScrollTrigger is not available
        setTimeout(() => {
          timeline.to(children, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration,
            stagger,
            ease,
          });
        }, delay * 1000);
      }
    }

    return timeline;
  };

  const animateChildren = (childElements?: NodeListOf<Element> | Element[]) => {
    const elements = childElements || elementRef.current?.children;
    if (!elements) return;

    const timeline = gsap.timeline();

    gsap.set(elements, {
      opacity: 0,
      y: distance,
      scale: 0.9,
    });

    timeline.to(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      ease,
    });

    return timeline;
  };

  const reset = () => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element.children, {
      opacity: 0,
      y: distance,
      scale: 0.95,
      rotationX: 10,
    });
  };

  useEffect(() => {
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
      }
    };
  }, []);

  return {
    elementRef,
    childrenRef,
    animateReveal,
    animateChildren,
    reset,
  };
};

export default useRevealAnimation;
