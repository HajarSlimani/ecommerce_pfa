import { ArrowUp, ArrowDown } from 'lucide-react'

/**
 * `trend` : variation en % vs la semaine précédente, ou `undefined`/`null`
 * si pas de base de comparaison (le backend renvoie null plutôt qu'un
 * "+∞%" quand la semaine précédente n'a aucune donnée) — dans ce cas on
 * affiche juste rien plutôt qu'un chiffre trompeur.
 */
export default function KpiCard({ icon: Icon, label, value, accent = 'ink', trend }) {
  const accentClasses = {
    ink: 'text-ink',
    up: 'text-deal-up',
    down: 'text-deal-down',
  }

  const hasTrend = trend !== undefined && trend !== null
  const isPositive = trend > 0
  // deal-down (vert) / deal-up (rouge) sont nommés pour les variations de
  // PRIX (baisse = bonne affaire), mais ici on les réutilise simplement
  // comme "positif = vert, négatif = rouge" pour une tendance business.

  return (
    <div className="group border border-line bg-surface p-5 transition-shadow hover:shadow-admin-md">
      <div className="flex items-center justify-between">
        <div className="eyebrow">{label}</div>
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-soft transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
            <Icon size={13} strokeWidth={1.8} />
          </span>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div className={`tabular-price font-display text-2xl font-medium ${accentClasses[accent]}`}>{value}</div>
        {hasTrend && (
          <div
            className={`mb-0.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
              isPositive ? 'bg-deal-down/10 text-deal-down' : 'bg-deal-up/10 text-deal-up'
            }`}
          >
            {isPositive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  )
}
