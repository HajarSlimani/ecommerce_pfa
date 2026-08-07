import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="group flex flex-col">
      <div className="aspect-square overflow-hidden border-b border-line bg-surface-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft">
            <span className="text-xs">Pas d’image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-4">
        <span className="eyebrow">{product.brand}</span>
        <h3 className="font-display text-base font-normal leading-snug text-ink">{product.name}</h3>
        <span className="mt-2 text-xs text-ink-soft transition group-hover:text-brand-600">
          Voir les grades disponibles →
        </span>
      </div>
    </Link>
  )
}
