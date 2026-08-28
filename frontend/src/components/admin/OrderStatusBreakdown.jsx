import { ORDER_STATUS } from '../../constants/orderStatus'

export default function OrderStatusBreakdown({ counts }) {
  const total = Object.values(counts || {}).reduce((sum, n) => sum + n, 0)

  return (
    <div className="border border-line bg-surface p-5">
      <p className="eyebrow">Commandes par statut</p>

      {total === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Aucune commande pour l’instant.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3.5">
          {Object.entries(counts).map(([status, count]) => {
            const meta = ORDER_STATUS[status] || { label: status, className: 'text-ink-soft' }
            const pct = total > 0 ? (count / total) * 100 : 0
            return (
              <div key={status}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className={`font-medium uppercase tracking-wide ${meta.className}`}>{meta.label}</span>
                  <span className="tabular-price text-ink-soft">{count}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
