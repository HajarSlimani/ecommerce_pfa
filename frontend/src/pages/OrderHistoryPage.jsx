import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { useOrderHistory } from '../hooks/useOrders'
import { formatDate } from '../utils/formatDate'
import PriceTag from '../components/common/PriceTag'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

const STATUS = {
  PENDING: { label: 'En attente', className: 'text-ink-soft' },
  CONFIRMED: { label: 'Confirmée', className: 'text-brand-600' },
  SHIPPED: { label: 'Expédiée', className: 'text-brand-600' },
  DELIVERED: { label: 'Livrée', className: 'text-deal-down' },
  CANCELLED: { label: 'Annulée', className: 'text-deal-up' },
}

export default function OrderHistoryPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useOrderHistory(page)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <LoadingSpinner label="Chargement de tes commandes…" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <ErrorBanner message="Impossible de charger tes commandes." />
      </div>
    )
  }

  const orders = data?.content || []

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-3">Compte</p>
      <h1 className="font-display text-4xl font-medium text-ink">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="mt-14 flex flex-col items-center border border-line py-20 text-center">
          <PackageSearch size={28} strokeWidth={1.4} className="text-ink-soft" />
          <p className="mt-4 text-sm text-ink-soft">Aucune commande pour l’instant.</p>
          <Link
            to="/boutique"
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Parcourir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          {orders.map((order) => {
            const status = STATUS[order.status] || { label: order.status, className: 'text-ink-soft' }
            return (
              <Link
                key={order.id}
                to={`/orders/confirmation/${order.id}`}
                className="flex items-center justify-between gap-4 border-b border-line py-5 transition hover:bg-surface-muted"
              >
                <div>
                  <span className="font-mono text-sm text-ink">#{order.id}</span>
                  <span className="ml-3 text-xs text-ink-soft">{formatDate(order.createdAt)}</span>
                  <p className="mt-1 text-xs text-ink-soft">
                    {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-xs font-medium uppercase tracking-wide ${status.className}`}>
                    {status.label}
                  </span>
                  <PriceTag price={order.total} size="sm" />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {orders.length > 0 && (
        <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} />
      )}
    </div>
  )
}
