"use client";

import { useState } from "react";
import Image from "next/image";

type ProjectThumbnailProps = {
  src: string;
  alt: string;
  className?: string;
};

// Thumbnails come in mixed shapes (3:2, 4:3, ~2:1). The box takes each image's
// natural aspect ratio instead of cropping it: width/height only seed a 3:2
// placeholder ratio until the file loads (`height: auto` then uses the real one).
export function ProjectThumbnail({ src, alt, className = "" }: ProjectThumbnailProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`relative w-full aspect-[4/3] border border-line bg-ink-2 flex items-center justify-center ${className}`}
        aria-label={`${alt} — image not available`}
        role="img"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-2">
          Image not available
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full border border-line bg-ink-2 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1500}
        height={1000}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`block h-auto w-full transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  );
}
