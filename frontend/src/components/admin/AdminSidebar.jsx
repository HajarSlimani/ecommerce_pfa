import { NavLink, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Produits' },
  { to: '/admin/orders', label: 'Commandes' },
  { to: '/admin/pricing-dynamique', label: 'Pricing Dynamique' },
  { to: '/admin/pricing', label: 'Historique des Prix' },
  { to: '/admin/users', label: 'Utilisateurs' },
  { to: '/admin/settings', label: 'Paramètres' },
]

export default function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-56 flex-col border-r border-line bg-surface px-5 py-8">
      <Link to="/" className="font-display text-lg font-medium text-ink">
        NewDev <span className="italic text-brand-500">Shop</span>
      </Link>
      <p className="eyebrow mt-1">Administration</p>

      <nav className="mt-8 flex flex-col gap-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `px-3 py-2 text-sm transition ${
                isActive ? 'bg-surface-muted text-ink' : 'text-ink-soft hover:text-ink'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/"
        className="mt-auto flex items-center gap-1.5 pt-8 text-xs text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft size={13} />
        Retour à la boutique
      </Link>
    </aside>
  )
}
