import { Link } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import PriceTag from '../common/PriceTag'

export default function CartItemRow({ item, onRemove, onUpdateQuantity }) {
  const atMax = item.quantity >= item.availableStock

  return (
    <div className="flex gap-4 border-b border-line py-6 first:pt-0">
      <Link to={`/products/${item.productId}`} className="h-24 w-24 shrink-0 overflow-hidden border border-line bg-surface-muted">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft">
            <span className="text-[10px]">Pas d’image</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to={`/products/${item.productId}`} className="font-display text-base text-ink hover:text-brand-600">
              {item.productName}
            </Link>
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-soft">
              {item.grade} · {item.color}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            aria-label="Retirer du panier"
            className="text-ink-soft transition hover:text-deal-up"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center border border-line">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Diminuer la quantité"
              className="p-2 text-ink-soft transition hover:text-ink disabled:opacity-30"
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center font-mono text-xs text-ink">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={atMax}
              aria-label="Augmenter la quantité"
              title={atMax ? 'Stock maximum atteint' : undefined}
              className="p-2 text-ink-soft transition hover:text-ink disabled:opacity-30"
            >
              <Plus size={13} />
            </button>
          </div>

          <PriceTag price={item.subtotal} size="sm" />
        </div>
      </div>
    </div>
  )
}
