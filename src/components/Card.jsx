export function Card({ children, className = "" }) {
  return (
    <div className={`min-w-0 rounded-2xl border border-ink-100 bg-white p-5 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
