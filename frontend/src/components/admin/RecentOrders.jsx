import { Link } from 'react-router-dom'
import PriceTag from '../common/PriceTag'
import StatusBadge from './StatusBadge'

export default function RecentOrders({ orders }) {
  return (
    <div className="border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Commandes récentes</p>
        <Link to="/admin/orders" className="text-xs text-ink-soft transition hover:text-ink">
          Voir tout →
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Aucune commande pour l’instant.</p>
      ) : (
        <div className="mt-3 flex flex-col">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5 text-sm transition hover:bg-surface-muted"
            >
              <div className="min-w-0">
                <span className="font-mono text-ink">#{order.id}</span>
                <span className="ml-2 truncate text-xs text-ink-soft">{order.userEmail}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={order.status} />
                <PriceTag price={order.total} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
