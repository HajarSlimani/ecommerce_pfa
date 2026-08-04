import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api/orderApi'
import { useAuth } from './useAuth'

export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useOrderHistory(page = 0) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['orders', user?.userId, page],
    queryFn: () => orderApi.getForUser(user.userId, { page }),
    enabled: !!user?.userId,
  })
}

export function useOrder(orderId) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getById(orderId),
    enabled: !!orderId,
  })
}
