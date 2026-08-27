"use client";

import { forwardRef } from "react";
import { AZMAN_PATHS } from "@/lib/azman-paths";

type AzmanWordmarkProps = {
  className?: string;
};

export const AzmanWordmark = forwardRef<SVGGElement, AzmanWordmarkProps>(
  function AzmanWordmark({ className }, ref) {
    return (
      <svg
        viewBox={AZMAN_PATHS.viewBox}
        preserveAspectRatio="xMidYMid meet"
        className={`block w-[88vw] md:w-[70vw] max-w-[1100px] h-auto ${className ?? ""}`}
        aria-label="AZMAN"
        role="img"
      >
        <g
          ref={ref}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {AZMAN_PATHS.paths.map((p, i) => (
            <path key={i} d={p.d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
    );
  }
);
