import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { cartApi } from '../api/cartApi'

export function useCart() {
  const queryClient = useQueryClient()

  // Le panier est accessible qu'on soit connecté (identifié par JWT) ou non
  // (identifié par le header X-Guest-Cart-Id, voir api/axiosInstance.js) :
  // pas de restriction "enabled" ici, sinon un visiteur perdrait son panier.
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
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

  const updateItemMutation = useMutation({
    mutationFn: cartApi.updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Impossible de modifier la quantité')
      // Le stock a pu bouger entre-temps (pricing dynamique) : on resynchronise
      // avec le serveur plutôt que de laisser affiché un état optimiste faux.
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
    updateItem: updateItemMutation.mutate,
  }
}
