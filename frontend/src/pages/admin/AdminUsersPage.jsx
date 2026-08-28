import { useState } from 'react'
import { Users } from 'lucide-react'
import { useAdminUsers } from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'
import PageHeader from '../../components/admin/PageHeader'
import AdminUserRow from '../../components/admin/AdminUserRow'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function AdminUsersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useAdminUsers(page)
  const { user: currentUser } = useAuth()

  return (
    <div>
      <PageHeader icon={Users} title="Utilisateurs" description="Comptes clients et administrateurs de la plateforme." />

      {isLoading && <div className="mt-8"><LoadingSpinner label="Chargement des utilisateurs…" /></div>}
      {isError && <div className="mt-8"><ErrorBanner message="Impossible de charger les utilisateurs." /></div>}

      {data && (
        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-surface shadow-admin-sm">
          <div className="grid grid-cols-[1fr_1fr_100px_140px_90px] gap-4 border-b border-line bg-surface-muted/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <span>Email</span>
            <span>Nom</span>
            <span>Rôle</span>
            <span>Inscrit le</span>
            <span>Actions</span>
          </div>

          {data.content.map((u) => (
            <AdminUserRow key={u.id} user={u} isSelf={u.id === currentUser?.userId} />
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
