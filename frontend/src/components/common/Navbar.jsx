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
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-medium tracking-tight text-ink">
          NewDev <span className="italic text-brand-500">Shop</span>
        </Link>

        <nav className="flex items-center gap-7 text-sm text-ink-soft">
          <Link to="/" className="transition hover:text-ink">Catalogue</Link>

          {isAdmin && (
            <Link to="/admin" className="transition hover:text-ink">Administration</Link>
          )}

          {isAuthenticated && (
            <Link to="/orders" className="transition hover:text-ink">Mes commandes</Link>
          )}

          <Link to="/cart" className="relative transition hover:text-ink">
            Panier
            {itemCount > 0 && (
              <span className="absolute -right-3.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-mono text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-line pl-5">
              <span className="text-xs text-ink-soft">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-ink transition hover:text-brand-600"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border-l border-line pl-5 text-xs font-medium text-ink transition hover:text-brand-600"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
