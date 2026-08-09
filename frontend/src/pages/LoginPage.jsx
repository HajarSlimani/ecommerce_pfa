import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cameFromCart = location.state?.from?.pathname === '/cart'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await login(form)
      // Le panier invité éventuel vient d'être fusionné côté backend :
      // on invalide le cache pour refléter le panier fusionné.
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Connexion réussie')

      const from = location.state?.from?.pathname
      // Un admin qui se connecte atterrit sur le tableau de bord, sauf s'il
      // venait spécifiquement d'une sous-page admin (lien direct, favori…).
      if (res.role === 'ADMIN' && !from?.startsWith('/admin')) {
        navigate('/admin')
      } else {
        navigate(from || '/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants invalides')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <p className="eyebrow mb-3">{cameFromCart ? 'Dernière étape' : 'Compte'}</p>
      <h1 className="font-display text-3xl font-medium text-ink">Connexion</h1>
      {cameFromCart && (
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Connecte-toi pour valider ta commande — ton panier est conservé.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-5">
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-ink py-3.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
        >
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-ink underline transition hover:text-brand-600">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
