"use client";

import { Marquee } from "@/components/primitives/Marquee";
import { marqueeItems } from "@/data/content";

export function HeroMarquee({ className = "" }: { className?: string }) {
  return <Marquee items={marqueeItems} speed={50} className={className} />;
}
