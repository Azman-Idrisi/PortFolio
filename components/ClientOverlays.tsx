"use client";

import dynamic from "next/dynamic";

const Cursor = dynamic(
  () => import("@/components/cursor/Cursor").then((m) => m.Cursor),
  { ssr: false }
);
const LandingIntro = dynamic(
  () => import("@/components/landing/LandingIntro").then((m) => m.LandingIntro),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <LandingIntro />
      <Cursor />
    </>
  );
}
