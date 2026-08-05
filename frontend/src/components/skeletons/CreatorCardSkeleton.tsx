export function CreatorCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-stone-200" />
        <div className="space-y-2">
          <div className="h-5 bg-stone-200 rounded w-24" />
          <div className="h-4 bg-stone-200 rounded w-16" />
        </div>
      </div>
      <div className="w-20 h-8 rounded-lg bg-stone-200" />
    </div>
  )
}
