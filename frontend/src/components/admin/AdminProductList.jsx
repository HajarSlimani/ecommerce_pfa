import { Plus } from 'lucide-react'

export default function AdminProductList({ products, selectedId, onSelect, onNew }) {
  return (
    <div className="w-64 shrink-0 border-r border-line">
      <button
        onClick={onNew}
        className={`flex w-full items-center gap-2 border-b border-line px-4 py-3 text-left text-sm font-medium transition hover:bg-surface-muted ${
          selectedId === null ? 'bg-surface-muted text-ink' : 'text-ink-soft'
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
            className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition hover:bg-surface-muted ${
              selectedId === p.id ? 'bg-surface-muted' : ''
            }`}
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden border border-line bg-surface-muted">
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
