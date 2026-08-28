/**
 * En-tête de page standard pour l'admin : icône + eyebrow + titre, avec un
 * emplacement optionnel pour une description et des actions à droite
 * (bouton "Nouveau", filtres, etc.). Centralise un motif répété à l'identique
 * sur les 7 pages admin pour garder la hiérarchie typographique cohérente.
 */
export default function PageHeader({ icon: Icon, eyebrow = 'Administration', title, description, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="mb-3 flex items-center gap-2">
          {Icon && (
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <Icon size={13} strokeWidth={2} />
            </span>
          )}
          <p className="eyebrow">{eyebrow}</p>
        </div>
        <h1 className="font-display text-3xl font-medium text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  )
}
