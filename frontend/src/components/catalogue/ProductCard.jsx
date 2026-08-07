import { Link } from 'react-router-dom'
import PriceTag from '../common/PriceTag'

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

        {/* minPrice n'est renseigné que par l'endpoint /products/search
            (Boutique) — sur la home (Hero/rails), le champ est absent et on
            garde l'ancien texte d'appel à l'action. */}
        {product.minPrice != null ? (
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xs text-ink-soft">Dès</span>
            <PriceTag price={product.minPrice} size="sm" />
          </div>
        ) : (
          <span className="mt-2 text-xs text-ink-soft transition group-hover:text-brand-600">
            Voir les grades disponibles →
          </span>
        )}
      </div>
    </Link>
  )
}
