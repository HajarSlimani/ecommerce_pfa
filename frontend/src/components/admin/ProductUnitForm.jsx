import { useState } from 'react'
import toast from 'react-hot-toast'
import { GRADES } from '../../constants/catalogue'
import { useAddUnit } from '../../hooks/useAdmin'

const EMPTY = { serialNumber: '', grade: 'NEUF', color: '', currentPrice: '' }

export default function ProductUnitForm({ productId }) {
  const [form, setForm] = useState(EMPTY)
  const addUnit = useAddUnit()

  const inputClass =
    'border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink'

  const handleSubmit = (e) => {
    e.preventDefault()
    addUnit.mutate(
      { productId, data: { ...form, currentPrice: parseFloat(form.currentPrice) } },
      {
        onSuccess: () => {
          toast.success('Unité ajoutée')
          setForm(EMPTY)
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Échec de l’ajout'),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 border-t border-line pt-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-ink-soft">N° de série</label>
        <input
          required
          value={form.serialNumber}
          onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
          className={`w-36 ${inputClass}`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-ink-soft">Grade</label>
        <select
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
          className={inputClass}
        >
          {GRADES.map((g) => (
            <option key={g.code} value={g.code}>{g.code}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-ink-soft">Couleur</label>
        <input
          required
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          placeholder="ex. Bleu"
          className={`w-28 ${inputClass}`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-ink-soft">Prix</label>
        <input
          required
          type="number"
          step="0.01"
          min="0.01"
          value={form.currentPrice}
          onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
          className={`w-28 ${inputClass}`}
        />
      </div>
      <button
        type="submit"
        disabled={addUnit.isPending}
        className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
      >
        {addUnit.isPending ? 'Ajout…' : '+ Ajouter une unité'}
      </button>
    </form>
  )
}
