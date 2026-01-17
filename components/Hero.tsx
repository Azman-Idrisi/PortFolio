"use client";

import React, { useEffect } from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { useRevealAnimation } from "@/utils/useRevealAnimation";
import { useRevealContext } from "@/utils/RevealContext";
import { gsap } from "gsap";
import Intro from "./Intro";

const Hero = () => {
  const { shouldReveal } = useRevealContext();
  const { elementRef } = useRevealAnimation({
    delay: 0.2,
    duration: 1.2,
    distance: 80,
    stagger: 0.3,
    trigger: "immediate",
  });

  useEffect(() => {
    if (shouldReveal) {
      // Custom animation for hero elements
      const timeline = gsap.timeline();

      // Animate spotlights first
      timeline.fromTo(
        ".hero-spotlight",
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: "power3.out",
        }
      );

      // Animate main content with more dramatic effects
      timeline
        .fromTo(
          ".hero-title",
          {
            opacity: 0,
            y: 80,
            scale: 0.8,
            rotationX: 20,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1"
        )
        .fromTo(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 40,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.8"
        )
        .fromTo(
          ".hero-button",
          {
            opacity: 0,
            y: 30,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

      // Add floating animation to button
      timeline.to(
        ".hero-button",
        {
          y: -5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
        "-=0.5"
      );
    }
  }, [shouldReveal]);

  const handleShowWorkClick = () => {
    const projectsElement = document.getElementById("projects");
    if (projectsElement) {
      projectsElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="pb-20 pt-36" ref={elementRef as any}>
      <div>
        <Spotlight
          className="hero-spotlight -top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="hero-spotlight top-10 left-full h-[80vh] w-[50vh]"
          fill="purple"
        />
        <Spotlight
          className="hero-spotlight top-28 left-80 h-[50vw]"
          fill="blue"
        />
      </div>

      <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.3] bg-grid-black/[0.03] flex items-center justify-center absolute top-0 left-0">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="hero-content max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <div className="hero-title">
            <TextGenerateEffect
              className="text-center text-[40px] md:text-5xl lg:text-7xl font-silkscreen"
              words="Idrees Azman"
            />
          </div>

          <div className="hero-subtitle">
            <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
              Hi, I&apos;m Azman.
            </p>
          </div>

          <div className="hero-button">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
              handleClick={handleShowWorkClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
