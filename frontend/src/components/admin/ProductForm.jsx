import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { productApi } from '../../api/productApi'

const EMPTY_FORM = { name: '', description: '', brand: '', category: 'electronics', imageUrl: '' }

export default function ProductForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: (product) => {
      toast.success('Produit créé')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setForm(EMPTY_FORM)
      onCreated?.(product)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Échec de la création'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-surface-sunken bg-surface p-5">
      <h3 className="font-display text-sm font-semibold">Nouveau produit</h3>
      <input
        required
        placeholder="Nom (ex: iPhone 13 128GB)"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="rounded-md border border-surface-sunken px-3 py-2 text-sm"
      />
      <input
        placeholder="Marque"
        value={form.brand}
        onChange={(e) => setForm({ ...form, brand: e.target.value })}
        className="rounded-md border border-surface-sunken px-3 py-2 text-sm"
      />
      <input
        required
        placeholder="Catégorie"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="rounded-md border border-surface-sunken px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        className="rounded-md border border-surface-sunken px-3 py-2 text-sm"
      />
      <input
        placeholder="URL image (optionnel)"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        className="rounded-md border border-surface-sunken px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-1 rounded-md bg-ink py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
      >
        {mutation.isPending ? 'Création…' : 'Créer le produit'}
      </button>
    </form>
  )
}
