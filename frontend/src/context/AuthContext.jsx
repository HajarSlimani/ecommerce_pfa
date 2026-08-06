import React, { createContext, useState, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { decodeJwtPayload } from '../utils/jwt'
import { clearGuestCartId } from '../utils/guestCart'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (authResponse) => {
    localStorage.setItem('token', authResponse.token)
    const claims = decodeJwtPayload(authResponse.token)
    const userData = {
      email: authResponse.email,
      role: authResponse.role,
      userId: claims?.userId ?? null,
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    // Le panier invité (s'il existait) vient d'être fusionné côté backend
    // dans le panier du compte : plus besoin de l'id local.
    clearGuestCartId()
  }

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials)
    persist(res)
    return res
  }, [])

  const register = useCallback(async (data) => {
    const res = await authApi.register(data)
    persist(res)
    return res
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
