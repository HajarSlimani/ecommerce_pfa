import { useState } from 'react'
import { usePricingHistory } from '../../hooks/usePricing'
import PriceHistoryTable from '../../components/admin/PriceHistoryTable'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function AdminPricingHistoryPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = usePricingHistory({ page })

  return (
    <div>
      <h1 className="mb-6 text-2xl">Historique des ajustements de prix</h1>

      {isLoading && <LoadingSpinner label="Chargement de l'historique…" />}
      {isError && <ErrorBanner message="Impossible de charger l'historique." />}

      {data && (
        <>
          <PriceHistoryTable entries={data.content} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
