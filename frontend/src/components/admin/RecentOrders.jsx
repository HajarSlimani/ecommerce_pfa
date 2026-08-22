import { Link } from 'react-router-dom'
import { ORDER_STATUS } from '../../constants/orderStatus'
import { formatDate } from '../../utils/formatDate'
import PriceTag from '../common/PriceTag'

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
        <div className="mt-4 flex flex-col">
          {orders.map((order) => {
            const status = ORDER_STATUS[order.status] || { label: order.status, className: 'text-ink-soft' }
            return (
              <div key={order.id} className="flex items-center justify-between border-b border-line py-2.5 text-sm last:border-b-0">
                <div>
                  <span className="font-mono text-ink">#{order.id}</span>
                  <span className="ml-2 truncate text-xs text-ink-soft">{order.userEmail}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium uppercase tracking-wide ${status.className}`}>
                    {status.label}
                  </span>
                  <PriceTag price={order.total} size="sm" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
