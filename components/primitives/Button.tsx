"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
  ariaLabel?: string;
};

export function Button({
  children,
  href,
  onClick,
  external = false,
  variant = "primary",
  className = "",
  ariaLabel,
}: ButtonProps) {
  const base =
    "group inline-flex items-center gap-2 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent";
  const variants = {
    primary:
      "border border-paper/15 bg-ink-2 px-5 py-3 text-paper hover:border-accent hover:text-accent",
    ghost: "text-paper hover:text-accent",
  };

  const inner = (
    <>
      <span>{children}</span>
      <HiArrowUpRight
        size={14}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className={`${base} ${variants[variant]} ${className}`}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {inner}
    </button>
  );
}
