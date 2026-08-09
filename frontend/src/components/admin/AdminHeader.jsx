import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/admin/products?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface px-6">
      <form onSubmit={handleSearch} className="flex items-center gap-2 text-ink-soft">
        <Search size={16} strokeWidth={1.6} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit…"
          className="w-64 bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
        />
      </form>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 text-sm text-ink"
          aria-expanded={menuOpen}
        >
          <span className="flex h-7 w-7 items-center justify-center border border-line text-ink-soft">
            <User size={14} strokeWidth={1.6} />
          </span>
          <span className="hidden sm:inline">{user?.email}</span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 border border-line bg-white py-2 shadow-sm">
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
