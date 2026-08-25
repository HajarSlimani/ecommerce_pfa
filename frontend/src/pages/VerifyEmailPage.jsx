import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { authApi } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { markEmailVerified } = useAuth()
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    authApi
      .verifyEmail(token)
      .then(() => {
        markEmailVerified()
        setStatus('success')
      })
      .catch(() => setStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="mx-auto max-w-sm px-6 py-24 text-center">
      {status === 'loading' && <LoadingSpinner label="Vérification…" />}

      {status === 'success' && (
        <>
          <CheckCircle2 size={28} strokeWidth={1.4} className="mx-auto text-deal-down" />
          <h1 className="mt-4 font-display text-2xl font-medium text-ink">Email vérifié</h1>
          <p className="mt-2 text-sm text-ink-soft">Ton adresse email est confirmée.</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Retour à l'accueil
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle size={28} strokeWidth={1.4} className="mx-auto text-deal-up" />
          <h1 className="mt-4 font-display text-2xl font-medium text-ink">Lien invalide</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Ce lien de vérification est invalide ou a expiré. Tu peux en redemander un depuis ton profil.
          </p>
          <Link to="/profile" className="mt-6 inline-block text-sm text-ink underline hover:text-brand-600">
            Aller à mon profil
          </Link>
        </>
      )}
    </div>
  )
}
