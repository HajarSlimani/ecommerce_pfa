import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useProductDetail } from '../../hooks/useProducts'
import AdminProductList from '../../components/admin/AdminProductList'
import ProductEditForm from '../../components/admin/ProductEditForm'
import ColorImagesManager from '../../components/admin/ColorImagesManager'
import ProductUnitsPanel from '../../components/admin/ProductUnitsPanel'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function AdminProductsPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [searchParams] = useSearchParams()
  // Alimenté par la recherche globale du header admin (?q=...). Filtre
  // simplement la liste déjà chargée en mémoire — pas besoin de taper sur
  // /products/search ici, la liste admin n'est pas paginée.
  const q = searchParams.get('q')?.toLowerCase() || ''

  // Liste à plat, sans pagination : suffisant pour un catalogue de la taille
  // d'un projet étudiant, et évite la complexité d'une pagination dans une
  // colonne de sélection.
  const { data: listData, isLoading: isListLoading } = useProducts({ size: 100 })
  const { data: detail, isLoading: isDetailLoading, isError: isDetailError } = useProductDetail(selectedId)

  const products = (listData?.content || []).filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
  )

  return (
    <div>
      <p className="eyebrow mb-3">Administration</p>
      <h1 className="font-display text-3xl font-medium text-ink">Produits</h1>
      {q && (
        <p className="mt-2 text-sm text-ink-soft">
          Résultats pour « {searchParams.get('q')} » ({products.length})
        </p>
      )}

      <div className="mt-8 flex gap-8">
        {isListLoading ? (
          <div className="w-64 shrink-0"><LoadingSpinner label="Chargement…" /></div>
        ) : (
          <AdminProductList
            products={products}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNew={() => setSelectedId(null)}
          />
        )}

        <div className="flex-1 flex flex-col gap-6">
          {selectedId === null ? (
            <ProductEditForm product={null} onCreated={(created) => setSelectedId(created.id)} />
          ) : isDetailLoading ? (
            <LoadingSpinner label="Chargement du produit…" />
          ) : isDetailError || !detail ? (
            <ErrorBanner message="Impossible de charger ce produit." />
          ) : (
            <>
              <ProductEditForm product={detail.product} />
              <ColorImagesManager productId={selectedId} colorImages={detail.product.colorImages} />
              <ProductUnitsPanel productId={selectedId} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
