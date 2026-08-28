import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Package, Sparkles } from 'lucide-react'
import { CATEGORIES } from '../../constants/catalogue'
import { useCreateProduct, useUpdateProduct } from '../../hooks/useAdmin'

const EMPTY = { name: '', description: '', brand: '', category: CATEGORIES[0].id, imageUrl: '' }

export default function ProductEditForm({ product, onCreated }) {
  const isEditing = !!product
  const [form, setForm] = useState(EMPTY)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  useEffect(() => {
    setForm(
      product
        ? {
            name: product.name || '',
            description: product.description || '',
            brand: product.brand || '',
            category: product.category || CATEGORIES[0].id,
            imageUrl: product.imageUrl || '',
          }
        : EMPTY
    )
  }, [product])

  const inputClass =
    'rounded-md border border-line bg-transparent px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-brand-300 focus:ring-2 focus:ring-brand-100'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      updateProduct.mutate(
        { id: product.id, data: form },
        {
          onSuccess: () => toast.success('Produit mis à jour'),
          onError: (err) => toast.error(err.response?.data?.message || 'Échec de la mise à jour'),
        }
      )
    } else {
      createProduct.mutate(form, {
        onSuccess: (created) => {
          toast.success('Produit créé')
          setForm(EMPTY)
          onCreated?.(created)
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Échec de la création'),
      })
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6 shadow-admin-sm"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          {isEditing ? <Package size={13} /> : <Sparkles size={13} />}
        </span>
        <p className="eyebrow">{isEditing ? 'Modifier le produit' : 'Nouveau produit'}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Nom</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Marque</label>
          <input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-ink-soft">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Image par défaut (URL)</label>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md border border-line bg-surface-muted">
              {form.imageUrl && <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://…"
              className={`w-full ${inputClass}`}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 self-start rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
      >
        {isPending ? 'Enregistrement…' : isEditing ? 'Enregistrer' : 'Créer le produit'}
      </button>
    </form>
  )
}
