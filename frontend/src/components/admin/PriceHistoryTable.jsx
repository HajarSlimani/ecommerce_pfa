import PriceTag from '../common/PriceTag'
import { formatDate } from '../../utils/formatDate'
import { formatCurrency } from '../../utils/formatCurrency'

export default function PriceHistoryTable({ entries }) {
  if (!entries?.length) {
    return (
      <div className="rounded-lg border border-line bg-surface py-8 shadow-admin-sm">
        <p className="text-center text-sm text-ink-soft">Aucun ajustement de prix pour l’instant.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-admin-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-muted/60 text-left text-xs uppercase tracking-wide text-ink-soft">
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
            <tr key={e.id} className="border-b border-line transition-colors last:border-0 hover:bg-surface-muted/40">
              <td className="px-4 py-3 font-medium text-ink">{e.productName || `#${e.productId}`}</td>
              <td className="px-4 py-3 font-mono text-xs">{e.grade}</td>
              <td className="px-4 py-3 tabular-price text-ink-soft">{formatCurrency(e.oldPrice)}</td>
              <td className="px-4 py-3">
                <PriceTag price={e.newPrice} oldPrice={e.oldPrice} size="sm" />
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-price ${
                    (e.estimatedRevenueImpact ?? 0) >= 0 ? 'bg-deal-down/10 text-deal-down' : 'bg-deal-up/10 text-deal-up'
                  }`}
                >
                  {e.estimatedRevenueImpact != null ? formatCurrency(e.estimatedRevenueImpact) : '—'}
                </span>
              </td>
              <td className="max-w-xs px-4 py-3 text-xs text-ink-soft">{e.reasoning || '—'}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-soft">
                {formatDate(e.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
