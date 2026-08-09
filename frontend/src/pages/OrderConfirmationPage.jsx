import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Wallet } from 'lucide-react'
import { useOrder, useConfirmPayment } from '../hooks/useOrders'
import PriceTag from '../components/common/PriceTag'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useOrder(Number(id))
  const confirmPayment = useConfirmPayment()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <LoadingSpinner label="Chargement de la commande…" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <ErrorBanner message="Commande introuvable." />
      </div>
    )
  }

  const isPending = order.status === 'PENDING'

  const handleConfirmPayment = () => {
    confirmPayment.mutate(order.id, {
      onError: (err) => toast.error(err.response?.data?.message || 'Échec du paiement'),
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      {isPending ? (
        <Wallet size={28} strokeWidth={1.4} className="text-brand-500" />
      ) : (
        <CheckCircle2 size={28} strokeWidth={1.4} className="text-deal-down" />
      )}

      <p className="eyebrow mb-1 mt-4">{isPending ? 'Paiement' : 'Commande confirmée'}</p>
      <h1 className="font-display text-3xl font-medium text-ink">
        {isPending ? 'Finalise ton paiement' : 'Merci pour ta commande'}
      </h1>
      <p className="mt-2 font-mono text-sm text-ink-soft">#{order.id}</p>

      {isPending && (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Ta commande est enregistrée et le stock réservé. Il ne reste plus qu’à valider le
          paiement pour la confirmer.
        </p>
      )}

      <div className="mt-10 border-t border-line">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-line py-4">
            <span className="text-sm text-ink">{item.productName}</span>
            <PriceTag price={item.priceAtPurchase} size="sm" />
          </div>
        ))}
        <div className="flex items-center justify-between py-5">
          <span className="text-sm font-medium text-ink">Total</span>
          <PriceTag price={order.total} size="lg" />
        </div>
      </div>

      {isPending ? (
        <div className="mt-8">
          <button
            onClick={handleConfirmPayment}
            disabled={confirmPayment.isPending}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
          >
            {confirmPayment.isPending ? 'Paiement…' : 'Simuler le paiement'}
          </button>
          <p className="mt-3 text-xs text-ink-soft">
            Aucune passerelle de paiement réelle n’est intégrée — ce bouton simule une
            confirmation de paiement pour les besoins de la démonstration.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            to="/boutique"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Continuer mes achats
          </Link>
          <Link to="/orders" className="text-sm text-ink-soft transition hover:text-ink">
            Voir toutes mes commandes
          </Link>
        </div>
      )}
    </div>
  )
}
