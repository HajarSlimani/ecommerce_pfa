import PriceTag from '../common/PriceTag'

export default function TopProductsTable({ products }) {
  return (
    <div className="border border-line bg-surface p-5">
      <p className="eyebrow">Top produits vendus</p>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Pas encore de vente confirmée.</p>
      ) : (
        <div className="mt-3">
          <div className="grid grid-cols-[20px_1fr_80px_100px] gap-3 px-2 pb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <span></span>
            <span>Produit</span>
            <span>Vendus</span>
            <span>Revenu</span>
          </div>
          {products.map((p, i) => (
            <div
              key={p.productId}
              className="grid grid-cols-[20px_1fr_80px_100px] items-center gap-3 rounded-md px-2 py-2.5 text-sm transition hover:bg-surface-muted"
            >
              <span className="font-mono text-xs text-ink-soft/60">{i + 1}</span>
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
