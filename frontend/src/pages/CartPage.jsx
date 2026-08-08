import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import CartItemRow from '../components/cart/CartItemRow'
import CartSummary from '../components/cart/CartSummary'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

export default function CartPage() {
  const { cart, isLoading, isError, removeItem, updateItem } = useCart()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <LoadingSpinner label="Chargement du panier…" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <ErrorBanner message="Impossible de charger le panier." />
      </div>
    )
  }

  const isEmpty = !cart?.items?.length

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity < 1) return
    updateItem({ itemId, quantity })
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="eyebrow mb-3">Panier</p>
      <h1 className="font-display text-4xl font-medium text-ink">Mon panier</h1>

      {isEmpty ? (
        <div className="mt-14 flex flex-col items-center border border-line py-20 text-center">
          <ShoppingBag size={28} strokeWidth={1.4} className="text-ink-soft" />
          <p className="mt-4 text-sm text-ink-soft">Ton panier est vide.</p>
          <Link
            to="/boutique"
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Parcourir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
            <Link to="/boutique" className="mt-6 inline-block text-sm text-ink-soft transition hover:text-ink">
              ← Continuer mes achats
            </Link>
          </div>
          <div>
            <CartSummary total={cart.total} disabled={isEmpty} />
          </div>
        </div>
      )}
    </div>
  )
}
