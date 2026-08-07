import { useQuery } from '@tanstack/react-query'
import { productApi } from '../api/productApi'

export function useProducts({ category, page = 0, size = 12, sort } = {}) {
  return useQuery({
    queryKey: ['products', category, page, size, sort],
    queryFn: () => productApi.list({ category, page, size, sort }),
  })
}

// Séparé de useProducts : tape sur /products/search (grade + recherche texte
// + prix), volontairement pas mis en cache côté backend puisque le prix
// bouge en continu. keepPreviousData évite un flash de loading à chaque
// changement de filtre/tri/page.
export function useProductSearch({ category, grade, q, sort, page = 0, size = 12 } = {}) {
  return useQuery({
    queryKey: ['productSearch', category, grade, q, sort, page, size],
    queryFn: () => productApi.search({ category, grade, q, sort, page, size }),
    placeholderData: (prev) => prev,
  })
}

export function useProductDetail(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getDetail(productId),
    enabled: !!productId,
    staleTime: 30 * 1000, // court : le prix/stock bouge avec le pricing dynamique
  })
}
