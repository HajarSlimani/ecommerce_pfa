import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import ProductGrid from '../catalogue/ProductGrid'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ProductRail({ eyebrow, title, sort, shopLink = '/boutique' }) {
  const { data, isLoading } = useProducts({ size: 4, sort })

  if (!isLoading && !data?.content?.length) return null

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="font-display text-3xl font-medium text-ink">{title}</h2>
        </div>
        <Link to={shopLink} className="hidden text-sm font-medium text-ink-soft transition hover:text-ink sm:block">
          Voir tout →
        </Link>
      </div>

      {isLoading ? <LoadingSpinner /> : <ProductGrid products={data.content} />}
    </section>
  )
}
