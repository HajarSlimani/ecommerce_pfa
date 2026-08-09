import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

/**
 * Construit une série cumulée à partir des entrées PriceHistory brutes
 * (triées du plus ancien au plus récent). Le scénario "statique" est la
 * ligne de référence à 0 (= revenu si aucun ajustement de prix n'avait eu
 * lieu) ; le scénario "dynamique" cumule l'impact estimé par le moteur ML
 * à chaque décision. Voir la note méthodologique dans PricingDashboardService
 * côté backend : c'est une projection au moment de la décision, pas un
 * calcul a posteriori sur les ventes réelles.
 */
function buildCumulativeSeries(historyEntries) {
  const sorted = [...(historyEntries || [])].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  )

  let cumulative = 0
  return sorted.map((entry) => {
    cumulative += entry.estimatedRevenueImpact || 0
    return {
      date: entry.createdAt,
      dynamique: Number(cumulative.toFixed(2)),
    }
  })
}

export default function RevenueImpactChart({ historyEntries }) {
  const data = buildCumulativeSeries(historyEntries)

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center border border-line bg-surface text-sm text-ink-soft">
        Pas encore assez d’ajustements pour tracer une tendance.
      </div>
    )
  }

  return (
    <div className="border border-line bg-surface p-5">
      <h3 className="mb-1 font-display text-base font-medium text-ink">Impact revenu cumulé — dynamique vs statique</h3>
      <p className="mb-4 text-xs text-ink-soft">
        Le scénario statique correspond à une absence d’ajustement de prix (référence à 0).
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DB" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => formatDate(d).split(' ').slice(0, 2).join(' ')}
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
            width={90}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(d) => formatDate(d)}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#6E6E6B" strokeDasharray="4 4" label="Statique" />
          <Line
            type="monotone"
            dataKey="dynamique"
            name="Dynamique (cumulé)"
            stroke="#1D4ED8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
