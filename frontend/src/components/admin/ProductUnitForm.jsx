import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { productApi } from '../../api/productApi'

const GRADES = ['NEUF', 'A', 'B', 'C']
const EMPTY_FORM = { serialNumber: '', grade: 'A', currentPrice: '' }

export default function ProductUnitForm({ productId }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data) => productApi.addUnit(productId, data),
    onSuccess: () => {
      toast.success('Unité ajoutée')
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      setForm(EMPTY_FORM)
    },
    onError: (err) => toast.error(err.response?.data?.message || "Échec de l'ajout"),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ ...form, currentPrice: Number(form.currentPrice) })
  }

  if (!productId) {
    return <p className="text-xs text-ink-soft">Sélectionne un produit pour lui ajouter des unités.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-surface-sunken bg-surface p-5">
      <h3 className="font-display text-sm font-semibold">
        Ajouter une unité — produit #{productId}
      </h3>
      <input
        required
        placeholder="Numéro de série"
        value={form.serialNumber}
        onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
        className="rounded-md border border-surface-sunken px-3 py-2 font-mono text-sm"
      />
      <select
        value={form.grade}
        onChange={(e) => setForm({ ...form, grade: e.target.value })}
        className="rounded-md border border-surface-sunken px-3 py-2 text-sm"
      >
        {GRADES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <input
        required
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Prix courant"
        value={form.currentPrice}
        onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
        className="rounded-md border border-surface-sunken px-3 py-2 font-mono text-sm"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-1 rounded-md bg-ink py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
      >
        {mutation.isPending ? 'Ajout…' : 'Ajouter l\u2019unité'}
      </button>
    </form>
  )
}
