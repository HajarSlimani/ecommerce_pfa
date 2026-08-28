import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import AdminAvatar from './AdminAvatar'

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
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface/80 px-6 backdrop-blur-sm">
      <form
        onSubmit={handleSearch}
        className="flex w-72 items-center gap-2 rounded-full border border-line bg-surface-muted px-3.5 py-2 text-ink-soft transition focus-within:border-brand-300 focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand-100"
      >
        <Search size={15} strokeWidth={1.8} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
        />
      </form>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 text-sm text-ink transition hover:bg-surface-muted"
          aria-expanded={menuOpen}
        >
          <AdminAvatar email={user?.email} fullName={user?.fullName} />
          <span className="hidden sm:inline">{user?.email}</span>
          <ChevronDown size={14} className={`text-ink-soft transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-line bg-white py-1.5 shadow-admin-md">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink transition hover:bg-surface-muted"
            >
              <LogOut size={14} strokeWidth={1.8} />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
