import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function LowStockAlert({ products }) {
  return (
    <div className="border border-line bg-surface p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-deal-up/10 text-deal-up">
          <AlertTriangle size={11} />
        </span>
        <p className="eyebrow">Stock faible</p>
      </div>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Tous les produits ont un stock suffisant.</p>
      ) : (
        <div className="mt-3 flex flex-col">
          {products.map((p) => (
            <Link
              key={p.productId}
              to={`/admin/products?q=${encodeURIComponent(p.productName)}`}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5 text-sm transition hover:bg-surface-muted"
            >
              <span className="truncate text-ink">{p.productName}</span>
              <span className="shrink-0 rounded-full bg-deal-up/10 px-2 py-0.5 font-mono text-xs text-deal-up">
                {p.availableUnits} unité{p.availableUnits > 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
