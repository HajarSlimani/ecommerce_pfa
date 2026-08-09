import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useAdmin'
import { formatDate } from '../../utils/formatDate'
import PriceTag from '../../components/common/PriceTag'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'
import OrderStatusSelect from '../../components/admin/OrderStatusSelect'

export default function AdminOrdersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useAdminOrders(page)
  const updateStatus = useUpdateOrderStatus()

  const handleStatusChange = (orderId, status) => {
    updateStatus.mutate(
      { orderId, status },
      {
        onError: (err) => toast.error(err.response?.data?.message || 'Transition invalide'),
      }
    )
  }

  return (
    <div>
      <p className="eyebrow mb-3">Administration</p>
      <h1 className="font-display text-3xl font-medium text-ink">Commandes</h1>

      {isLoading && <LoadingSpinner label="Chargement des commandes…" />}
      {isError && <ErrorBanner message="Impossible de charger les commandes." />}

      {data && (
        <div className="mt-8 border border-line bg-surface">
          <div className="grid grid-cols-[80px_1fr_120px_100px_110px_140px] gap-4 border-b border-line px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <span>Commande</span>
            <span>Client</span>
            <span>Articles</span>
            <span>Total</span>
            <span>Date</span>
            <span>Statut</span>
          </div>

          {data.content.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[80px_1fr_120px_100px_110px_140px] items-center gap-4 border-b border-line px-4 py-3 text-sm last:border-b-0"
            >
              <span className="font-mono text-ink">#{order.id}</span>
              <span className="truncate text-ink-soft">{order.userEmail}</span>
              <span className="text-ink-soft">{order.itemCount}</span>
              <PriceTag price={order.total} size="sm" />
              <span className="text-xs text-ink-soft">{formatDate(order.createdAt)}</span>
              <OrderStatusSelect
                status={order.status}
                disabled={updateStatus.isPending}
                onChange={(status) => handleStatusChange(order.id, status)}
              />
            </div>
          ))}

          {data.content.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-ink-soft">Aucune commande pour l’instant.</p>
          )}
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  )
}
