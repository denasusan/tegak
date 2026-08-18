export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function PrioritasBadge({ prioritas }) {
  const warna =
    prioritas === "Tinggi"
      ? "bg-accent-100 text-accent-800"
      : "bg-ink-100 text-ink-700";
  return <Badge className={warna}>Prioritas {prioritas}</Badge>;
}
