"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
