import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck, RotateCcw, Truck } from 'lucide-react'
import PriceTag from '../common/PriceTag'
import { useCheckout } from '../../hooks/useOrders'
import { useAuth } from '../../hooks/useAuth'

const TRUST_ROW = [
  { icon: ShieldCheck, label: 'Garantie 12 mois' },
  { icon: RotateCcw, label: 'Retour sous 30 jours' },
  { icon: Truck, label: 'Livraison suivie' },
]

export default function CartSummary({ total, disabled }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const checkout = useCheckout()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Le panier est conservé (fusionné automatiquement après connexion) :
      // on redirige juste vers la connexion pour finaliser la commande.
      toast('Connecte-toi pour valider ta commande — ton panier est conservé')
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    checkout.mutate(undefined, {
      onSuccess: (order) => {
        toast.success('Commande enregistrée')
        navigate(`/orders/confirmation/${order.id}`)
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Échec de la commande')
      },
    })
  }

  return (
    <div className="flex flex-col gap-6 border border-line p-6">
      <div>
        <p className="eyebrow mb-4">Récapitulatif</p>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm text-ink-soft">Total</span>
          <PriceTag price={total} size="lg" />
        </div>
        <p className="mt-1.5 text-xs text-ink-soft">Frais de livraison calculés à l’étape suivante.</p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={disabled || checkout.isPending}
        className="rounded-full bg-ink py-3.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
      >
        {checkout.isPending
          ? 'Validation…'
          : isAuthenticated
            ? 'Valider la commande'
            : 'Se connecter pour valider'}
      </button>

      <div className="flex flex-col gap-3 border-t border-line pt-5">
        {TRUST_ROW.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-xs text-ink-soft">
            <Icon size={15} strokeWidth={1.6} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
