"use client";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const Intro = () => {
  const [isHidden, setIsHidden] = useState(false);
  const panelsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!panels.length) return;

    gsap.set(panels, { yPercent: 0, force3D: true });

    gsap.to(panels, {
      yPercent: (index) => (index % 2 === 0 ? -100 : 100),
      duration: 1.1,
      ease: "power3.inOut",
      stagger: 0.06,
      force3D: true,
      onComplete: () => setIsHidden(true),
    });
  }, []);

  if (isHidden) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full">
      <div
        ref={(el) => {
          panelsRef.current[0] = el;
        }}
        className="flex h-full w-[14.2857%] items-center justify-center bg-[#0d0c1d] will-change-transform transform-gpu"
      >
        <span className="font-zentry text-[22vh] leading-none text-white md:text-[26vh] lg:text-[60vh]">
          L
        </span>
      </div>
      <div
        ref={(el) => {
          panelsRef.current[1] = el;
        }}
        className="flex h-full w-[14.2857%] items-center justify-center bg-[#161b33] will-change-transform transform-gpu"
      >
        <span className="font-zentry text-[22vh] leading-none text-white md:text-[26vh] lg:text-[60vh]">
          O
        </span>
      </div>
      <div
        ref={(el) => {
          panelsRef.current[2] = el;
        }}
        className="flex h-full w-[14.2857%] items-center justify-center bg-[#0d0c1d] will-change-transform transform-gpu"
      >
        <span className="font-zentry text-[22vh] leading-none text-white md:text-[26vh] lg:text-[60vh]">
          A
        </span>
      </div>
      <div
        ref={(el) => {
          panelsRef.current[3] = el;
        }}
        className="flex h-full w-[14.2857%] items-center justify-center bg-[#161b33] will-change-transform transform-gpu"
      >
        <span className="font-zentry text-[22vh] leading-none text-white md:text-[26vh] lg:text-[60vh]">
          D
        </span>
      </div>
      <div
        ref={(el) => {
          panelsRef.current[4] = el;
        }}
        className="flex h-full w-[14.2857%] items-center justify-center bg-[#0d0c1d] will-change-transform transform-gpu"
      >
        <span className="font-zentry text-[22vh] leading-none text-white md:text-[26vh] lg:text-[60vh]">
          I
        </span>
      </div>
      <div
        ref={(el) => {
          panelsRef.current[5] = el;
        }}
        className="flex h-full w-[14.2857%] items-center justify-center bg-[#161b33] will-change-transform transform-gpu"
      >
        <span className="font-zentry text-[22vh] leading-none text-white md:text-[26vh] lg:text-[60vh]">
          N
        </span>
      </div>
      <div
        ref={(el) => {
          panelsRef.current[6] = el;
        }}
        className="flex h-full w-[14.2857%] items-center justify-center bg-[#0d0c1d] will-change-transform transform-gpu"
      >
        <span className="font-zentry text-[22vh] leading-none text-white md:text-[26vh] lg:text-[60vh]">
          G
        </span>
      </div>
    </div>
  );
};

export default Intro;