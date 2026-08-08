import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShieldCheck, RotateCcw, Truck, Minus, Plus } from 'lucide-react'
import { useProductDetail } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { CATEGORIES } from '../constants/catalogue'
import GradeSelector from '../components/catalogue/GradeSelector'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

const TRUST_ROW = [
  { icon: ShieldCheck, label: 'Garantie 12 mois' },
  { icon: RotateCcw, label: 'Retour sous 30 jours' },
  { icon: Truck, label: 'Livraison suivie' },
]

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

  const handleSelectGrade = (grade) => {
    setSelectedGrade(grade)
    const firstColorForGrade = data.variants.find((v) => v.grade === grade && v.availableStock > 0)
      ?? data.variants.find((v) => v.grade === grade)
    setSelectedColor(firstColorForGrade?.color ?? null)
    setQuantity(1)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <LoadingSpinner label="Chargement de la fiche produit…" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <ErrorBanner message="Produit introuvable." />
      </div>
    )
  }

  const { product, variants } = data
  const selectedVariant = variants.find((v) => v.grade === selectedGrade && v.color === selectedColor)
  const categoryLabel = CATEGORIES.find((c) => c.id === product.category)?.label

  // Photo spécifique à la couleur choisie si elle existe, sinon photo par
  // défaut du produit (voir la note sur Product.colorImages côté backend).
  const displayImage = (selectedColor && product.colorImages?.[selectedColor]) || product.imageUrl

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem({ productId: product.id, grade: selectedGrade, color: selectedColor, quantity })
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Fil d'Ariane */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-ink-soft">
        <Link to="/" className="transition hover:text-ink">Accueil</Link>
        <span>/</span>
        <Link to="/boutique" className="transition hover:text-ink">Boutique</Link>
        {categoryLabel && (
          <>
            <span>/</span>
            <Link to={`/boutique?category=${product.category}`} className="transition hover:text-ink">
              {categoryLabel}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-14 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden border border-line bg-surface-muted">
          {displayImage ? (
            <img
              key={displayImage}
              src={displayImage}
              alt={`${product.name}${selectedColor ? ` — ${selectedColor}` : ''}`}
              className="h-full w-full animate-fadein object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-soft">
              <span className="text-xs">Pas d’image</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="eyebrow">{product.brand}</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">{product.name}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-9 border-t border-line pt-1">
            <h2 className="pt-4 text-xs font-medium uppercase tracking-wide text-ink-soft">
              Choisir un état et une couleur
            </h2>
            <div className="mt-1">
              {variants.length > 0 ? (
                <GradeSelector
                  variants={variants}
                  selectedGrade={selectedGrade}
                  selectedColor={selectedColor}
                  onSelectGrade={handleSelectGrade}
                  onSelectColor={setSelectedColor}
                />
              ) : (
                <div className="py-4">
                  <ErrorBanner message="Aucune unité en stock pour ce produit." />
                </div>
              )}
            </div>
          </div>

          {selectedVariant && (
            <div className="mt-8 flex items-center gap-4 border-t border-line pt-8">
              <div className="flex items-center border border-line">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité"
                  className="p-2.5 text-ink-soft transition hover:text-ink disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-mono text-sm text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant.availableStock, q + 1))}
                  disabled={quantity >= selectedVariant.availableStock}
                  aria-label="Augmenter la quantité"
                  className="p-2.5 text-ink-soft transition hover:text-ink disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || selectedVariant.availableStock === 0}
                className="flex-1 rounded-full bg-ink py-3.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
              >
                {isAdding
                  ? 'Ajout…'
                  : selectedVariant.availableStock === 0
                    ? 'Rupture de stock'
                    : 'Ajouter au panier'}
              </button>
            </div>
          )}

          {/* Bandeau de confiance */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {TRUST_ROW.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-start gap-2">
                <Icon size={18} strokeWidth={1.6} className="text-ink-soft" />
                <span className="text-xs leading-snug text-ink-soft">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
