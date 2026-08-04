import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await register(form)
      toast.success('Compte créé')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible de créer le compte')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Nom complet"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="rounded-lg border border-surface-sunken px-4 py-2.5 text-sm outline-none focus:border-brand-500"
        />
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
          minLength={8}
          placeholder="Mot de passe (8 caractères min.)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg border border-surface-sunken px-4 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-ink py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
        >
          {isSubmitting ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-soft">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-brand-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
