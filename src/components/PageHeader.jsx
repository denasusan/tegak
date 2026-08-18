export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-ink-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-ink-700">{title}</p>
      {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
    </div>
  );
}
