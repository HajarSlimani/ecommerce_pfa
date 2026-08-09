import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSetColorImage } from '../../hooks/useAdmin'

export default function ColorImagesManager({ productId, colorImages }) {
  const [color, setColor] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const setColorImage = useSetColorImage()

  const entries = Object.entries(colorImages || {})

  const handleSubmit = (e) => {
    e.preventDefault()
    setColorImage.mutate(
      { productId, color, imageUrl },
      {
        onSuccess: () => {
          toast.success(`Image enregistrée pour « ${color} »`)
          setColor('')
          setImageUrl('')
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Échec de l’enregistrement'),
      }
    )
  }

  return (
    <div className="border border-line bg-surface p-6">
      <p className="eyebrow">Photos par couleur</p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
        Le grade n’affecte pas la photo, seule la couleur compte. Une couleur sans photo ici
        retombe sur l’image par défaut du produit.
      </p>

      {entries.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {entries.map(([c, url]) => (
            <div key={c} className="flex flex-col gap-1.5">
              <div className="aspect-square overflow-hidden border border-line bg-surface-muted">
                <img src={url} alt={c} className="h-full w-full object-cover" />
              </div>
              <span className="truncate text-xs text-ink-soft">{c}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Couleur</label>
          <input
            required
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="ex. Bleu"
            className="w-32 border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs text-ink-soft">URL de l’image</label>
          <input
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className="w-full border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <button
          type="submit"
          disabled={setColorImage.isPending}
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
        >
          {setColorImage.isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
