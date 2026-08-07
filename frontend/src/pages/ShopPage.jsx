import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/catalogue/ProductGrid'
import CategoryFilter from '../components/catalogue/CategoryFilter'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || ''

  const [category, setCategory] = useState(initialCategory)
  const [page, setPage] = useState(0)

  const { data, isLoading, isError } = useProducts({ category, page })

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(0)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="eyebrow mb-3">Boutique</p>
      <h1 className="font-display text-4xl font-medium text-ink">Tous les produits</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
        Chaque référence est vendue par grade (état) avec un prix ajusté en
        continu selon la demande et le stock disponible.
      </p>

      <div className="mt-10">
        <CategoryFilter value={category} onChange={handleCategoryChange} />
      </div>

      <div className="mt-10">
        {isLoading && <LoadingSpinner label="Chargement du catalogue…" />}
        {isError && <ErrorBanner message="Impossible de charger le catalogue." />}

        {data && (
          <>
            <ProductGrid products={data.content} />
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
