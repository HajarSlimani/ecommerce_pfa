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

/**
 * Sélection en deux temps : d'abord le grade (état de reconditionnement, qui
 * pilote le prix), puis la couleur disponible pour ce grade (n'affecte pas
 * le prix, seulement le stock — voir la note dans ProductUnit côté backend).
 */
export default function GradeSelector({ variants, selectedGrade, selectedColor, onSelectGrade, onSelectColor }) {
  const grades = [...new Set(variants.map((v) => v.grade))];
  const colorOptions = variants.filter((v) => v.grade === selectedGrade);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {grades.map((grade) => {
          const gradeVariants = variants.filter((v) => v.grade === grade);
          const anyStock = gradeVariants.some((v) => v.availableStock > 0);
          const isSelected = grade === selectedGrade;
          const referencePrice = gradeVariants[0]?.currentPrice;

          return (
            <button
              key={grade}
              disabled={!anyStock}
              onClick={() => onSelectGrade(grade)}
              className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected
                  ? `${GRADE_COLORS[grade]} bg-surface-muted`
                  : 'border-surface-sunken hover:border-ink-soft'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">{GRADE_LABELS[grade] || grade}</span>
                <span className="font-mono text-xs text-ink-soft">
                  {anyStock ? `${gradeVariants.length} couleur(s) disponible(s)` : 'Rupture de stock'}
                </span>
              </div>
              <PriceTag price={referencePrice} size="sm" />
            </button>
          );
        })}
      </div>

      {selectedGrade && (
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">Couleur</div>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((v) => {
              const isOutOfStock = v.availableStock === 0;
              const isSelected = v.color === selectedColor;
              return (
                <button
                  key={v.color}
                  disabled={isOutOfStock}
                  onClick={() => onSelectColor(v.color)}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected
                      ? 'border-ink bg-ink text-white'
                      : 'border-surface-sunken text-ink hover:border-ink-soft'
                  }`}
                >
                  {v.color}
                  {isOutOfStock && ' (rupture)'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
