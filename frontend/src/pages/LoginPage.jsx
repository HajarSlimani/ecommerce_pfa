import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await login(form)
      // Le panier invité éventuel vient d'être fusionné côté backend :
      // on invalide le cache pour refléter le panier fusionné.
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Connexion réussie')
      navigate(location.state?.from?.pathname || '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants invalides')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl">Connexion</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-surface-sunken px-4 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg border border-surface-sunken px-4 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-ink py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
        >
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-soft">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-brand-600 hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
