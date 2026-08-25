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
      emailVerified: claims?.emailVerified ?? authResponse.emailVerified ?? false,
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

  const loginWithGoogle = useCallback(async (idToken) => {
    const res = await authApi.googleLogin(idToken)
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

  // Après une vérification d'email réussie, on met juste à jour l'état
  // local (pas besoin de se reconnecter pour rafraîchir le JWT).
  const markEmailVerified = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, emailVerified: true }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, login, loginWithGoogle, register, logout, markEmailVerified }}>
      {children}
    </AuthContext.Provider>
  )
}
