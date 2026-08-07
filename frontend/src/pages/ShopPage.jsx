import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { useProductSearch } from '../hooks/useProducts'
import { CATEGORIES, GRADES } from '../constants/catalogue'
import ProductGrid from '../components/catalogue/ProductGrid'
import ProductGridSkeleton from '../components/catalogue/ProductGridSkeleton'
import CategoryFilter from '../components/catalogue/CategoryFilter'
import GradeFilter from '../components/catalogue/GradeFilter'
import SortSelect from '../components/catalogue/SortSelect'
import Pagination from '../components/common/Pagination'
import ErrorBanner from '../components/common/ErrorBanner'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [grade, setGrade] = useState(searchParams.get('grade') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '')
  const [qInput, setQInput] = useState(searchParams.get('q') || '')
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(0)

  // Debounce : on évite de tirer une requête à chaque frappe.
  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 400)
    return () => clearTimeout(t)
  }, [qInput])

  // Filtres partagables par URL, sans polluer l'historique de navigation.
  useEffect(() => {
    const params = {}
    if (category) params.category = category
    if (grade) params.grade = grade
    if (sort) params.sort = sort
    if (q) params.q = q
    setSearchParams(params, { replace: true })
  }, [category, grade, sort, q]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(0)
  }, [category, grade, sort, q])

  const { data, isLoading, isFetching, isError } = useProductSearch({ category, grade, q, sort, page })

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label
  const gradeLabel = GRADES.find((g) => g.code === grade)?.label

  const activeFilters = [
    category && { key: 'category', label: categoryLabel, clear: () => setCategory('') },
    grade && { key: 'grade', label: gradeLabel, clear: () => setGrade('') },
    q && { key: 'q', label: `« ${q} »`, clear: () => { setQInput(''); setQ('') } },
  ].filter(Boolean)

  const clearAll = () => {
    setCategory('')
    setGrade('')
    setQInput('')
    setQ('')
    setSort('')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="eyebrow mb-3">Boutique</p>
      <h1 className="font-display text-4xl font-medium text-ink">Tous les produits</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
        Chaque référence est vendue par grade (état) avec un prix ajusté en
        continu selon la demande et le stock disponible.
      </p>

      {/* Barre de filtres */}
      <div className="sticky top-20 z-10 -mx-6 mt-10 border-y border-line bg-surface/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CategoryFilter value={category} onChange={setCategory} />
            <input
              type="text"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Rechercher un produit…"
              className="w-full max-w-[220px] border-b border-line bg-transparent py-1 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <GradeFilter value={grade} onChange={setGrade} />
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      {/* Chips de filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={f.clear}
              className="flex items-center gap-1.5 border border-line px-2.5 py-1 text-xs text-ink-soft transition hover:border-ink hover:text-ink"
            >
              {f.label}
              <X size={12} />
            </button>
          ))}
          <button onClick={clearAll} className="text-xs text-ink-soft underline transition hover:text-ink">
            Réinitialiser
          </button>
        </div>
      )}

      {/* Compteur de résultats */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {isLoading
            ? ' '
            : `${data?.totalElements ?? 0} produit${(data?.totalElements ?? 0) > 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="mt-4">
        {isError && <ErrorBanner message="Impossible de charger le catalogue." />}

        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <ProductGrid products={data?.content} />
          </div>
        )}

        {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
      </div>
    </div>
  )
}
