"use client";

import { useEffect } from "react";
import { workExperience } from "@/data";
import React from "react";
import { Button } from "./moving-border";
import { useRevealAnimation } from "@/utils/useRevealAnimation";
import { useRevealContext } from "@/app/page";

const Experience = () => {
  const { shouldReveal } = useRevealContext();
  const { elementRef } = useRevealAnimation({
    delay: 0.4,
    duration: 0.9,
    distance: 70,
    stagger: 0.15,
    trigger: "scroll",
    threshold: 0.15,
  });

  useEffect(() => {
    if (shouldReveal && elementRef.current) {
      elementRef.current.style.opacity = "1";
    }
  }, [shouldReveal, elementRef]);

  return (
    <div
      className="py-20 w-full"
      id="experience"
      ref={elementRef as any}
      style={{ opacity: 0 }}
    >
      <h1 className="heading experience-heading">
        My
        <span className="text-purple"> Work Experience</span>
      </h1>
      <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
        {workExperience.map((card) =>
          card.id === 3 ? (
            <div
              key={card.id}
              className="experience-card lg:col-start-2 lg:col-span-2 flex justify-center"
            >
              <Button
                duration={Math.floor(Math.random() * 10000) + 10000}
                borderRadius="1.75rem"
                className="flex-1 text-white border-neutral-100 dark:border-slate-800"
              >
                <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
                  <img
                    src={card.thumbnail}
                    alt={card.thumbnail}
                    className="lg:w-32 md:w-20 w-16"
                  />
                  <div className="lg:ms-5 ">
                    <h1 className="text-start text-xl md:text-2xl font-bold">
                      {card.title}
                    </h1>
                    <p className="text-start text-white-100 mt-3 font-semibold">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          ) : (
            <Button
              key={card.id}
              duration={Math.floor(Math.random() * 10000) + 10000}
              borderRadius="1.75rem"
              className="experience-card flex-1 text-white border-neutral-100 dark:border-slate-800"
            >
              <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
                <img
                  src={card.thumbnail}
                  alt={card.thumbnail}
                  className="lg:w-32 md:w-20 w-16"
                />
                <div className="lg:ms-5">
                  <h1 className="text-start text-xl md:text-2xl font-bold">
                    {card.title}
                  </h1>
                  <p className="text-start text-white-100 mt-3 font-semibold">
                    {card.desc}
                  </p>
                </div>
              </div>
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default Experience;
