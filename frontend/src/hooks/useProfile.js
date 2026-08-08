import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import { useAuth } from './useAuth'

export function useProfile() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile,
    enabled: isAuthenticated,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: userApi.changePassword,
  })
}
