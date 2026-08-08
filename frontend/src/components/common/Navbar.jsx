import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, User, ShoppingBag, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

export const NAVBAR_HEIGHT = 'h-20'

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Sur la page d'accueil, le hero plein écran est sombre : la navbar démarre
  // transparente avec du texte clair, puis bascule en verre dépoli au scroll.
  // Sur les autres pages (fond clair dès le haut), elle est toujours en mode
  // "verre" pour rester lisible.
  const overHero = location.pathname === '/' && !isScrolled

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setSearchOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  // Menu du compte ouvert/fermé au clic plutôt qu'au survol : un menu en
  // hover avec un espace entre le déclencheur et le menu se ferme dès que
  // le curseur traverse cet espace, rendant les liens inatteignables.
  useEffect(() => {
    if (!menuOpen) return
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/boutique?q=${encodeURIComponent(searchValue.trim())}`)
    }
    setSearchOpen(false)
  }

  const textClass = overHero ? 'text-white' : 'text-ink'
  const softTextClass = overHero ? 'text-white/75' : 'text-ink-soft'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 ${NAVBAR_HEIGHT} transition-colors duration-300 ${
        overHero
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-line bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto grid h-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <Link
          to="/"
          className={`font-display text-xl font-medium tracking-tight ${textClass}`}
        >
          NewDev <span className="italic text-brand-500">Shop</span>
        </Link>

        <nav className={`hidden items-center gap-8 text-sm font-medium sm:flex ${softTextClass}`}>
          <Link to="/" className={`transition hover:${overHero ? 'text-white' : 'text-ink'}`}>
            Accueil
          </Link>
          <Link to="/boutique" className="transition hover:text-inherit">
            Boutique
          </Link>
          <Link to="/#categories" className="transition hover:text-inherit">
            Catégories
          </Link>
        </nav>

        <div className={`flex items-center justify-end gap-5 ${textClass}`}>
          <div className="relative flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-40 border-b border-current bg-transparent py-1 text-sm placeholder:text-current/50 focus:outline-none sm:w-52"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Fermer la recherche"
                  className="ml-2"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} aria-label="Rechercher">
                <Search size={19} strokeWidth={1.6} />
              </button>
            )}
          </div>

          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} aria-label="Mon compte" aria-expanded={menuOpen}>
                <User size={19} strokeWidth={1.6} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-44 border border-line bg-white py-2 shadow-sm">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted">
                    Mon profil
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted">
                    Mes commandes
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted">
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div ref={menuRef} className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} aria-label="Compte" aria-expanded={menuOpen}>
                <User size={19} strokeWidth={1.6} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-44 border border-line bg-white py-2 shadow-sm">
                  <Link to="/login" className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted">
                    Se connecter
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted">
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>
          )}

          <Link to="/cart" className="relative" aria-label="Panier">
            <ShoppingBag size={19} strokeWidth={1.6} />
            {itemCount > 0 && (
              <span
                className={`absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-mono ${
                  overHero ? 'bg-white text-ink' : 'bg-ink text-white'
                }`}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
