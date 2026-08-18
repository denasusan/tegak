import Link from "next/link";

export function StatCard({ label, value, hint, tone = "primary", href }) {
  const tones = {
    primary: "text-primary-700",
    accent: "text-accent-600",
    ink: "text-ink-800",
  };

  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tones[tone]}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition hover:border-primary-300 hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">{content}</div>;
}
