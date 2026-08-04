import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Vue d\u2019ensemble', end: true },
  { to: '/admin/products', label: 'Produits & stock' },
  { to: '/admin/pricing', label: 'Historique pricing' },
]

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-surface-sunken bg-ink px-4 py-8">
      <div className="mb-8 px-2 font-display text-sm font-semibold text-white/90">
        Panneau admin
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm transition ${
                isActive ? 'bg-brand-600 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
