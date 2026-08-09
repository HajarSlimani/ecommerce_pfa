export default function AdminSettingsPage() {
  return (
    <div>
      <p className="eyebrow mb-3">Administration</p>
      <h1 className="font-display text-3xl font-medium text-ink">Paramètres</h1>

      <div className="mt-8 flex flex-col items-start gap-2 border border-line bg-surface p-8">
        <p className="text-sm text-ink">Bientôt disponible.</p>
        <p className="max-w-md text-sm leading-relaxed text-ink-soft">
          Pas encore de modèle de données pour des réglages globaux (devise,
          taxes, seuils du moteur de pricing, etc.). Cette page est prête
          côté navigation — le contenu sera ajouté quand ces réglages seront
          définis.
        </p>
      </div>
    </div>
  )
}
