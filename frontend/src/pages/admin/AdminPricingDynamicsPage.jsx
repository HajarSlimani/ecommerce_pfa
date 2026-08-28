import { useState } from 'react'
import { TrendingUp, Sparkles, Wallet, Calculator } from 'lucide-react'
import { usePricingImpact, usePricingHistory } from '../../hooks/usePricing'
import PageHeader from '../../components/admin/PageHeader'
import KpiCard from '../../components/admin/KpiCard'
import DateRangePicker from '../../components/admin/DateRangePicker'
import RevenueImpactChart from '../../components/admin/RevenueImpactChart'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency } from '../../utils/formatCurrency'

function isoDaysAgo(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export default function AdminPricingDynamicsPage() {
  const [range, setRange] = useState({ from: isoDaysAgo(30), to: isoDaysAgo(0) })

  const from = `${range.from}T00:00:00Z`
  const to = `${range.to}T23:59:59Z`

  const { data: impact, isLoading: impactLoading } = usePricingImpact(from, to)
  const { data: history, isLoading: historyLoading } = usePricingHistory({ size: 200 })

  return (
    <div>
      <PageHeader
        icon={TrendingUp}
        title="Pricing Dynamique"
        description="Impact du moteur de tarification ML sur la période sélectionnée."
        actions={<DateRangePicker from={range.from} to={range.to} onChange={setRange} />}
      />

      {impactLoading ? (
        <div className="mt-8"><LoadingSpinner label="Calcul de l'impact revenu…" /></div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard icon={Sparkles} label="Ajustements sur la période" value={impact?.totalAdjustments ?? 0} />
          <KpiCard
            icon={Wallet}
            label="Impact revenu estimé (cumulé)"
            value={formatCurrency(impact?.totalEstimatedRevenueImpact ?? 0)}
            accent={(impact?.totalEstimatedRevenueImpact ?? 0) >= 0 ? 'down' : 'up'}
          />
          <KpiCard
            icon={Calculator}
            label="Impact moyen / ajustement"
            value={formatCurrency(impact?.averageImpactPerAdjustment ?? 0)}
          />
        </div>
      )}

      {historyLoading ? (
        <div className="mt-8"><LoadingSpinner label="Chargement de la tendance…" /></div>
      ) : (
        <div className="mt-8">
          <RevenueImpactChart historyEntries={history?.content} />
        </div>
      )}
    </div>
  )
}
