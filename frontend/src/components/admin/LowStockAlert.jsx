import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function LowStockAlert({ products }) {
  return (
    <div className="border border-line bg-surface p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle size={14} className="text-deal-up" />
        <p className="eyebrow">Stock faible</p>
      </div>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Tous les produits ont un stock suffisant.</p>
      ) : (
        <div className="mt-4 flex flex-col">
          {products.map((p) => (
            <Link
              key={p.productId}
              to={`/admin/products?q=${encodeURIComponent(p.productName)}`}
              className="flex items-center justify-between border-b border-line py-2.5 text-sm last:border-b-0 hover:text-brand-600"
            >
              <span className="truncate text-ink">{p.productName}</span>
              <span className="font-mono text-xs text-deal-up">
                {p.availableUnits} unité{p.availableUnits > 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
