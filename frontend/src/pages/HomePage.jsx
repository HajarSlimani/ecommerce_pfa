import { useState, useRef } from 'react'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES, GRADES } from '../constants/catalogue'
import ProductGrid from '../components/catalogue/ProductGrid'
import CategoryFilter from '../components/catalogue/CategoryFilter'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

const TRUST_ITEMS = [
  { value: '12 mois', label: 'Garantie constructeur' },
  { value: '42 points', label: 'Contrôle qualité' },
  { value: 'En continu', label: 'Prix ajustés par IA' },
  { value: 'Suivie', label: 'Livraison' },
]

export default function HomePage() {
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(0)
  const catalogueRef = useRef(null)

  const { data, isLoading, isError } = useProducts({ category, page })

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(0)
  }

  const scrollToCatalogue = (cat = '') => {
    if (cat) handleCategoryChange(cat)
    catalogueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <p className="eyebrow mb-6">Électronique reconditionnée</p>
        <h1 className="max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
          La seconde vie de la tech, <em className="font-normal italic text-brand-500">au prix juste.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Smartphones, ordinateurs et audio contrôlés, gradés et garantis. Chaque
          prix s’ajuste en continu à la demande et au stock disponible.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={() => scrollToCatalogue()}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Explorer le catalogue
          </button>
          <a
            href="#grades"
            className="text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Comment on grade nos produits →
          </a>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-line bg-surface-muted">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 py-10 sm:grid-cols-4 sm:gap-0">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className={`px-2 sm:px-6 ${i > 0 ? 'sm:border-l sm:border-line' : ''}`}
            >
              <p className="font-display text-2xl font-medium text-ink">{item.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category showcase */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow mb-3">Catégories</p>
        <h2 className="font-display text-3xl font-medium text-ink">Achetez par catégorie</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCatalogue(cat.id)}
              className="group flex aspect-[4/3] flex-col justify-end border border-line p-5 text-left transition hover:border-ink"
            >
              <span className="font-display text-lg font-medium text-ink">{cat.label}</span>
              <span className="mt-1 text-xs text-ink-soft transition group-hover:text-brand-600">
                Voir les produits →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grade explainer — signature element */}
      <section id="grades" className="border-t border-line bg-surface-muted">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow mb-3">Nos grades</p>
          <h2 className="max-w-xl font-display text-3xl font-medium text-ink">
            Un état, un prix. Jamais de surprise.
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {GRADES.map((g) => (
              <div key={g.code} className="border-t border-line pt-4">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
                  {g.code}
                </span>
                <p className="mt-2 font-display text-lg font-medium text-ink">{g.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section ref={catalogueRef} className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
        <div className="mb-10 flex flex-col gap-5">
          <div>
            <p className="eyebrow mb-3">Catalogue</p>
            <h2 className="font-display text-3xl font-medium text-ink">Tous les produits</h2>
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
      </section>
    </div>
  )
}
