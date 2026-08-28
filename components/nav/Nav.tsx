"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { navItems } from "@/data/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Magnetic } from "@/hooks/useMagnetic";
import { MobileMenu } from "./MobileMenu";
import { resumeUrl } from "@/data/socials";
import { cn } from "@/utils/cn";
import { getLenis } from "@/lib/lenis";

const sectionIds = ["top", "about", "work", "practice", "approach", "experience", "contact"];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const active = useActiveSection(sectionIds);
  const lastYRef = useRef(0);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 80);
    const delta = v - lastYRef.current;
    if (Math.abs(delta) > 4) {
      setHidden(delta < 0 && v > 160 && active !== "top");
      lastYRef.current = v;
    }
  });

  useEffect(() => {
    if (active === "top") setHidden(false);
  }, [active]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -56, lock: false });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-[200] transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled && !hidden
            ? "bg-ink/70 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1440px] items-center justify-between px-6 md:px-10 transition-all duration-500",
            scrolled ? "h-14" : "h-20"
          )}
        >
          <a
            href="#top"
            onClick={(e) => handleAnchor(e, "#top")}
            className="font-zentry text-xl text-paper hover:text-accent transition-colors"
            aria-label="Mohammad Azman — Home"
            data-cursor="hover"
          >
            AZ
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = active === item.href.replace("#", "");
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleAnchor(e, item.href)}
                  className="relative text-[13px] font-mono uppercase tracking-[0.14em] text-paper-2 hover:text-paper transition-colors"
                  aria-current={isActive ? "page" : undefined}
                  data-cursor="hover"
                >
                  <span className="relative inline-block py-1">
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Magnetic
              href={resumeUrl}
              external
              className="text-[12px] font-mono uppercase tracking-[0.14em] text-paper-2 hover:text-accent transition-colors"
              ariaLabel="Download resume"
            >
              Resume ↓
            </Magnetic>
          </div>

          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            data-cursor="hover"
          >
            <span className="h-px w-6 bg-paper" />
            <span className="h-px w-6 bg-paper" />
          </button>
        </div>
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
          style={{ scaleX: scrollYProgress }}
          aria-hidden
        />
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} onNav={handleAnchor} />}
      </AnimatePresence>
    </>
  );
}
