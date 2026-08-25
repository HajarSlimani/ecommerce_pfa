import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { authApi } from '../api/authApi'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [passwords, setPasswords] = useState({ next: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-6 py-24">
        <p className="eyebrow mb-3">Compte</p>
        <h1 className="font-display text-3xl font-medium text-ink">Lien invalide</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Ce lien de réinitialisation est incomplet.{' '}
          <Link to="/forgot-password" className="text-ink underline hover:text-brand-600">
            Demander un nouveau lien
          </Link>
        </p>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setIsSubmitting(true)
    try {
      await authApi.resetPassword(token, passwords.next)
      toast.success('Mot de passe réinitialisé — connecte-toi')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lien invalide ou expiré')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <p className="eyebrow mb-3">Compte</p>
      <h1 className="font-display text-3xl font-medium text-ink">Nouveau mot de passe</h1>

      <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-5">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            placeholder="Nouveau mot de passe (8 caractères min.)"
            value={passwords.next}
            onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            className="w-full border border-line bg-transparent px-4 py-3 pr-11 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft transition hover:text-ink"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="Confirmer le mot de passe"
          value={passwords.confirm}
          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          className="border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-ink py-3.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
        >
          {isSubmitting ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </div>
  )
}
