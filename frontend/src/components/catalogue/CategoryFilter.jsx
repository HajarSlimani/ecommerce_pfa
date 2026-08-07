import { CATEGORIES } from '../../constants/catalogue'

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition ${
          value === ''
            ? 'border-ink bg-ink text-white'
            : 'border-line text-ink-soft hover:border-ink-soft hover:text-ink'
        }`}
      >
        Tous
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition ${
            value === cat.id
              ? 'border-ink bg-ink text-white'
              : 'border-line text-ink-soft hover:border-ink-soft hover:text-ink'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
