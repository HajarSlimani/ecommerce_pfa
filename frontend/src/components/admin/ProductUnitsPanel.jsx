import toast from 'react-hot-toast'
import { Boxes } from 'lucide-react'
import { UNIT_STATUS } from '../../constants/catalogue'
import { useProductUnits, useUpdateUnitStatus } from '../../hooks/useAdmin'
import { formatDate } from '../../utils/formatDate'
import PriceTag from '../common/PriceTag'
import LoadingSpinner from '../common/LoadingSpinner'
import ProductUnitForm from './ProductUnitForm'

const ALL_STATUSES = Object.keys(UNIT_STATUS)

export default function ProductUnitsPanel({ productId }) {
  const { data: units, isLoading } = useProductUnits(productId)
  const updateStatus = useUpdateUnitStatus()

  const handleStatusChange = (unitId, status) => {
    updateStatus.mutate(
      { productId, unitId, status },
      { onError: (err) => toast.error(err.response?.data?.message || 'Échec de la mise à jour') }
    )
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-6 shadow-admin-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <Boxes size={13} />
        </span>
        <p className="eyebrow">Stock ({units?.length ?? 0} unité{(units?.length ?? 0) > 1 ? 's' : ''})</p>
      </div>

      {isLoading ? (
        <div className="mt-4"><LoadingSpinner label="Chargement du stock…" /></div>
      ) : units?.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Aucune unité en stock pour ce produit.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-md border border-line">
          <div className="grid grid-cols-[1fr_60px_100px_90px_100px_140px] gap-3 bg-surface-muted/60 px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <span>N° de série</span>
            <span>Grade</span>
            <span>Couleur</span>
            <span>Prix</span>
            <span>Entrée</span>
            <span>Statut</span>
          </div>
          {units?.map((unit) => (
            <div
              key={unit.id}
              className="grid grid-cols-[1fr_60px_100px_90px_100px_140px] items-center gap-3 border-t border-line px-3 py-2.5 text-sm transition-colors hover:bg-surface-muted/40"
            >
              <span className="truncate font-mono text-xs text-ink">{unit.serialNumber}</span>
              <span className="font-mono text-xs text-ink-soft">{unit.grade}</span>
              <span className="truncate text-ink-soft">{unit.color}</span>
              <PriceTag price={unit.currentPrice} size="sm" />
              <span className="text-xs text-ink-soft">{formatDate(unit.enteredStockAt)}</span>
              <select
                value={unit.status}
                disabled={updateStatus.isPending}
                onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide outline-none transition focus:ring-2 focus:ring-brand-100 disabled:opacity-50 ${
                  UNIT_STATUS[unit.status]?.badgeClassName || 'bg-surface-sunken text-ink-soft border-line'
                }`}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{UNIT_STATUS[s].label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5">
        <ProductUnitForm productId={productId} />
      </div>
    </div>
  )
}
