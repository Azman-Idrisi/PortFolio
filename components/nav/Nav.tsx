"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { navItems } from "@/data/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Magnetic } from "@/hooks/useMagnetic";
import { MobileMenu } from "./MobileMenu";
import { resumeUrl } from "@/data/socials";
import { cn } from "@/utils/cn";

const sectionIds = ["top", "about", "work", "practice", "contact"];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const active = useActiveSection(sectionIds);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 80);
  });

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
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-[200] transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "bg-ink/70 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} onNav={handleAnchor} />}
      </AnimatePresence>
    </>
  );
}
