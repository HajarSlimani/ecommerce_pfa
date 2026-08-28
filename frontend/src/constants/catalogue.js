export const CATEGORIES = [
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'laptops', label: 'Ordinateurs portables' },
  { id: 'audio', label: 'Audio' },
  { id: 'electronics', label: 'Électronique' },
]

export const UNIT_STATUS = {
  AVAILABLE: { label: 'Disponible', className: 'text-deal-down', badgeClassName: 'bg-deal-down/10 text-deal-down border-deal-down/20' },
  SOLD: { label: 'Vendue', className: 'text-ink-soft', badgeClassName: 'bg-surface-sunken text-ink-soft border-line' },
  RETURNED: { label: 'Retournée', className: 'text-brand-600', badgeClassName: 'bg-brand-50 text-brand-600 border-brand-100' },
  DEFECTIVE: { label: 'Défectueuse', className: 'text-deal-up', badgeClassName: 'bg-deal-up/10 text-deal-up border-deal-up/20' },
}

export const GRADES = [
  {
    code: 'NEUF',
    label: 'Neuf',
    desc: 'Jamais utilisé, sous scellé constructeur.',
  },
  {
    code: 'A',
    label: 'Grade A',
    desc: 'Comme neuf. Aucune trace d’usure visible.',
  },
  {
    code: 'B',
    label: 'Grade B',
    desc: 'Très bon état. Micro-rayures possibles.',
  },
  {
    code: 'C',
    label: 'Grade C',
    desc: 'Bon état fonctionnel. Traces d’usure visibles à l’œil.',
  },
]
