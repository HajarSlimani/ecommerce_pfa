import { Settings } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader icon={Settings} title="Paramètres" description="Réglages globaux de la plateforme." />

      <div className="mt-8 flex max-w-md flex-col items-start gap-2 rounded-lg border border-line bg-surface p-8 shadow-admin-sm">
        <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-ink-soft">
          <Settings size={16} strokeWidth={1.8} />
        </span>
        <p className="text-sm font-medium text-ink">Bientôt disponible.</p>
        <p className="text-sm leading-relaxed text-ink-soft">
          Pas encore de modèle de données pour des réglages globaux (devise,
          taxes, seuils du moteur de pricing, etc.). Cette page est prête
          côté navigation — le contenu sera ajouté quand ces réglages seront
          définis.
        </p>
      </div>
    </div>
  )
}
