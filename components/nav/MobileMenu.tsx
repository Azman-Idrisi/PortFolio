"use client";

import { motion } from "motion/react";
import { navItems } from "@/data/content";
import { resumeUrl } from "@/data/socials";
import { Magnetic } from "@/hooks/useMagnetic";

type MobileMenuProps = {
  onClose: () => void;
  onNav: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
};

export function MobileMenu({ onClose, onNav }: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[300] bg-ink md:hidden flex flex-col"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="flex items-center justify-between px-6 h-20 border-b border-line">
        <span className="font-zentry text-xl text-paper">AZ</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 -mr-2 text-paper"
          data-cursor="hover"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 flex flex-col justify-center px-8 gap-2" aria-label="Mobile">
        {navItems.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.href}
            onClick={(e) => onNav(e, item.href)}
            className="font-fraunces text-5xl text-paper hover:text-accent transition-colors py-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            data-cursor="hover"
          >
            <span className="text-paper-2 font-mono text-sm mr-3 align-middle">
              0{i + 1}
            </span>
            {item.label}
          </motion.a>
        ))}
      </nav>

      <div className="px-8 py-8 border-t border-line flex items-center justify-between">
        <span className="text-[12px] font-mono uppercase tracking-[0.14em] text-paper-2">
          Resume
        </span>
        <Magnetic
          href={resumeUrl}
          external
          className="text-[14px] text-paper hover:text-accent transition-colors"
        >
          Download ↗
        </Magnetic>
      </div>
    </motion.div>
  );
}
