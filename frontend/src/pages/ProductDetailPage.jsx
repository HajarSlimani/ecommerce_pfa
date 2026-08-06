import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProductDetail } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import GradeSelector from '../components/catalogue/GradeSelector'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useProductDetail(Number(id))
  const { addItem, isAdding } = useCart()
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (data?.variants?.length && !selectedGrade) {
      const firstAvailable = data.variants.find((v) => v.availableStock > 0) ?? data.variants[0]
      setSelectedGrade(firstAvailable.grade)
      setSelectedColor(firstAvailable.color)
    }
  }, [data, selectedGrade])

  // Si on change de grade, on retombe sur une couleur valide pour ce grade
  const handleSelectGrade = (grade) => {
    setSelectedGrade(grade)
    const firstColorForGrade = data.variants.find((v) => v.grade === grade && v.availableStock > 0)
      ?? data.variants.find((v) => v.grade === grade)
    setSelectedColor(firstColorForGrade?.color ?? null)
    setQuantity(1)
  }

  if (isLoading) return <LoadingSpinner label="Chargement de la fiche produit…" />
  if (isError || !data) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorBanner message="Produit introuvable." /></div>

  const { product, variants } = data
  const selectedVariant = variants.find((v) => v.grade === selectedGrade && v.color === selectedColor)

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem({ productId: product.id, grade: selectedGrade, color: selectedColor, quantity })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-surface-sunken">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-soft">Pas d’image</div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs uppercase tracking-wide text-ink-soft">{product.brand}</span>
            <h1 className="mt-1 text-2xl">{product.name}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.description}</p>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium text-ink-soft">Choisir un état et une couleur</h2>
            {variants.length > 0 ? (
              <GradeSelector
                variants={variants}
                selectedGrade={selectedGrade}
                selectedColor={selectedColor}
                onSelectGrade={handleSelectGrade}
                onSelectColor={setSelectedColor}
              />
            ) : (
              <ErrorBanner message="Aucune unité en stock pour ce produit." />
            )}
          </div>

          {selectedVariant && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                Quantité
                <input
                  type="number"
                  min={1}
                  max={selectedVariant.availableStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-16 rounded-md border border-surface-sunken px-2 py-1 font-mono text-sm"
                />
              </label>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || selectedVariant.availableStock === 0}
                className="flex-1 rounded-lg bg-ink py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
              >
                {isAdding ? 'Ajout…' : 'Ajouter au panier'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
