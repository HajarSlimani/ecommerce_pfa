import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewApi } from '../api/reviewApi'
import { useAuth } from './useAuth'

export function useReviews(productId, page = 0) {
  return useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: () => reviewApi.list(productId, { page }),
    enabled: !!productId,
  })
}

export function useRatingSummary(productId) {
  return useQuery({
    queryKey: ['reviewSummary', productId],
    queryFn: () => reviewApi.getSummary(productId),
    enabled: !!productId,
  })
}

// Séparé de useReviews : nécessite d'être connecté, sinon 401 (l'endpoint
// exige isAuthenticated() côté backend) — inutile de l'appeler si personne
// n'est connecté.
export function useReviewEligibility(productId) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['reviewEligibility', productId],
    queryFn: () => reviewApi.getEligibility(productId),
    enabled: !!productId && isAuthenticated,
  })
}

export function useSubmitReview(productId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => reviewApi.submit(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', productId] })
      queryClient.invalidateQueries({ queryKey: ['reviewEligibility', productId] })
    },
  })
}

export function useDeleteReview(productId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reviewApi.deleteOwn(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', productId] })
      queryClient.invalidateQueries({ queryKey: ['reviewEligibility', productId] })
    },
  })
}
