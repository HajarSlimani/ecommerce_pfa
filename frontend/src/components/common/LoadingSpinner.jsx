export default function LoadingSpinner({ label = 'Chargement…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-surface-sunken border-t-brand-500" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
