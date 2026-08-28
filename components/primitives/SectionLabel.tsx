import { ReactNode } from "react";

export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-paper-2 font-mono ${className}`}
    >
      <span className="text-accent">{index}</span>
      <span className="h-px w-8 bg-line" />
      <span>{children}</span>
    </div>
  );
}
