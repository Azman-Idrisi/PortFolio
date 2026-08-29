[1mdiff --git a/app/globals.css b/app/globals.css[m
[1mindex 2122f8b..db48e45 100644[m
[1m--- a/app/globals.css[m
[1m+++ b/app/globals.css[m
[36m@@ -190,6 +190,16 @@[m
       right: -5px;[m
     }[m
   }[m
[32m+[m
[32m+[m[32m  @media (min-width: 901px) and (max-width: 1280px) {[m
[32m+[m[32m    .landing-hero .landing-counter {[m
[32m+[m[32m      font-size: 80px;[m
[32m+[m[32m    }[m
[32m+[m[32m    .landing-hero .landing-pre-loader p {[m
[32m+[m[32m      font-size: 48px;[m
[32m+[m[32m      line-height: 70px;[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
 }[m
 [m
 @media (prefers-reduced-motion: reduce) {[m
[1mdiff --git a/components/Sections.tsx b/components/Sections.tsx[m
[1mindex 8798920..14b3140 100644[m
[1m--- a/components/Sections.tsx[m
[1m+++ b/components/Sections.tsx[m
[36m@@ -1,5 +1,6 @@[m
 "use client";[m
 [m
[32m+[m[32mimport { useEffect } from "react";[m
 import dynamic from "next/dynamic";[m
 import { SectionsErrorBoundary } from "@/components/SectionsErrorBoundary";[m
 [m
[36m@@ -28,6 +29,23 @@[m [mconst Contact = dynamic([m
 );[m
 [m
 export function Sections() {[m
[32m+[m[32m  useEffect(() => {[m
[32m+[m[32m    if (typeof window === "undefined") return;[m
[32m+[m[32m    let cancelled = false;[m
[32m+[m[32m    const refresh = async () => {[m
[32m+[m[32m      const mod = await import("gsap/ScrollTrigger");[m
[32m+[m[32m      if (cancelled) return;[m
[32m+[m[32m      mod.ScrollTrigger.refresh();[m
[32m+[m[32m    };[m
[32m+[m[32m    const raf = requestAnimationFrame(() => {[m
[32m+[m[32m      requestAnimationFrame(refresh);[m
[32m+[m[32m    });[m
[32m+[m[32m    return () => {[m
[32m+[m[32m      cancelled = true;[m
[32m+[m[32m      cancelAnimationFrame(raf);[m
[32m+[m[32m    };[m
[32m+[m[32m  }, []);[m
[32m+[m
   return ([m
     <SectionsErrorBoundary>[m
       <About />[m
[1mdiff --git a/components/approach/Approach.tsx b/components/approach/Approach.tsx[m
[1mindex 98d49fc..12ef9fa 100644[m
[1m--- a/components/approach/Approach.tsx[m
[1m+++ b/components/approach/Approach.tsx[m
[36m@@ -42,70 +42,150 @@[m [mexport function Approach() {[m
       return;[m
     }[m
 [m
[31m-    const ctx = gsap.context(() => {[m
[31m-      // Headline words[m
[31m-      const headlineWords = section.querySelectorAll<HTMLElement>([m
[31m-        ".approach-headline .approach-word"[m
[32m+[m[32m    // Headline words[m
[32m+[m[32m    const headlineWords = section.querySelectorAll<HTMLElement>([m
[32m+[m[32m      ".approach-headline .approach-word"[m
[32m+[m[32m    );[m
[32m+[m[32m    gsap.set(headlineWords, { yPercent: 110 });[m
[32m+[m
[32m+[m[32m    const intro = section.querySelector<HTMLElement>(".approach-intro");[m
[32m+[m[32m    const railEl = section.querySelector<HTMLElement>(".approach-rail");[m
[32m+[m
[32m+[m[32m    ScrollTrigger.create({[m
[32m+[m[32m      trigger: section,[m
[32m+[m[32m      start: "top 80%",[m
[32m+[m[32m      once: true,[m
[32m+[m[32m      onEnter: () => {[m
[32m+[m[32m        gsap.to(headlineWords, {[m
[32m+[m[32m          yPercent: 0,[m
[32m+[m[32m          duration: 1.0,[m
[32m+[m[32m          stagger: 0.06,[m
[32m+[m[32m          ease: "expo.out",[m
[32m+[m[32m        });[m
[32m+[m[32m      },[m
[32m+[m[32m    });[m
[32m+[m
[32m+[m[32m    if (intro) {[m
[32m+[m[32m      gsap.fromTo([m
[32m+[m[32m        intro,[m
[32m+[m[32m        { opacity: 0, y: 20 },[m
[32m+[m[32m        {[m
[32m+[m[32m          opacity: 1,[m
[32m+[m[32m          y: 0,[m
[32m+[m[32m          duration: 0.9,[m
[32m+[m[32m          ease: "expo.out",[m
[32m+[m[32m          scrollTrigger: {[m
[32m+[m[32m            trigger: intro,[m
[32m+[m[32m            start: "top 85%",[m
[32m+[m[32m            once: true,[m
[32m+[m[32m          },[m
[32m+[m[32m        }[m
[32m+[m[32m      );[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    // Top progress rail: scrubs left → right as the user scrolls through the section[m
[32m+[m[32m    if (railEl) {[m
[32m+[m[32m      gsap.fromTo([m
[32m+[m[32m        railEl,[m
[32m+[m[32m        { scaleX: 0, transformOrigin: "0% 50%" },[m
[32m+[m[32m        {[m
[32m+[m[32m          scaleX: 1,[m
[32m+[m[32m          ease: "none",[m
[32m+[m[32m          scrollTrigger: {[m
[32m+[m[32m            trigger: section,[m
[32m+[m[32m            start: "top 75%",[m
[32m+[m[32m            end: "bottom 75%",[m
[32m+[m[32m            scrub: 0.6,[m
[32m+[m[32m          },[m
[32m+[m[32m        }[m
       );[m
[31m-      gsap.set(headlineWords, { yPercent: 110 });[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    // Each row: index clip-reveal, title word-stagger, body + tools slide up[m
[32m+[m[32m    const rows = section.querySelectorAll<HTMLElement>(".approach-row");[m
[32m+[m[32m    rows.forEach((row) => {[m
[32m+[m[32m      const index = row.querySelector<HTMLElement>(".approach-index");[m
[32m+[m[32m      const titleWords = row.querySelectorAll<HTMLElement>([m
[32m+[m[32m        ".approach-row-title .approach-word"[m
[32m+[m[32m      );[m
[32m+[m[32m      const body = row.querySelector<HTMLElement>(".approach-body");[m
[32m+[m[32m      const tools = row.querySelector<HTMLElement>(".approach-tools");[m
 [m
[31m-      // Section entry: headline reveal + intro paragraph + first-row index[m
[31m-      const intro = section.querySelector(".approach-intro");[m
[31m-      const rail = section.querySelector(".approach-rail");[m
[32m+[m[32m      gsap.set(titleWords, { yPercent: 110 });[m
[32m+[m[32m      if (index) gsap.set(index, { clipPath: "inset(0 100% 0 0)" });[m
[32m+[m[32m      if (body) gsap.set(body, { opacity: 0, y: 16 });[m
[32m+[m[32m      if (tools) gsap.set(tools, { opacity: 0, y: 16 });[m
 [m
[31m-      const headlineTl = gsap.timeline({[m
[32m+[m[32m      const tl = gsap.timeline({[m
         scrollTrigger: {[m
[31m-          trigger: section,[m
[31m-          start: "top 80%",[m
[32m+[m[32m          trigger: row,[m
[32m+[m[32m          start: "top 82%",[m
           once: true,[m
         },[m
       });[m
 [m
[31m-      headlineTl.to(headlineWords, {[m
[31m-        yPercent: 0,[m
[31m-        duration: 1.0,[m
[31m-        stagger: 0.06,[m
[31m-        ease: "expo.out",[m
[31m-      });[m
[31m-[m
[31m-      if (intro) {[m
[31m-        gsap.fromTo([m
[31m-          intro,[m
[31m-          { opacity: 0, y: 20 },[m
[32m+[m[32m      if (index) {[m
[32m+[m[32m        tl.to([m
[32m+[m[32m          index,[m
           {[m
[31m-            opacity: 1,[m
[31m-            y: 0,[m
[31m-            duration: 0.9,[m
[32m+[m[32m            clipPath: "inset(0 0% 0 0)",[m
[32m+[m[32m            duration: 0.7,[m
             ease: "expo.out",[m
[31m-            scrollTrigger: {[m
[31m-              trigger: intro,[m
[31m-              start: "top 85%",[m
[31m-              once: true,[m
[31m-            },[m
[31m-          }[m
[32m+[m[32m          },[m
[32m+[m[32m          0[m
         );[m
       }[m
[31m-[m
[31m-      // Top progress rail: scrubs left → right as the user scrolls through the section[m
[31m-      if (rail) {[m
[31m-        gsap.fromTo([m
[31m-          rail,[m
[31m-          { scaleX: 0, transformOrigin: "0% 50%" },[m
[31m-          {[m
[31m-            scaleX: 1,[m
[31m-            ease: "none",[m
[31m-            scrollTrigger: {[m
[31m-              trigger: section,[m
[31m-              start: "top 75%",[m
[31m-              end: "bottom 75%",[m
[31m-              scrub: 0.6,[m
[31m-            },[m
[31m-          }[m
[32m+[m[32m      tl.to([m
[32m+[m[32m        titleWords,[m
[32m+[m[32m        {[m
[32m+[m[32m          yPercent: 0,[m
[32m+[m[32m          duration: 0.9,[m
[32m+[m[32m          stagger: 0.035,[m
[32m+[m[32m          ease: "expo