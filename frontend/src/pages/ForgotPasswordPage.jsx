import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/authApi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await authApi.forgotPassword(email)
    } finally {
      // Toujours le même comportement, que l'email existe ou non — voir la
      // note côté backend (AuthService#forgotPassword) sur l'énumération
      // de comptes.
      setSent(true)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <p className="eyebrow mb-3">Compte</p>
      <h1 className="font-display text-3xl font-medium text-ink">Mot de passe oublié</h1>

      {sent ? (
        <p className="mt-6 text-sm leading-relaxed text-ink-soft">
          Si un compte existe avec cet email, un lien de réinitialisation vient d’être envoyé.
          Vérifie ta boîte de réception (et les spams).
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Indique ton email, on t’envoie un lien pour choisir un nouveau mot de passe.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-ink py-3.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
            >
              {isSubmitting ? 'Envoi…' : 'Envoyer le lien'}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link to="/login" className="text-ink underline transition hover:text-brand-600">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
