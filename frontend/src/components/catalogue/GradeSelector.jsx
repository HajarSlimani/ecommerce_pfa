import PriceTag from '../common/PriceTag'

const GRADE_LABELS = {
  NEUF: 'Neuf reconditionné',
  A: 'Grade A — comme neuf',
  B: 'Grade B — bon état',
  C: 'Grade C — état correct',
}

const GRADE_COLORS = {
  NEUF: 'border-grade-neuf text-grade-neuf',
  A: 'border-grade-a text-grade-a',
  B: 'border-grade-b text-grade-b',
  C: 'border-grade-c text-grade-c',
}

export default function GradeSelector({ variants, selectedGrade, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      {variants.map((v) => {
        const isSelected = v.grade === selectedGrade
        const isOutOfStock = v.availableStock === 0

        return (
          <button
            key={v.grade}
            disabled={isOutOfStock}
            onClick={() => onSelect(v.grade)}
            className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isSelected
                ? `${GRADE_COLORS[v.grade]} bg-surface-muted`
                : 'border-surface-sunken hover:border-ink-soft'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-ink">{GRADE_LABELS[v.grade] || v.grade}</span>
              <span className="font-mono text-xs text-ink-soft">
                {isOutOfStock ? 'Rupture de stock' : `${v.availableStock} en stock`}
              </span>
            </div>
            <PriceTag price={v.currentPrice} size="sm" />
          </button>
        )
      })}
    </div>
  )
}
