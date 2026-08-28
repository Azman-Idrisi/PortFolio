export function Meta({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-baseline gap-3 text-[12px] font-mono ${className}`}
    >
      <span className="uppercase tracking-[0.14em] text-paper-2 min-w-[80px]">
        {label}
      </span>
      <span className="text-paper">{value}</span>
    </div>
  );
}
