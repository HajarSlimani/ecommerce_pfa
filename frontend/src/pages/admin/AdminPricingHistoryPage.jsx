import { useState } from 'react'
import { History } from 'lucide-react'
import { usePricingHistory } from '../../hooks/usePricing'
import PageHeader from '../../components/admin/PageHeader'
import PriceHistoryTable from '../../components/admin/PriceHistoryTable'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function AdminPricingHistoryPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = usePricingHistory({ page })

  return (
    <div>
      <PageHeader
        icon={History}
        title="Historique des ajustements de prix"
        description="Chaque décision du moteur de tarification, avec l'impact revenu estimé au moment de la décision."
      />

      {isLoading && <div className="mt-8"><LoadingSpinner label="Chargement de l'historique…" /></div>}
      {isError && <div className="mt-8"><ErrorBanner message="Impossible de charger l'historique." /></div>}

      {data && (
        <div className="mt-8">
          <PriceHistoryTable entries={data.content} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
