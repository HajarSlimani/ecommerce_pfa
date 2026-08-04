import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { cartApi } from '../api/cartApi'
import { useAuth } from './useAuth'

export function useCart() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    enabled: isAuthenticated,
  })

  const addItemMutation = useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Ajouté au panier')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Impossible d'ajouter au panier")
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    addItem: addItemMutation.mutate,
    isAdding: addItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
  }
}
