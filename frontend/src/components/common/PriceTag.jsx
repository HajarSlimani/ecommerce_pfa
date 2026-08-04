import { formatCurrency } from '../../utils/formatCurrency'

/**
 * Élément signature de l'UI : affiche un prix au format "ticker" (police mono,
 * chiffres tabulaires) avec un indicateur de variation quand un ancien prix
 * est fourni — cohérent avec le thème du pricing piloté par IA : chaque prix
 * affiché est potentiellement "vivant".
 */
export default function PriceTag({ price, oldPrice, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl',
  }

  const hasChange = oldPrice != null && oldPrice !== price
  const isDrop = hasChange && price < oldPrice
  const delta = hasChange ? Math.abs(((price - oldPrice) / oldPrice) * 100).toFixed(1) : null

  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`tabular-price font-semibold text-ink ${sizeClasses[size]}`}>
        {formatCurrency(price)}
      </span>
      {hasChange && (
        <span
          className={`inline-flex items-center gap-0.5 font-mono text-xs font-medium ${
            isDrop ? 'text-deal-down' : 'text-deal-up'
          }`}
        >
          {isDrop ? '▼' : '▲'} {delta}%
        </span>
      )}
    </span>
  )
}
