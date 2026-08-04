import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductForm from '../../components/admin/ProductForm'
import ProductUnitForm from '../../components/admin/ProductUnitForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminProductsPage() {
  const { data, isLoading } = useProducts({ size: 50 })
  const [selectedProductId, setSelectedProductId] = useState(null)

  return (
    <div>
      <h1 className="mb-6 text-2xl">Produits & stock</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <ProductForm onCreated={(p) => setSelectedProductId(p.id)} />
          <ProductUnitForm productId={selectedProductId} />
        </div>

        <div className="rounded-xl border border-surface-sunken bg-surface p-5">
          <h3 className="mb-3 font-display text-sm font-semibold">Produits existants</h3>
          {isLoading ? (
            <LoadingSpinner label="Chargement…" />
          ) : (
            <ul className="flex flex-col gap-1">
              {data?.content?.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setSelectedProductId(p.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                      selectedProductId === p.id
                        ? 'bg-brand-50 text-brand-700'
                        : 'hover:bg-surface-muted'
                    }`}
                  >
                    <span className="font-mono text-xs text-ink-soft">#{p.id}</span> {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
