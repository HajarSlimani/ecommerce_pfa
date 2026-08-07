import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <div className="py-16 text-center text-sm text-ink-soft">
        Aucun produit ne correspond à ces critères.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
