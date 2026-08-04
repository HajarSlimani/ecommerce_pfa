import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PriceTag from '../common/PriceTag'
import { useCheckout } from '../../hooks/useOrders'

export default function CartSummary({ total, disabled }) {
  const navigate = useNavigate()
  const checkout = useCheckout()

  const handleCheckout = () => {
    checkout.mutate(undefined, {
      onSuccess: (order) => {
        toast.success('Commande confirmée')
        navigate(`/orders/confirmation/${order.id}`)
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Échec de la commande')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-sunken bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-soft">Total</span>
        <PriceTag price={total} size="lg" />
      </div>
      <button
        onClick={handleCheckout}
        disabled={disabled || checkout.isPending}
        className="rounded-lg bg-ink py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
      >
        {checkout.isPending ? 'Validation…' : 'Valider la commande'}
      </button>
    </div>
  )
}
