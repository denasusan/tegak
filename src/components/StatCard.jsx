export function StatCard({ label, value, hint, tone = "primary" }) {
  const tones = {
    primary: "text-primary-700",
    accent: "text-accent-600",
    ink: "text-ink-800",
  };
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tones[tone]}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}
