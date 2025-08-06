import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const colors = [
  "#0ea5e9", // Sky blue
  "#737373", // Gray
  "#14b8a6", // Teal
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#eab308", // Yellow
  "#8b5cf6", // Purple
  "#f97316", // Orange
  "#ec4899", // Pink
];

// Select a random color once when the module loads
const selectedColor = colors[Math.floor(Math.random() * colors.length)];

export const FollowerPointerCard = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Add global mouse event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Hide cursor when mouse leaves the window
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* Custom cursor that follows mouse globally */}
      <AnimatePresence>
        {isVisible && (
          <FollowPointer
            x={mousePosition.x}
            y={mousePosition.y}
            title={title}
          />
        )}
      </AnimatePresence>

      {/* Regular content - no event interference */}
      <div className={className}>{children}</div>
    </>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
}: {
  x: number;
  y: number;
  title?: string | React.ReactNode;
}) => {
  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none h-4 w-4 rounded-full"
      style={{
        left: x,
        top: y,
      }}
      initial={{
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.5,
      }}
    >
      {/* Original Arrow Design */}
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-sky-600 text-sky-500"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
      </svg>

      {/* Original Tooltip Design */}
      <motion.div
        style={{
          backgroundColor: selectedColor,
        }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="min-w-max rounded-full bg-neutral-200 px-2 py-2 text-xs whitespace-nowrap text-white"
      >
        {title || "Welcome to my portfolio!"}
      </motion.div>
    </motion.div>
  );
};
