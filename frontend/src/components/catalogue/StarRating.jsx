import { Star } from 'lucide-react'

/**
 * `value` : note affichée (peut être décimale pour une moyenne, ex. 4.3).
 * `onChange` fourni → mode interactif (clic pour choisir une note entière).
 */
export default function StarRating({ value = 0, onChange, size = 16 }) {
  const interactive = typeof onChange === 'function'
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= Math.round(value)
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            className={interactive ? 'transition hover:scale-110' : 'cursor-default'}
            aria-label={interactive ? `Donner ${star} étoile${star > 1 ? 's' : ''}` : undefined}
          >
            <Star
              size={size}
              strokeWidth={1.6}
              className={filled ? 'fill-ink text-ink' : 'text-line'}
            />
          </button>
        )
      })}
    </div>
  )
}
