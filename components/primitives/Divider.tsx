export function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-line ${className}`} />;
}
