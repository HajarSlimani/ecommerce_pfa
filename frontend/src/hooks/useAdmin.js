import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../api/productApi'
import { orderApi } from '../api/orderApi'
import { adminApi } from '../api/adminApi'

// --- Tableau de bord ---

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
  })
}

export function useAdminUsers(page = 0) {
  return useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminApi.getUsers({ page }),
    placeholderData: (prev) => prev,
  })
}

// --- Produits ---

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['productSearch'] })
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['productSearch'] })
    },
  })
}

export function useSetColorImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, color, imageUrl }) => productApi.setColorImage(productId, color, imageUrl),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
    },
  })
}

// --- Stock (unités) ---

export function useProductUnits(productId) {
  return useQuery({
    queryKey: ['productUnits', productId],
    queryFn: () => productApi.getUnits(productId),
    enabled: !!productId,
  })
}

export function useAddUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, data }) => productApi.addUnit(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['productUnits', productId] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
    },
  })
}

export function useUpdateUnitStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, unitId, status }) => productApi.updateUnitStatus(productId, unitId, status),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['productUnits', productId] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
    },
  })
}

// --- Commandes ---

export function useAdminOrders(page = 0) {
  return useQuery({
    queryKey: ['adminOrders', page],
    queryFn: () => orderApi.adminGetAll({ page }),
    placeholderData: (prev) => prev,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status }) => orderApi.adminUpdateStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminOrders'] }),
  })
}
