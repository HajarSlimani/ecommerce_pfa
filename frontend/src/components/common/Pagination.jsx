export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 py-6 font-mono text-sm">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 0}
        className="rounded-md border border-surface-sunken px-3 py-1.5 disabled:opacity-30"
      >
        ←
      </button>
      <span className="text-ink-soft">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= totalPages}
        className="rounded-md border border-surface-sunken px-3 py-1.5 disabled:opacity-30"
      >
        →
      </button>
    </div>
  )
}
