import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import {
  useReviews,
  useRatingSummary,
  useReviewEligibility,
  useSubmitReview,
  useDeleteReview,
} from '../../hooks/useReviews'
import { formatDate } from '../../utils/formatDate'
import StarRating from './StarRating'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ReviewsSection({ productId }) {
  const { isAuthenticated } = useAuth()
  const { data: summary } = useRatingSummary(productId)
  const { data: reviewsPage, isLoading } = useReviews(productId)
  const { data: eligibility } = useReviewEligibility(productId)

  const submitReview = useSubmitReview(productId)
  const deleteReview = useDeleteReview(productId)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (eligibility?.existingReview) {
      setRating(eligibility.existingReview.rating)
      setComment(eligibility.existingReview.comment || '')
    }
  }, [eligibility?.existingReview])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Choisis une note')
      return
    }
    submitReview.mutate(
      { rating, comment },
      {
        onSuccess: () => {
          toast.success('Avis publié')
          setIsEditing(false)
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Échec de la publication'),
      }
    )
  }

  const handleDelete = () => {
    deleteReview.mutate(undefined, {
      onSuccess: () => {
        toast.success('Avis supprimé')
        setRating(0)
        setComment('')
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Échec de la suppression'),
    })
  }

  const reviews = reviewsPage?.content || []
  const showForm = eligibility?.canReview && (isEditing || !eligibility.existingReview)

  return (
    <section className="border-t border-line py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Avis</p>
          <h2 className="font-display text-2xl font-medium text-ink">Avis clients</h2>
        </div>
        {summary && summary.reviewCount > 0 && (
          <div className="flex items-center gap-2.5">
            <StarRating value={summary.averageRating} />
            <span className="font-mono text-sm text-ink">{summary.averageRating.toFixed(1)}</span>
            <span className="text-sm text-ink-soft">
              ({summary.reviewCount} avis)
            </span>
          </div>
        )}
      </div>

      {/* Formulaire / éligibilité */}
      <div className="mt-8 max-w-lg">
        {!isAuthenticated ? (
          <p className="text-sm text-ink-soft">
            <Link to="/login" className="text-ink underline hover:text-brand-600">Connecte-toi</Link> pour laisser un avis.
          </p>
        ) : eligibility && !eligibility.canReview && !eligibility.existingReview ? (
          <p className="text-sm text-ink-soft">
            Tu pourras laisser un avis une fois ta commande de ce produit expédiée.
          </p>
        ) : showForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-line p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              {eligibility?.existingReview ? 'Modifier mon avis' : 'Laisser un avis'}
            </p>
            <StarRating value={rating} onChange={setRating} size={20} />
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ton avis (optionnel)"
              className="border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitReview.isPending}
                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
              >
                {submitReview.isPending ? 'Publication…' : 'Publier'}
              </button>
              {eligibility?.existingReview && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-ink-soft transition hover:text-ink"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        ) : eligibility?.existingReview ? (
          <div className="border border-line p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Ton avis</p>
              <div className="flex items-center gap-4 text-xs">
                <button onClick={() => setIsEditing(true)} className="text-ink-soft transition hover:text-ink">
                  Modifier
                </button>
                <button onClick={handleDelete} className="text-ink-soft transition hover:text-deal-up">
                  Supprimer
                </button>
              </div>
            </div>
            <div className="mt-2">
              <StarRating value={eligibility.existingReview.rating} />
            </div>
            {eligibility.existingReview.comment && (
              <p className="mt-2 text-sm text-ink-soft">{eligibility.existingReview.comment}</p>
            )}
          </div>
        ) : null}
      </div>

      {/* Liste des avis */}
      <div className="mt-10">
        {isLoading ? (
          <LoadingSpinner label="Chargement des avis…" />
        ) : reviews.length === 0 ? (
          <p className="text-sm text-ink-soft">Pas encore d’avis pour ce produit.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {reviews.map((r) => (
              <div key={r.id} className="py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{r.userName}</span>
                  <span className="text-xs text-ink-soft">{formatDate(r.createdAt)}</span>
                </div>
                <div className="mt-1.5">
                  <StarRating value={r.rating} size={14} />
                </div>
                {r.comment && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
