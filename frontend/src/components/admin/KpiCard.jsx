import { ArrowUp, ArrowDown } from 'lucide-react'

/**
 * `trend` : variation en % vs la semaine précédente, ou `undefined`/`null`
 * si pas de base de comparaison (le backend renvoie null plutôt qu'un
 * "+∞%" quand la semaine précédente n'a aucune donnée) — dans ce cas on
 * affiche juste rien plutôt qu'un chiffre trompeur.
 */
export default function KpiCard({ label, value, accent = 'ink', trend }) {
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
    <div className="border border-line bg-surface p-5">
      <div className="eyebrow">{label}</div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className={`tabular-price font-display text-2xl font-medium ${accentClasses[accent]}`}>{value}</div>
        {hasTrend && (
          <div
            className={`mb-1 flex items-center gap-0.5 text-xs font-medium ${
              isPositive ? 'text-deal-down' : 'text-deal-up'
            }`}
          >
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  )
}
