import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-surface-sunken bg-surface transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="aspect-square overflow-hidden bg-surface-sunken">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft">
            <span className="text-xs">Pas d'image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs uppercase tracking-wide text-ink-soft">{product.brand}</span>
        <h3 className="font-display text-sm font-medium leading-snug text-ink">{product.name}</h3>
        <span className="mt-auto pt-2 text-xs text-brand-600">Voir les grades disponibles →</span>
      </div>
    </Link>
  )
}
