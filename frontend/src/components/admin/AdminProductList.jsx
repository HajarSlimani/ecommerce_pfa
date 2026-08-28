import { Plus } from 'lucide-react'

export default function AdminProductList({ products, selectedId, onSelect, onNew }) {
  return (
    <div className="w-64 shrink-0 overflow-hidden rounded-lg border border-line bg-surface shadow-admin-sm">
      <button
        onClick={onNew}
        className={`flex w-full items-center gap-2 border-b border-line px-4 py-3 text-left text-sm font-medium transition hover:bg-surface-muted ${
          selectedId === null ? 'bg-brand-50 text-brand-600' : 'text-ink-soft'
        }`}
      >
        <Plus size={15} />
        Nouveau produit
      </button>

      <div className="max-h-[70vh] overflow-y-auto">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`relative flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition hover:bg-surface-muted ${
              selectedId === p.id ? 'bg-surface-muted' : ''
            }`}
          >
            <span
              className={`absolute left-0 top-0 h-full w-0.5 bg-brand-500 transition-opacity ${
                selectedId === p.id ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-line bg-surface-muted">
              {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">{p.name}</p>
              <p className="truncate text-xs text-ink-soft">{p.brand}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
