import { useQuery } from '@tanstack/react-query'
import { productApi } from '../api/productApi'

export function useProducts({ category, page = 0, size = 12, sort } = {}) {
  return useQuery({
    queryKey: ['products', category, page, size, sort],
    queryFn: () => productApi.list({ category, page, size, sort }),
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
