import { useState } from 'react'
import { usePricingImpact, usePricingHistory } from '../../hooks/usePricing'
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Administration</p>
          <h1 className="font-display text-3xl font-medium text-ink">Pricing Dynamique</h1>
        </div>
        <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
      </div>

      {impactLoading ? (
        <LoadingSpinner label="Calcul de l'impact revenu…" />
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Ajustements sur la période" value={impact?.totalAdjustments ?? 0} />
          <KpiCard
            label="Impact revenu estimé (cumulé)"
            value={formatCurrency(impact?.totalEstimatedRevenueImpact ?? 0)}
            accent={(impact?.totalEstimatedRevenueImpact ?? 0) >= 0 ? 'down' : 'up'}
          />
          <KpiCard
            label="Impact moyen / ajustement"
            value={formatCurrency(impact?.averageImpactPerAdjustment ?? 0)}
          />
        </div>
      )}

      {historyLoading ? (
        <LoadingSpinner label="Chargement de la tendance…" />
      ) : (
        <RevenueImpactChart historyEntries={history?.content} />
      )}
    </div>
  )
}
