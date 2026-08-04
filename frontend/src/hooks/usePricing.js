import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { pricingApi } from '../api/pricingApi'

export function usePricingHistory({ productId, page = 0 } = {}) {
  return useQuery({
    queryKey: ['pricing-history', productId, page],
    queryFn: () => pricingApi.getHistory({ productId, page }),
  })
}

export function usePricingImpact(from, to) {
  return useQuery({
    queryKey: ['pricing-impact', from, to],
    queryFn: () => pricingApi.getImpact(from, to),
    enabled: !!from && !!to,
  })
}

export function useTriggerRecalculation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, grade }) => pricingApi.recalculate(productId, grade),
    onSuccess: (_, variables) => {
      toast.success('Recalcul déclenché')
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['pricing-history'] })
    },
  })
}
