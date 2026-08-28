import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'
import { useUpdateUser, useDeleteUser } from '../../hooks/useAdmin'
import AdminAvatar from './AdminAvatar'

export default function AdminUserRow({ user, isSelf }) {
  const [isEditing, setIsEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [fullName, setFullName] = useState(user.fullName || '')
  const [role, setRole] = useState(user.role)

  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const handleSave = () => {
    updateUser.mutate(
      { id: user.id, data: { fullName, role } },
      {
        onSuccess: () => {
          toast.success('Utilisateur mis à jour')
          setIsEditing(false)
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Échec de la mise à jour'),
      }
    )
  }

  const handleCancel = () => {
    setFullName(user.fullName || '')
    setRole(user.role)
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteUser.mutate(user.id, {
      onSuccess: () => toast.success('Utilisateur supprimé'),
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Échec de la suppression')
        setConfirmingDelete(false)
      },
    })
  }

  if (isEditing) {
    return (
      <div className="grid grid-cols-[1fr_1fr_100px_140px_90px] items-center gap-4 border-b border-line bg-surface-muted px-4 py-3 text-sm last:border-b-0">
        <span className="truncate text-ink-soft">{user.email}</span>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={role}
          disabled={isSelf}
          title={isSelf ? 'Tu ne peux pas retirer ton propre rôle admin' : undefined}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-md border border-line bg-surface px-2 py-1 text-xs uppercase tracking-wide text-ink outline-none transition focus:border-brand-300 disabled:opacity-50"
        >
          <option value="CLIENT">Client</option>
          <option value="ADMIN">Admin</option>
        </select>
        <span className="text-xs text-ink-soft">{formatDate(user.createdAt)}</span>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} disabled={updateUser.isPending} aria-label="Enregistrer" className="text-deal-down">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} aria-label="Annuler" className="text-ink-soft hover:text-ink">
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr_1fr_100px_140px_90px] items-center gap-4 border-b border-line px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-surface-muted/40">
      <div className="flex min-w-0 items-center gap-2.5">
        <AdminAvatar email={user.email} fullName={user.fullName} size={24} />
        <span className="truncate text-ink">{user.email}</span>
      </div>
      <span className="truncate text-ink-soft">{user.fullName || '—'}</span>
      <span>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
            user.role === 'ADMIN'
              ? 'border-brand-100 bg-brand-50 text-brand-600'
              : 'border-line bg-surface-sunken text-ink-soft'
          }`}
        >
          {user.role === 'ADMIN' ? 'Admin' : 'Client'}
        </span>
      </span>
      <span className="text-xs text-ink-soft">{formatDate(user.createdAt)}</span>

      {confirmingDelete ? (
        <div className="flex items-center gap-2 text-xs">
          <button onClick={handleDelete} disabled={deleteUser.isPending} className="font-medium text-deal-up">
            Confirmer
          </button>
          <button onClick={() => setConfirmingDelete(false)} className="text-ink-soft hover:text-ink">
            Annuler
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={() => setIsEditing(true)} aria-label="Modifier" className="text-ink-soft hover:text-ink">
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setConfirmingDelete(true)}
            disabled={isSelf}
            title={isSelf ? 'Tu ne peux pas supprimer ton propre compte' : undefined}
            aria-label="Supprimer"
            className="text-ink-soft hover:text-deal-up disabled:opacity-30"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
