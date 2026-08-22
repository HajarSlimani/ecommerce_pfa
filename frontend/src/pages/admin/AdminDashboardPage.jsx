import {
  useAdminStats,
  useLowStock,
  useTopProducts,
  useSalesByCategory,
  useRecentOrders,
  useRecentUsers,
} from '../../hooks/useAdmin'
import { formatCurrency } from '../../utils/formatCurrency'
import KpiCard from '../../components/admin/KpiCard'
import OrderStatusBreakdown from '../../components/admin/OrderStatusBreakdown'
import LowStockAlert from '../../components/admin/LowStockAlert'
import TopProductsTable from '../../components/admin/TopProductsTable'
import SalesByCategory from '../../components/admin/SalesByCategory'
import RecentOrders from '../../components/admin/RecentOrders'
import RecentUsers from '../../components/admin/RecentUsers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStats()
  const { data: lowStock } = useLowStock(3)
  const { data: topProducts } = useTopProducts(5)
  const { data: categorySales } = useSalesByCategory()
  const { data: recentOrders } = useRecentOrders(5)
  const { data: recentUsers } = useRecentUsers(5)

  return (
    <div>
      <p className="eyebrow mb-3">Administration</p>
      <h1 className="font-display text-3xl font-medium text-ink">Dashboard</h1>

      {isLoading && <div className="mt-8"><LoadingSpinner label="Chargement…" /></div>}
      {isError && <div className="mt-8"><ErrorBanner message="Impossible de charger les statistiques." /></div>}

      {stats && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard label="Produits" value={stats.totalProducts} />
            <KpiCard label="Revenu total" value={formatCurrency(stats.totalRevenue)} trend={stats.revenueTrendPct} />
            <KpiCard label="Commandes" value={stats.totalOrders} trend={stats.ordersTrendPct} />
            <KpiCard
              label="Commandes en attente"
              value={stats.pendingOrders}
              accent={stats.pendingOrders > 0 ? 'up' : 'ink'}
            />
            <KpiCard label="Utilisateurs" value={stats.totalUsers} trend={stats.usersTrendPct} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <OrderStatusBreakdown counts={stats.ordersByStatus} />
            {lowStock && <LowStockAlert products={lowStock} />}
            {recentUsers && <RecentUsers users={recentUsers.content} />}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {topProducts && <TopProductsTable products={topProducts} />}
            {categorySales && <SalesByCategory data={categorySales} />}
          </div>

          <div className="mt-4">
            {recentOrders && <RecentOrders orders={recentOrders.content} />}
          </div>
        </>
      )}
    </div>
  )
}
