import PriceTag from '../common/PriceTag'
import { formatDate } from '../../utils/formatDate'
import { formatCurrency } from '../../utils/formatCurrency'

export default function PriceHistoryTable({ entries }) {
  if (!entries?.length) {
    return <p className="py-8 text-center text-sm text-ink-soft">Aucun ajustement de prix pour l’instant.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-sunken bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-sunken text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="px-4 py-3">Produit</th>
            <th className="px-4 py-3">Grade</th>
            <th className="px-4 py-3">Ancien prix</th>
            <th className="px-4 py-3">Nouveau prix</th>
            <th className="px-4 py-3">Impact estimé</th>
            <th className="px-4 py-3">Raison</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-surface-sunken last:border-0">
              <td className="px-4 py-3 font-medium text-ink">{e.productName || `#${e.productId}`}</td>
              <td className="px-4 py-3 font-mono text-xs">{e.grade}</td>
              <td className="px-4 py-3 tabular-price text-ink-soft">{formatCurrency(e.oldPrice)}</td>
              <td className="px-4 py-3">
                <PriceTag price={e.newPrice} oldPrice={e.oldPrice} size="sm" />
              </td>
              <td
                className={`px-4 py-3 tabular-price ${
                  (e.estimatedRevenueImpact ?? 0) >= 0 ? 'text-deal-down' : 'text-deal-up'
                }`}
              >
                {e.estimatedRevenueImpact != null ? formatCurrency(e.estimatedRevenueImpact) : '—'}
              </td>
              <td className="max-w-xs px-4 py-3 text-xs text-ink-soft">{e.reasoning || '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-ink-soft">
                {formatDate(e.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
