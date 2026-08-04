const CATEGORIES = ['electronics', 'smartphones', 'laptops', 'audio']

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          value === ''
            ? 'bg-ink text-white'
            : 'bg-surface-sunken text-ink-soft hover:bg-surface-muted'
        }`}
      >
        Tous
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
            value === cat
              ? 'bg-ink text-white'
              : 'bg-surface-sunken text-ink-soft hover:bg-surface-muted'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
