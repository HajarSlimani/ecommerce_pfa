import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await register(form)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Compte créé')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible de créer le compte')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <p className="eyebrow mb-3">Compte</p>
      <h1 className="font-display text-3xl font-medium text-ink">Créer un compte</h1>

      <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-5">
        <input
          required
          placeholder="Nom complet"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink"
        />
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
            minLength={8}
            placeholder="Mot de passe (8 caractères min.)"
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
          {isSubmitting ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-soft">ou</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <GoogleSignInButton />

      <p className="mt-6 text-center text-sm text-ink-soft">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-ink underline transition hover:text-brand-600">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
