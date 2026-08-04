export default function ErrorBanner({ message = "Une erreur s'est produite." }) {
  return (
    <div className="rounded-lg border border-deal-up/30 bg-deal-up/5 px-4 py-3 text-sm text-deal-up">
      {message}
    </div>
  )
}
