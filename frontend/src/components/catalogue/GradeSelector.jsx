import PriceTag from '../common/PriceTag'
import { GRADES } from '../../constants/catalogue'

const GRADE_LOOKUP = Object.fromEntries(GRADES.map((g) => [g.code, g]))

/**
 * Sélection en deux temps : d'abord le grade (état de reconditionnement, qui
 * pilote le prix), puis la couleur disponible pour ce grade (n'affecte pas
 * le prix, seulement le stock — voir la note dans ProductUnit côté backend).
 *
 * Style aligné sur le "grade explainer" de la home (badge mono + hairline)
 * plutôt que des cartes colorées, pour rester cohérent avec le reste du site.
 */
export default function GradeSelector({ variants, selectedGrade, selectedColor, onSelectGrade, onSelectColor }) {
  const grades = [...new Set(variants.map((v) => v.grade))]
  const colorOptions = variants.filter((v) => v.grade === selectedGrade)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        {grades.map((grade) => {
          const gradeVariants = variants.filter((v) => v.grade === grade)
          const anyStock = gradeVariants.some((v) => v.availableStock > 0)
          const isSelected = grade === selectedGrade
          const referencePrice = gradeVariants[0]?.currentPrice
          const meta = GRADE_LOOKUP[grade]

          return (
            <button
              key={grade}
              disabled={!anyStock}
              onClick={() => onSelectGrade(grade)}
              className={`flex items-center justify-between gap-4 border-t px-1 py-4 text-left transition first:border-t disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected ? 'border-t-ink' : 'border-t-line hover:border-t-ink-soft'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`font-mono text-xs font-medium uppercase tracking-[0.14em] ${
                    isSelected ? 'text-ink' : 'text-ink-soft'
                  }`}
                >
                  {grade}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-ink">{meta?.label || grade}</span>
                  <span className="text-xs text-ink-soft">
                    {anyStock ? `${gradeVariants.length} couleur(s) disponible(s)` : 'Rupture de stock'}
                  </span>
                </div>
              </div>
              <PriceTag price={referencePrice} size="sm" />
            </button>
          )
        })}
      </div>

      {selectedGrade && (
        <div>
          <div className="mb-2.5 text-xs font-medium uppercase tracking-wide text-ink-soft">Couleur</div>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((v) => {
              const isOutOfStock = v.availableStock === 0
              const isSelected = v.color === selectedColor
              return (
                <button
                  key={v.color}
                  disabled={isOutOfStock}
                  onClick={() => onSelectColor(v.color)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected
                      ? 'border-ink bg-ink text-white'
                      : 'border-line text-ink hover:border-ink-soft'
                  }`}
                >
                  {v.color}
                  {isOutOfStock && ' (rupture)'}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
