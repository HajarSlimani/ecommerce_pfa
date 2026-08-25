import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Eye, EyeOff, CheckCircle2, CircleAlert } from 'lucide-react'
import { useProfile, useUpdateProfile, useChangePassword } from '../hooks/useProfile'
import { authApi } from '../api/authApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'

const memberSince = (isoString) =>
  isoString
    ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(isoString))
    : '—'

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()

  const [fullName, setFullName] = useState('')
  useEffect(() => {
    if (profile?.fullName) setFullName(profile.fullName)
  }, [profile?.fullName])

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showPasswords, setShowPasswords] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      await authApi.resendVerification()
      toast.success('Email de vérification renvoyé')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de l’envoi')
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <LoadingSpinner label="Chargement du profil…" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <ErrorBanner message="Impossible de charger le profil." />
      </div>
    )
  }

  const handleSaveInfo = (e) => {
    e.preventDefault()
    updateProfile.mutate(
      { fullName },
      {
        onSuccess: () => toast.success('Profil mis à jour'),
        onError: (err) => toast.error(err.response?.data?.message || 'Échec de la mise à jour'),
      }
    )
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) {
      toast.error('Les nouveaux mots de passe ne correspondent pas')
      return
    }
    changePassword.mutate(
      { currentPassword: passwords.current, newPassword: passwords.next },
      {
        onSuccess: () => {
          toast.success('Mot de passe modifié')
          setPasswords({ current: '', next: '', confirm: '' })
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Échec du changement de mot de passe'),
      }
    )
  }

  const inputClass =
    'border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-ink disabled:text-ink-soft disabled:cursor-not-allowed'

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="eyebrow mb-3">Compte</p>
      <h1 className="font-display text-4xl font-medium text-ink">Mon profil</h1>
      <p className="mt-2 text-sm text-ink-soft">Membre depuis le {memberSince(profile.createdAt)}</p>

      <form onSubmit={handleSaveInfo} className="mt-10 flex flex-col gap-5 border border-line p-6">
        <p className="eyebrow">Informations</p>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Nom complet</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Email</label>
          <input value={profile.email} disabled className={inputClass} />
          <div className="flex items-center gap-1.5 text-xs">
            {profile.emailVerified ? (
              <>
                <CheckCircle2 size={13} className="text-deal-down" />
                <span className="text-ink-soft">Email vérifié</span>
              </>
            ) : (
              <>
                <CircleAlert size={13} className="text-deal-up" />
                <span className="text-ink-soft">Non vérifié —</span>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="font-medium text-ink underline transition hover:text-brand-600 disabled:opacity-40"
                >
                  {isResending ? 'Envoi…' : 'renvoyer l’email'}
                </button>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="mt-2 self-start rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
        >
          {updateProfile.isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="mt-8 flex flex-col gap-5 border border-line p-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Mot de passe</p>
          <button
            type="button"
            onClick={() => setShowPasswords((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-ink-soft transition hover:text-ink"
          >
            {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPasswords ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Mot de passe actuel</label>
          <input
            required
            type={showPasswords ? 'text' : 'password'}
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Nouveau mot de passe</label>
          <input
            required
            minLength={8}
            type={showPasswords ? 'text' : 'password'}
            value={passwords.next}
            onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-soft">Confirmer le nouveau mot de passe</label>
          <input
            required
            type={showPasswords ? 'text' : 'password'}
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="mt-2 self-start rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
        >
          {changePassword.isPending ? 'Modification…' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  )
}
