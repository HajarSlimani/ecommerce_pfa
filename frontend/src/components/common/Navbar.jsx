import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-surface-sunken bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-lg font-semibold text-ink">
          ecommerce<span className="text-brand-500">.pfa</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-ink-soft">
          <Link to="/" className="hover:text-brand-600">Catalogue</Link>

          {isAdmin && (
            <Link to="/admin" className="hover:text-brand-600">Administration</Link>
          )}

          {isAuthenticated && (
            <Link to="/orders" className="hover:text-brand-600">Mes commandes</Link>
          )}

          <Link to="/cart" className="relative hover:text-brand-600">
            Panier
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-mono text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-soft">{user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-surface-sunken px-3 py-1.5 text-xs font-medium hover:bg-surface-muted"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
