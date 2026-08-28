import { ORDER_STATUS } from '../../constants/orderStatus'

/**
 * Pilule de statut de commande, fond teinté + bordure assortie. Remplace le
 * texte coloré nu utilisé jusqu'ici dans les tableaux admin : plus scannable
 * dans une colonne dense, et cohérent avec le vocabulaire visuel des grades
 * produit (déjà en badges ailleurs sur le site).
 */
export default function StatusBadge({ status }) {
  const meta = ORDER_STATUS[status] || {
    label: status,
    badgeClassName: 'bg-surface-sunken text-ink-soft border-line',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${meta.badgeClassName}`}
    >
      {meta.label}
    </span>
  )
}
