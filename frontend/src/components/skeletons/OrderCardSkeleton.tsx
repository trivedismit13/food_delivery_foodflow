export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 bg-stone-200 rounded w-24" />
          <div className="h-3 bg-stone-200 rounded w-32" />
        </div>
        <div className="h-6 w-20 bg-stone-200 rounded-full" />
      </div>
      <div className="h-px bg-stone-100 my-4" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-stone-200 rounded w-16" />
        <div className="h-8 w-24 bg-stone-200 rounded-lg" />
      </div>
    </div>
  )
}
