import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/catalogue/ProductGrid'
import CategoryFilter from '../components/catalogue/CategoryFilter'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

export default function HomePage() {
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(0)

  const { data, isLoading, isError } = useProducts({ category, page })

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(0)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl">Catalogue</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Électronique reconditionnée — prix ajustés en continu selon la demande et le stock.
          </p>
        </div>
        <CategoryFilter value={category} onChange={handleCategoryChange} />
      </div>

      {isLoading && <LoadingSpinner label="Chargement du catalogue…" />}
      {isError && <ErrorBanner message="Impossible de charger le catalogue." />}

      {data && (
        <>
          <ProductGrid products={data.content} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
