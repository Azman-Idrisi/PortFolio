"use client";

import dynamic from "next/dynamic";
import { Preloader } from "@/components/intro/Preloader";

const Cursor = dynamic(() => import("@/components/cursor/Cursor").then((m) => m.Cursor), {
  ssr: false,
});

export function ClientOverlays() {
  return (
    <>
      <Preloader />
      <Cursor />
    </>
  );
}
