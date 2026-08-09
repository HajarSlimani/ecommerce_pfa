import { Link } from 'react-router-dom'
import { useAdminStats } from '../../hooks/useAdmin'
import KpiCard from '../../components/admin/KpiCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStats()

  return (
    <div>
      <p className="eyebrow mb-3">Administration</p>
      <h1 className="font-display text-3xl font-medium text-ink">Dashboard</h1>

      {isLoading && <div className="mt-8"><LoadingSpinner label="Chargement…" /></div>}
      {isError && <div className="mt-8"><ErrorBanner message="Impossible de charger les statistiques." /></div>}

      {stats && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Produits" value={stats.totalProducts} />
          <KpiCard label="Commandes" value={stats.totalOrders} />
          <KpiCard
            label="Commandes en attente"
            value={stats.pendingOrders}
            accent={stats.pendingOrders > 0 ? 'up' : 'ink'}
          />
          <KpiCard label="Utilisateurs" value={stats.totalUsers} />
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link to="/admin/pricing-dynamique" className="text-ink-soft underline transition hover:text-ink">
          Voir l’impact du pricing dynamique →
        </Link>
        <Link to="/admin/orders" className="text-ink-soft underline transition hover:text-ink">
          Gérer les commandes →
        </Link>
      </div>
    </div>
  )
}
