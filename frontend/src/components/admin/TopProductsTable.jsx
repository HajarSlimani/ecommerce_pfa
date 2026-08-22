import PriceTag from '../common/PriceTag'

export default function TopProductsTable({ products }) {
  return (
    <div className="border border-line bg-surface p-5">
      <p className="eyebrow">Top produits vendus</p>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Pas encore de vente confirmée.</p>
      ) : (
        <div className="mt-4">
          <div className="grid grid-cols-[1fr_80px_100px] gap-3 border-b border-line pb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <span>Produit</span>
            <span>Vendus</span>
            <span>Revenu</span>
          </div>
          {products.map((p) => (
            <div
              key={p.productId}
              className="grid grid-cols-[1fr_80px_100px] items-center gap-3 border-b border-line py-2.5 text-sm last:border-b-0"
            >
              <span className="truncate text-ink">{p.productName}</span>
              <span className="font-mono text-xs text-ink-soft">{p.unitsSold}</span>
              <PriceTag price={p.revenue} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
