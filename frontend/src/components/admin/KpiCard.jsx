export default function KpiCard({ label, value, accent = 'ink' }) {
  const accentClasses = {
    ink: 'text-ink',
    up: 'text-deal-up',
    down: 'text-deal-down',
  }

  return (
    <div className="rounded-xl border border-surface-sunken bg-surface p-5">
      <div className="text-xs uppercase tracking-wide text-ink-soft">{label}</div>
      <div className={`tabular-price mt-2 text-2xl font-semibold ${accentClasses[accent]}`}>{value}</div>
    </div>
  )
}
