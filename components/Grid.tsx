"use client";

import React, { useEffect } from "react";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { gridItems } from "@/data";
import { useRevealAnimation } from "@/utils/useRevealAnimation";
import { useRevealContext } from "@/utils/RevealContext";

const Grid = () => {
  const { shouldReveal } = useRevealContext();
  const { elementRef } = useRevealAnimation({
    delay: 0.8,
    duration: 0.8,
    distance: 60,
    stagger: 0.15,
    trigger: "scroll",
    threshold: 0.2,
  });

  useEffect(() => {
    if (shouldReveal && elementRef.current) {
      // Set initial state for grid items
      const gridItems = elementRef.current.querySelectorAll(".bento-grid-item");
      if (gridItems.length > 0) {
        // Initial animation triggered by scroll
        elementRef.current.style.opacity = "1";
      }
    }
  }, [shouldReveal, elementRef]);

  return (
    <section id="about" ref={elementRef as any} style={{ opacity: 0 }}>
      <BentoGrid>
        {gridItems.map(
          ({
            id,
            title,
            description,
            className,
            img,
            imgClassName,
            titleClassName,
            spareImg,
          }) => {
            return (
              <BentoGridItem
                id={id}
                key={id}
                title={title}
                description={description}
                className={`bento-grid-item ${className}`}
                img={img}
                imgClassName={imgClassName}
                titleClassName={titleClassName}
                spareImg={spareImg}
              />
            );
          }
        )}
      </BentoGrid>
    </section>
  );
};

export default Grid;
