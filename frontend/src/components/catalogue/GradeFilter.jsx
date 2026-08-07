import { GRADES } from '../../constants/catalogue'

export default function GradeFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`border px-3 py-1 font-mono text-xs uppercase tracking-wide transition ${
          value === ''
            ? 'border-ink text-ink'
            : 'border-line text-ink-soft hover:border-ink-soft hover:text-ink'
        }`}
      >
        Tous grades
      </button>
      {GRADES.map((g) => (
        <button
          key={g.code}
          onClick={() => onChange(g.code)}
          title={g.desc}
          className={`border px-3 py-1 font-mono text-xs uppercase tracking-wide transition ${
            value === g.code
              ? 'border-ink text-ink'
              : 'border-line text-ink-soft hover:border-ink-soft hover:text-ink'
          }`}
        >
          {g.code}
        </button>
      ))}
    </div>
  )
}
