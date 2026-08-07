export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square border-b border-line bg-surface-sunken" />
          <div className="pt-4">
            <div className="h-2.5 w-16 bg-surface-sunken" />
            <div className="mt-2.5 h-4 w-3/4 bg-surface-sunken" />
            <div className="mt-3 h-3 w-20 bg-surface-sunken" />
          </div>
        </div>
      ))}
    </div>
  )
}
