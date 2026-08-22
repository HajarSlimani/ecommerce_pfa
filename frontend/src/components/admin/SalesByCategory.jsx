import { CATEGORIES } from '../../constants/catalogue'
import PriceTag from '../common/PriceTag'

export default function SalesByCategory({ data }) {
  const maxRevenue = Math.max(...data.map((d) => Number(d.revenue)), 1)

  return (
    <div className="border border-line bg-surface p-5">
      <p className="eyebrow">Ventes par catégorie</p>

      {data.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Pas encore de vente confirmée.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {data.map((c) => {
            const label = CATEGORIES.find((cat) => cat.id === c.category)?.label || c.category
            const pct = (Number(c.revenue) / maxRevenue) * 100
            return (
              <div key={c.category}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-ink">{label}</span>
                  <PriceTag price={c.revenue} size="sm" />
                </div>
                <div className="h-1.5 w-full bg-surface-sunken">
                  <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
