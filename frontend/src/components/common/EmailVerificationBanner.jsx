import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../hooks/useAuth'

export default function EmailVerificationBanner() {
  const { user, isAuthenticated } = useAuth()
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (!isAuthenticated || user?.emailVerified) return null

  const handleResend = async () => {
    setIsSending(true)
    try {
      await authApi.resendVerification()
      toast.success('Email de vérification renvoyé')
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de l’envoi')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="border-b border-line bg-surface-muted px-6 py-2.5 text-center text-xs text-ink-soft">
      Vérifie ton adresse email pour profiter pleinement de ton compte.{' '}
      {sent ? (
        <span className="text-ink">Email envoyé — pense à vérifier tes spams.</span>
      ) : (
        <button
          onClick={handleResend}
          disabled={isSending}
          className="font-medium text-ink underline transition hover:text-brand-600 disabled:opacity-40"
        >
          {isSending ? 'Envoi…' : 'Renvoyer l’email'}
        </button>
      )}
    </div>
  )
}
