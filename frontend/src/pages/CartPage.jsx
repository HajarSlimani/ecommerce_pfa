import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartItemRow from '../components/cart/CartItemRow'
import CartSummary from '../components/cart/CartSummary'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

export default function CartPage() {
  const { cart, isLoading, isError, removeItem } = useCart()

  if (isLoading) return <LoadingSpinner label="Chargement du panier…" />
  if (isError) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorBanner message="Impossible de charger le panier." /></div>

  const isEmpty = !cart?.items?.length

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl">Mon panier</h1>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-surface-sunken py-16 text-center">
          <p className="text-sm text-ink-soft">Ton panier est vide.</p>
          <Link to="/" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
            Parcourir le catalogue →
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} onRemove={removeItem} />
            ))}
          </div>
          <div>
            <CartSummary total={cart.total} disabled={isEmpty} />
          </div>
        </div>
      )}
    </div>
  )
}
