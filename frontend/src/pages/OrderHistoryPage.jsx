import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrderHistory } from '../hooks/useOrders'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

const STATUS_LABELS = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
}

export default function OrderHistoryPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useOrderHistory(page)

  if (isLoading) return <LoadingSpinner label="Chargement de tes commandes…" />
  if (isError) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorBanner message="Impossible de charger tes commandes." /></div>

  const orders = data?.content || []

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl">Mes commandes</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-ink-soft">Aucune commande pour l'instant.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/confirmation/${order.id}`}
              className="flex items-center justify-between rounded-lg border border-surface-sunken bg-surface p-4 transition hover:border-brand-300"
            >
              <div>
                <span className="font-mono text-sm text-ink">#{order.id}</span>
                <span className="ml-3 text-xs text-ink-soft">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-ink-soft">{STATUS_LABELS[order.status] || order.status}</span>
                <span className="tabular-price text-sm font-medium">{formatCurrency(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} />
    </div>
  )
}
