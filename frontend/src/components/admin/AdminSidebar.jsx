import { NavLink, Link } from 'react-router-dom'
import {
  ArrowLeft,
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  History,
  Users,
  Settings,
} from 'lucide-react'

// Groupé par intention plutôt qu'en liste plate : ça donne un sens de
// navigation ("où suis-je dans l'admin ?") au lieu d'une pile de 7 liens
// indifférenciés — même bénéfice que les eyebrows ailleurs sur le site.
const GROUPS = [
  {
    label: 'Vue d\u2019ensemble',
    links: [{ to: '/admin', label: 'Dashboard', end: true, icon: LayoutDashboard }],
  },
  {
    label: 'Gestion',
    links: [
      { to: '/admin/products', label: 'Produits', icon: Package },
      { to: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
      { to: '/admin/users', label: 'Utilisateurs', icon: Users },
    ],
  },
  {
    label: 'Pricing',
    links: [
      { to: '/admin/pricing-dynamique', label: 'Pricing Dynamique', icon: TrendingUp },
      { to: '/admin/pricing', label: 'Historique des Prix', icon: History },
    ],
  },
  {
    label: 'Système',
    links: [{ to: '/admin/settings', label: 'Paramètres', icon: Settings }],
  },
]

export default function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-56 flex-col border-r border-line bg-surface px-4 py-8">
      <Link to="/" className="px-2 font-display text-lg font-medium text-ink">
        NewDev <span className="italic text-brand-500">Shop</span>
      </Link>
      <p className="eyebrow mt-1 px-2">Administration</p>

      <nav className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft/70">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.links.map(({ to, label, end, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-soft hover:bg-surface-muted hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute -left-4 h-4 w-0.5 rounded-full bg-brand-500 transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <Icon size={15} strokeWidth={1.8} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <Link
        to="/"
        className="group flex items-center gap-1.5 border-t border-line pt-4 text-xs text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
        Retour à la boutique
      </Link>
    </aside>
  )
}
