import { CalendarRange } from 'lucide-react'

export default function DateRangePicker({ from, to, onChange }) {
  const inputClass =
    'rounded-md border border-line bg-surface px-2 py-1.5 font-mono text-xs text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100'

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface-muted px-3.5 py-2 text-sm">
      <CalendarRange size={14} className="text-ink-soft" />
      <label className="flex items-center gap-2 text-ink-soft">
        Du
        <input type="date" value={from} onChange={(e) => onChange({ from: e.target.value, to })} className={inputClass} />
      </label>
      <span className="text-ink-soft/40">—</span>
      <label className="flex items-center gap-2 text-ink-soft">
        Au
        <input type="date" value={to} onChange={(e) => onChange({ from, to: e.target.value })} className={inputClass} />
      </label>
    </div>
  )
}
