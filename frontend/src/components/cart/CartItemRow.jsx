import PriceTag from '../common/PriceTag'

export default function CartItemRow({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-sunken py-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-ink">{item.productName}</span>
        <span className="font-mono text-xs text-ink-soft">
          Grade {item.grade} · quantité {item.quantity}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <PriceTag price={item.subtotal} size="sm" />
        <button
          onClick={() => onRemove(item.id)}
          className="text-xs text-ink-soft hover:text-deal-up"
          aria-label="Retirer du panier"
        >
          Retirer
        </button>
      </div>
    </div>
  )
}
