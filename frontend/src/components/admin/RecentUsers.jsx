import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import AdminAvatar from './AdminAvatar'

export default function RecentUsers({ users }) {
  return (
    <div className="border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Utilisateurs récents</p>
        <Link to="/admin/users" className="text-xs text-ink-soft transition hover:text-ink">
          Voir tout →
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Aucun utilisateur.</p>
      ) : (
        <div className="mt-3 flex flex-col">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5 text-sm transition hover:bg-surface-muted"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <AdminAvatar email={u.email} fullName={u.fullName} size={24} />
                <span className="truncate text-ink">{u.email}</span>
              </div>
              <span className="shrink-0 text-xs text-ink-soft">{formatDate(u.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
