import { Link, useParams } from 'react-router-dom'
import { useOrder } from '../hooks/useOrders'
import { formatCurrency } from '../utils/formatCurrency'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useOrder(Number(id))

  if (isLoading) return <LoadingSpinner label="Chargement de la commande…" />
  if (isError || !order) return <div className="mx-auto max-w-2xl px-4 py-10"><ErrorBanner message="Commande introuvable." /></div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-xl border border-brand-300 bg-brand-50 p-6">
        <h1 className="text-xl text-brand-700">Commande confirmée</h1>
        <p className="mt-1 font-mono text-sm text-ink-soft">Commande #{order.id}</p>
      </div>

      <div className="mt-6 divide-y divide-surface-sunken rounded-xl border border-surface-sunken">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-ink">{item.productName}</span>
            <span className="tabular-price text-sm">{formatCurrency(item.priceAtPurchase)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-4 font-medium">
          <span>Total</span>
          <span className="tabular-price">{formatCurrency(order.total)}</span>
        </div>
      </div>

      <Link to="/" className="mt-6 inline-block text-sm text-brand-600 hover:underline">
        ← Retour au catalogue
      </Link>
    </div>
  )
}
