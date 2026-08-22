import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'

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
        <div className="mt-4 flex flex-col">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between border-b border-line py-2.5 text-sm last:border-b-0">
              <span className="truncate text-ink">{u.email}</span>
              <span className="shrink-0 text-xs text-ink-soft">{formatDate(u.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
