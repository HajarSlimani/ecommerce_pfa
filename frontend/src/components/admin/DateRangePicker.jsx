export default function DateRangePicker({ from, to, onChange }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <label className="flex items-center gap-2 text-ink-soft">
        Du
        <input
          type="date"
          value={from}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className="rounded-md border border-surface-sunken px-2 py-1 font-mono text-xs"
        />
      </label>
      <label className="flex items-center gap-2 text-ink-soft">
        Au
        <input
          type="date"
          value={to}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className="rounded-md border border-surface-sunken px-2 py-1 font-mono text-xs"
        />
      </label>
    </div>
  )
}
