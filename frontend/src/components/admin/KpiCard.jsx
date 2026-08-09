export default function KpiCard({ label, value, accent = 'ink' }) {
  const accentClasses = {
    ink: 'text-ink',
    up: 'text-deal-up',
    down: 'text-deal-down',
  }

  return (
    <div className="border border-line bg-surface p-5">
      <div className="eyebrow">{label}</div>
      <div className={`tabular-price mt-3 font-display text-2xl font-medium ${accentClasses[accent]}`}>{value}</div>
    </div>
  )
}
