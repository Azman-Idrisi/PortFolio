"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import { socials, email, resumeUrl } from "@/data/socials";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { SocialIcon } from "@/components/primitives/SocialIcon";
import { Magnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Contact() {
  const ref = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const h = headlineRef.current;
    if (!el || !h) return;

    if (reduced) {
      gsap.set(h, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(h, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(h, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out" });
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill());
    };
  }, [reduced]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative w-full section-pad-y px-6 md:px-10 border-t border-line"
    >
      <div className="mx-auto max-w-[1440px] flex flex-col items-center text-center">
        <SectionLabel index="06" className="mb-12">
          Contact
        </SectionLabel>

        <h2
          ref={headlineRef}
          className="font-fraunces text-[clamp(56px,12vw,200px)] leading-[0.95] text-paper font-light tracking-[-0.04em] max-w-[14ch]"
        >
          Let&apos;s build something.
        </h2>

        <div className="mt-16 md:mt-20 flex flex-col items-center gap-4">
          <Magnetic
            onClick={handleCopy}
            className="group relative font-fraunces text-[clamp(28px,5vw,56px)] leading-[1] text-accent hover:text-paper transition-colors"
            ariaLabel="Copy email address"
          >
            {email}
          </Magnetic>

          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-[11px] font-mono uppercase tracking-[0.18em] text-paper-2"
              >
                Copied to clipboard
              </motion.span>
            )}
          </AnimatePresence>

          <a
            href={`mailto:${email}`}
            className="mt-2 text-[12px] font-mono uppercase tracking-[0.14em] text-paper-2 hover:text-paper transition-colors"
            data-cursor="hover"
          >
            Open mail client →
          </a>
        </div>

        <div className="mt-16 md:mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {socials.map((s) => (
            <Magnetic
              key={s.id}
              href={s.href}
              external
              className="group inline-flex items-center gap-2 text-[14px] font-mono uppercase tracking-[0.14em] text-paper-2 hover:text-paper transition-colors"
              ariaLabel={s.label}
            >
              <SocialIcon iconKey={s.iconKey} />
              <span>{s.label}</span>
              <span className="text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Magnetic>
          ))}
        </div>

        <div className="mt-24 md:mt-32 pt-8 border-t border-line w-full flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] font-mono uppercase tracking-[0.14em] text-paper-2">
          <CurrentMood />
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-paper transition-colors"
            data-cursor="hover"
          >
            Resume ↗
          </a>
          <span>Kanpur, India · UTC+5:30</span>
        </div>
      </div>
    </section>
  );
}

function CurrentMood() {
  return (
    <span className="relative group inline-block">
      <span className="cursor-pointer transition-colors group-hover:text-paper">
        © 2026 Mohammad Azman
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44"
      >
        <span className="relative block opacity-0 translate-y-1 scale-[0.97] group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-[opacity,transform] duration-300 ease-out">
          <span className="block overflow-hidden rounded-md border border-line bg-ink-2 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <span className="block aspect-square w-full overflow-hidden rounded-sm bg-ink-3">
              <img
                src="/ghee/ghee.webp"
                alt="Current mood"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget.style.display = "none");
                }}
              />
            </span>
            <span className="mt-2 block text-center text-[10px] font-mono uppercase tracking-[0.18em] text-paper-2">
              Current mood
            </span>
          </span>
          <span className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-line bg-ink-2" />
        </span>
      </span>
    </span>
  );
}
