export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-ink-2 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-paper-2 font-mono">
      {children}
    </span>
  );
}
