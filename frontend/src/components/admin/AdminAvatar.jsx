/**
 * Avatar à initiales — dérivées de l'email (ou du nom si fourni) faute de
 * photo de profil dans le modèle actuel. Un cercle teinté brand plutôt
 * qu'une icône générique donne au header admin un point d'ancrage humain.
 */
export default function AdminAvatar({ email, fullName, size = 28 }) {
  const source = fullName?.trim() || email || '?'
  const initials = source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-medium text-white"
    >
      {initials || '?'}
    </span>
  )
}
