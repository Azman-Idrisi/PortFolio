"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRevealContext } from "@/utils/RevealContext";

interface PageRevealProps {
  children: React.ReactNode;
}

const PageReveal = ({ children }: PageRevealProps) => {
  const { shouldReveal } = useRevealContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReveal && containerRef.current) {
      const timeline = gsap.timeline({ delay: 0.1 });

      // Main page reveal animation
      timeline.fromTo(
        containerRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        }
      );

      // Staggered reveal of main sections
      const sections = containerRef.current.querySelectorAll(
        "section, .hero-section, .projects-section, .experience-section, footer"
      );

      if (sections.length > 0) {
        timeline.fromTo(
          sections,
          {
            opacity: 0,
            y: 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.8"
        );
      }

      // Add some floating particles effect
      const createParticles = () => {
        const particles: HTMLDivElement[] = [];
        for (let i = 0; i < 8; i++) {
          const particle = document.createElement("div");
          particle.className = "reveal-particle";
          particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #a855f7, #3b82f6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
          `;
          document.body.appendChild(particle);
          particles.push(particle);
        }

        // Animate particles
        gsap.to(particles, {
          opacity: 0,
          scale: 0,
          y: -100,
          x: "random(-100, 100)",
          duration: 2,
          stagger: 0.1,
          ease: "power2.out",
          onComplete: () => {
            particles.forEach((particle) => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            });
          },
        });
      };

      // Trigger particles after main animation
      timeline.call(createParticles, [], "-=0.5");
    }
  }, [shouldReveal]);

  return (
    <div
      ref={containerRef}
      className="page-reveal-container"
      style={{
        opacity: shouldReveal ? undefined : 0,
        transform: shouldReveal ? undefined : "translateY(30px) scale(0.95)",
      }}
    >
      {children}
    </div>
  );
};

export default PageReveal;
