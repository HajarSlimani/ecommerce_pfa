export const ORDER_STATUS = {
  PENDING: { label: 'En attente', className: 'text-ink-soft' },
  CONFIRMED: { label: 'Confirmée', className: 'text-brand-600' },
  SHIPPED: { label: 'Expédiée', className: 'text-brand-600' },
  DELIVERED: { label: 'Livrée', className: 'text-deal-down' },
  CANCELLED: { label: 'Annulée', className: 'text-deal-up' },
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
