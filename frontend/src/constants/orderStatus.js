export const ORDER_STATUS = {
  // `className` reste utilisé pour le texte simple (select, libellés en ligne).
  // `badgeClassName` ajoute un fond teinté + bordure assortie pour l'affichage
  // en pilule (StatusBadge) sans introduire de nouvelles couleurs.
  PENDING: {
    label: 'En attente',
    className: 'text-ink-soft',
    badgeClassName: 'bg-surface-sunken text-ink-soft border-line',
  },
  CONFIRMED: {
    label: 'Confirmée',
    className: 'text-brand-600',
    badgeClassName: 'bg-brand-50 text-brand-600 border-brand-100',
  },
  SHIPPED: {
    label: 'Expédiée',
    className: 'text-brand-600',
    badgeClassName: 'bg-brand-50 text-brand-600 border-brand-100',
  },
  DELIVERED: {
    label: 'Livrée',
    className: 'text-deal-down',
    badgeClassName: 'bg-deal-down/10 text-deal-down border-deal-down/20',
  },
  CANCELLED: {
    label: 'Annulée',
    className: 'text-deal-up',
    badgeClassName: 'bg-deal-up/10 text-deal-up border-deal-up/20',
  },
}

// Miroir de OrderService.ALLOWED_TRANSITIONS côté backend — sert seulement à
// ne proposer que des transitions valides dans le <select> admin ; la vraie
// validation reste faite côté serveur.
export const ORDER_STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}
