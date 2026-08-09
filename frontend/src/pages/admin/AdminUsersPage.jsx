import { useState } from 'react'
import { useAdminUsers } from '../../hooks/useAdmin'
import { formatDate } from '../../utils/formatDate'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function AdminUsersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useAdminUsers(page)

  return (
    <div>
      <p className="eyebrow mb-3">Administration</p>
      <h1 className="font-display text-3xl font-medium text-ink">Utilisateurs</h1>

      {isLoading && <div className="mt-8"><LoadingSpinner label="Chargement des utilisateurs…" /></div>}
      {isError && <div className="mt-8"><ErrorBanner message="Impossible de charger les utilisateurs." /></div>}

      {data && (
        <div className="mt-8 border border-line bg-surface">
          <div className="grid grid-cols-[1fr_1fr_100px_140px] gap-4 border-b border-line px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <span>Email</span>
            <span>Nom</span>
            <span>Rôle</span>
            <span>Inscrit le</span>
          </div>

          {data.content.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_1fr_100px_140px] items-center gap-4 border-b border-line px-4 py-3 text-sm last:border-b-0"
            >
              <span className="truncate text-ink">{u.email}</span>
              <span className="truncate text-ink-soft">{u.fullName || '—'}</span>
              <span
                className={`text-xs font-medium uppercase tracking-wide ${
                  u.role === 'ADMIN' ? 'text-brand-600' : 'text-ink-soft'
                }`}
              >
                {u.role === 'ADMIN' ? 'Admin' : 'Client'}
              </span>
              <span className="text-xs text-ink-soft">{formatDate(u.createdAt)}</span>
            </div>
          ))}

          {data.content.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-ink-soft">Aucun utilisateur.</p>
          )}
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  )
}
