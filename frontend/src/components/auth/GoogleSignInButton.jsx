import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }
    const existing = document.getElementById('google-identity-script')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      return
    }
    const script = document.createElement('script')
    script.id = 'google-identity-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Impossible de charger Google Identity Services'))
    document.head.appendChild(script)
  })
}

/**
 * Nécessite VITE_GOOGLE_CLIENT_ID (variable d'environnement frontend, valeur
 * publique — pas un secret). À créer dans Google Cloud Console → APIs &
 * Services → Credentials → Client ID OAuth 2.0, type "Web application",
 * avec http://localhost:5173 (ou ton port Vite) dans les origines JS
 * autorisées. Le backend a besoin du MÊME Client ID via GOOGLE_CLIENT_ID
 * (voir application.yml) pour vérifier les jetons.
 */
export default function GoogleSignInButton() {
  const buttonRef = useRef(null)
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId) return
    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const res = await loginWithGoogle(response.credential)
              queryClient.invalidateQueries({ queryKey: ['cart'] })
              toast.success('Connexion réussie')

              const from = location.state?.from?.pathname
              if (res.role === 'ADMIN' && !from?.startsWith('/admin')) {
                navigate('/admin')
              } else {
                navigate(from || '/')
              }
            } catch (err) {
              toast.error(err.response?.data?.message || 'Échec de la connexion Google')
            }
          },
        })

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
        })
      })
      .catch(() => toast.error('Impossible de charger la connexion Google'))

    return () => {
      cancelled = true
    }
  }, [clientId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!clientId) {
    return (
      <p className="text-xs text-ink-soft">
        Connexion Google non configurée (variable <code>VITE_GOOGLE_CLIENT_ID</code> manquante).
      </p>
    )
  }

  return <div ref={buttonRef} className="flex justify-center" />
}
